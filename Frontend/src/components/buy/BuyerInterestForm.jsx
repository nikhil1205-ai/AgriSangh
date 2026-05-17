import { useState } from "react";
import { Send, X, Loader2 } from "lucide-react";

const BuyerInterestForm = ({ batchId, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    buyerName: "",
    businessName: "",
    phone: "",
    email: "",
    quantity: "",
    paymentMethod: "Pending",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(batchId, form);
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit interest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Interest Recorded!</h3>
        <p className="text-slate-600 mb-6">The group leader will be notified of your interest.</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Express Interest</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
          <input
            required
            value={form.buyerName}
            onChange={(e) => setForm((p) => ({ ...p, buyerName: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
          <input
            required
            value={form.businessName}
            onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="ABC Traders"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="buyer@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Required Quantity (tons)</label>
          <input
            required
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 20"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Payment</label>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Pending">Pending</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Message (Optional)</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Any specific requirements or questions..."
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send size={16} /> I'm Interested
          </>
        )}
      </button>
    </form>
  );
};

export default BuyerInterestForm;