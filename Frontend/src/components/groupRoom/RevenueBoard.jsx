import { useState, useMemo } from "react";
import { Plus, X, Check, AlertCircle, Users, DollarSign, Percent } from "lucide-react";
import { useAlert } from "../../hooks/useAlert";
import { createRevenue } from "../../services/dashboardService";

const RevenueBoard = ({ revenue = {}, group = {}, role = "farmer", contributions = [] }) => {
  const { showError, showSuccess } = useAlert();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ totalRevenue: "", expense: "", distribution: [] });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get members from group or contributions
  const members = useMemo(() => {
    if (group.members && group.members.length > 0) {
      return group.members.map((m, idx) => ({
        id: m.farmerId || m.uid || m.id || `member-${idx}`,
        farmerId: m.farmerId || m.uid || "",
        name: m.fullName || m.name || m.farmerId || `Farmer ${idx + 1}`,
        farmer: m.farmer || m._id,
      }));
    }

    const uniqueFarmers = new Map();
    (contributions || []).forEach((contrib) => {
      (contrib.landContribution || []).forEach((land) => {
        const farmerId = land.farmerId || land.farmer?.farmerId;
        const name = land.farmer?.fullName || farmerId || "Unknown";
        if (farmerId && !uniqueFarmers.has(farmerId)) {
          uniqueFarmers.set(farmerId, {
            id: farmerId,
            farmerId,
            name,
            farmer: land.farmer?._id || land.farmer,
          });
        }
      });
    });
    return Array.from(uniqueFarmers.values());
  }, [group.members, contributions]);

  const startAdding = () => {
    const initialDistribution = members.map((m) => ({
      farmerId: m.farmerId,
      name: m.name,
      farmer: m.farmer,
      amountInRupee: "",
      amountInQuintal: "",
      percentage: 0,
    }));
    setForm({ totalRevenue: "", expense: "", distribution: initialDistribution });
    setErrors({});
    setIsAdding(true);
  };

  const handleTotalRevenueChange = (value) => {
    setForm((prev) => ({ ...prev, totalRevenue: value }));
    setErrors((prev) => ({ ...prev, totalRevenue: "" }));
  };

  const handleExpenseChange = (value) => {
    setForm((prev) => ({ ...prev, expense: value }));
    setErrors((prev) => ({ ...prev, expense: "" }));
  };

  const handleDistributionChange = (index, field, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      updated.distribution = [...prev.distribution];
      updated.distribution[index] = { ...updated.distribution[index], [field]: value };

      // Auto-calculate percentage when amountInRupee changes
      if (field === "amountInRupee" && prev.totalRevenue > 0) {
        const amount = Number(value) || 0;
        const percentage = (amount / Number(prev.totalRevenue)) * 100;
        updated.distribution[index].percentage = Number(percentage.toFixed(2));
      }

      return updated;
    });
    setErrors((prev) => ({ ...prev, [`dist_${index}`]: "" }));
  };

  // Calculate summary
  const summary = useMemo(() => {
    const total = Number(form.totalRevenue) || 0;
    const exp = Number(form.expense) || 0;
    const distributed = form.distribution.reduce(
      (sum, d) => sum + (Number(d.amountInRupee) || 0),
      0
    );
    const remaining = total - exp - distributed;
    return { total, expense: exp, distributed, remaining };
  }, [form]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!form.totalRevenue || Number(form.totalRevenue) <= 0) {
      newErrors.totalRevenue = "Total revenue must be greater than 0";
    }

    if (Number(form.expense) < 0) {
      newErrors.expense = "Expense cannot be negative";
    }

    form.distribution.forEach((dist, idx) => {
      const amountRupee = Number(dist.amountInRupee) || 0;
      const amountQuintal = Number(dist.amountInQuintal) || 0;
      if (amountRupee < 0) {
        newErrors[`dist_${idx}_rupee`] = "Amount cannot be negative";
      }
      if (amountQuintal < 0) {
        newErrors[`dist_${idx}_quintal`] = "Amount cannot be negative";
      }
    });

    if (summary.remaining < 0) {
      newErrors.general = "Distributed amount exceeds available balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit revenue
  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        groupId: group.groupId || group.id,
        totalRevenue: Number(form.totalRevenue),
        expense: Number(form.expense) || 0,
        distribution: form.distribution.map((d) => ({
          farmerId: d.farmerId,
          farmer: d.farmer,
          amountInRupee: Number(d.amountInRupee) || 0,
          amountInQuintal: Number(d.amountInQuintal) || 0,
        })),
      };

      await createRevenue(payload);
      setIsAdding(false);
      showSuccess("Revenue distributed successfully!");
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || "Failed to create revenue");
    } finally {
      setSubmitting(false);
    }
  };

  // View mode - show existing revenue
  const renderViewMode = () => (
    <>
      {/* Group Members */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-green-700" />
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Group Members</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <span key={m.farmerId} className="text-sm bg-white px-3 py-1 rounded-full border border-green-200 text-slate-700">
              {m.name} — {m.farmerId}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">₹{revenue.totalRevenue?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-3xl bg-red-50 p-5 border border-red-200">
          <p className="text-xs uppercase tracking-[0.2em] text-red-600">Expense</p>
          <p className="mt-2 text-2xl font-bold text-red-700">₹{revenue.expense?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-3xl bg-green-50 p-5 border border-green-200">
          <p className="text-xs uppercase tracking-[0.2em] text-green-600">Distributed</p>
          <p className="mt-2 text-2xl font-bold text-green-700">
            ₹{(revenue.distribution || []).reduce((sum, d) => sum + (d.amountInRupee || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-5 border border-emerald-200">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Farmers</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{(revenue.distribution || []).length}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {(revenue.distribution || []).map((item, index) => (
          <div key={index} className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {item.farmerId || item.farmer?.farmerId || `Farmer ${index + 1}`}
                </p>
                {item.farmer?.fullName && (
                  <p className="text-xs text-slate-500">{item.farmer.fullName}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">₹{item.amountInRupee?.toLocaleString() || item.amount?.toLocaleString() || 0}</p>
                {item.amountInQuintal > 0 && (
                  <p className="text-xs text-slate-500">{item.amountInQuintal} qtl</p>
                )}
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                style={{ width: `${item.percentage || 0}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 text-right">{item.percentage?.toFixed(1) || 0}%</p>
          </div>
        ))}
        {(!revenue.distribution || revenue.distribution.length === 0) && (
          <div className="text-center py-8 text-slate-500">
            <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
            <p>No revenue distributed yet</p>
          </div>
        )}
      </div>
    </>
  );

  // Add mode - revenue distribution form
  const renderAddMode = () => (
    <>
      {/* Group Members Summary */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-green-700" />
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Distributing to {members.length} farmers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <span key={m.farmerId} className="text-sm bg-white px-3 py-1 rounded-full border border-green-200 text-slate-700">
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* Revenue & Expense Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border border-emerald-200">
          <label className="block text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold mb-2">
            Total Revenue (₹)
          </label>
          <input
            type="number"
            value={form.totalRevenue}
            onChange={(e) => handleTotalRevenueChange(e.target.value)}
            placeholder="Enter total revenue"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.totalRevenue ? "border-red-400 bg-red-50" : "border-emerald-200 bg-white"
            } focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-semibold`}
          />
          {errors.totalRevenue && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.totalRevenue}
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 p-5 border border-red-200">
          <label className="block text-xs uppercase tracking-[0.2em] text-red-700 font-semibold mb-2">
            Group Expense (₹)
          </label>
          <input
            type="number"
            value={form.expense}
            onChange={(e) => handleExpenseChange(e.target.value)}
            placeholder="Transport, irrigation, labor..."
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.expense ? "border-red-400 bg-red-50" : "border-red-200 bg-white"
            } focus:ring-2 focus:ring-red-500 outline-none text-lg font-semibold`}
          />
          {errors.expense && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.expense}
            </p>
          )}
        </div>
      </div>

      {/* Distribution Table */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Farmer Distribution</p>
        {form.distribution.map((dist, idx) => (
          <div
            key={dist.farmerId}
            className={`rounded-2xl bg-white p-4 border ${
              errors[`dist_${idx}_rupee`] || errors[`dist_${idx}_quintal`] ? "border-red-300" : "border-slate-100"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{dist.name}</p>
                  <p className="text-xs text-slate-500">{dist.farmerId}</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-xl">
                  <Percent size={14} className="text-green-700" />
                  <span className="text-sm text-green-700 font-bold">{dist.percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Amount (₹)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">₹</span>
                    <input
                      type="number"
                      value={dist.amountInRupee}
                      onChange={(e) => handleDistributionChange(idx, "amountInRupee", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-right"
                    />
                  </div>
                  {errors[`dist_${idx}_rupee`] && (
                    <p className="text-red-600 text-xs mt-1">{errors[`dist_${idx}_rupee`]}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Amount (qtl)</label>
                  <input
                    type="number"
                    value={dist.amountInQuintal}
                    onChange={(e) => handleDistributionChange(idx, "amountInQuintal", e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-right"
                  />
                  {errors[`dist_${idx}_quintal`] && (
                    <p className="text-red-600 text-xs mt-1">{errors[`dist_${idx}_quintal`]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-3xl bg-slate-100 p-5 border border-slate-200">
        <p className="text-sm font-semibold text-slate-700 mb-4">Distribution Summary</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-lg font-bold text-slate-900">₹{summary.total.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-slate-500">Expense</p>
            <p className="text-lg font-bold text-red-600">₹{summary.expense.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-slate-500">Distributed</p>
            <p className="text-lg font-bold text-green-600">₹{summary.distributed.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className={`text-lg font-bold ${summary.remaining < 0 ? "text-red-600" : "text-orange-600"}`}>
              ₹{summary.remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Distributed</span>
            <span>{summary.total > 0 ? ((summary.distributed / summary.total) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
              style={{ width: `${summary.total > 0 ? (summary.distributed / summary.total) * 100 : 0}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all"
              style={{ width: `${summary.total > 0 ? (summary.expense / summary.total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-600">Dist.</span>
            <span className="text-red-600">Exp.</span>
            <span className="text-orange-600">Rem.</span>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {errors.general}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setIsAdding(false)}
          className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <X size={16} /> Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || summary.remaining < 0}
          className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            submitting || summary.remaining < 0
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {submitting ? (
            "Submitting..."
          ) : (
            <>
              <Check size={16} /> Confirm Distribution
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Revenue</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Distribution Preview</h3>
        </div>
        {role === "leader" && !isAdding && (
          <button
            onClick={startAdding}
            className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-all"
          >
            <Plus size={14} /> Add Revenue
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {isAdding ? renderAddMode() : renderViewMode()}
      </div>
    </div>
  );
};

export default RevenueBoard;