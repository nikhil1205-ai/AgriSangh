import { useState } from "react";
import { PlusSquare, CheckCircle2, Package, Truck, UserPlus, X, Calendar } from "lucide-react";
import { updateBatchStage } from "../../services/dashboardService";

const STAGES = ["Planning Stage", "Growing Stage", "Harvest Stage", "Sold"];

const STATUS_COLORS = {
  "not started": "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

const STATUS_LABELS = {
  "not started": "Not Started",
  pending: "In Progress",
  completed: "Completed",
};

const BatchManagement = ({ batches = [], role, onCreate, onUpdateStatus }) => {
  const [batchForm, setBatchForm] = useState({ cropType: "", estimatedProduction: "", farmers: "", season: "", status: "active" });
  const [showModal, setShowModal] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [stageForm, setStageForm] = useState({});

  // Single batch per group
  const batch = batches?.[0] || null;
  const hasBatch = !!batch;

  const handleCreate = () => {
    onCreate?.(batchForm);
    setBatchForm({ cropType: "", estimatedProduction: "", farmers: "", season: "", status: "active" });
    setShowModal(false);
  };

  const openModal = () => {
    if (batch) {
      // Pre-fill form with existing batch data
      setBatchForm({
        cropType: batch.cropType || "",
        estimatedProduction: batch.estimatedProduction || "",
        season: batch.season || "",
        status: batch.status || "active",
      });
    } else {
      setBatchForm({ cropType: "", estimatedProduction: "", farmers: "", season: "", status: "active" });
    }
    setShowModal(true);
  };

  const handleStageUpdate = async (batchId, stageName, progressStatus) => {
    try {
      await updateBatchStage(batchId, { stageName, progressStatus });
      onUpdateStatus?.();
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const renderTimeline = (batch) => {
    const timeline = batch.statusTimeline || [];
    const currentStageIndex = timeline.findIndex((s) => s.progressStatus === "pending");
    return (
      <div className="mt-4 flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2" style={{ width: `${currentStageIndex >= 0 ? (currentStageIndex / (STAGES.length - 1)) * 100 : 0}%` }} />
        {timeline.map((stage, idx) => (
          <div key={stage.stage} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${stage.progressStatus === "completed" ? "bg-green-500 border-green-500 text-white" : stage.progressStatus === "pending" ? "bg-yellow-500 border-yellow-500 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
              {stage.progressStatus === "completed" ? "✓" : idx + 1}
            </div>
            <span className="mt-2 text-xs font-medium text-gray-600 text-center">{stage.stage}</span>
            <span className={`text-xs ${STATUS_COLORS[stage.progressStatus]} mt-1 px-2 py-0.5 rounded-full`}>
              {STATUS_LABELS[stage.progressStatus]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Batch Management</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Production Lifecycle</h3>
        </div>
        <div className="flex items-center gap-3">
          {role === "leader" && (
            <button onClick={openModal} className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              <PlusSquare size={16} /> {hasBatch ? "Update Batch" : "Create Batch"}
            </button>
          )}
        </div>
      </div>

      {/* Batch Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">{hasBatch ? "Update Batch" : "Create Batch"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
                <input
                  value={batchForm.cropType}
                  onChange={(e) => setBatchForm((p) => ({ ...p, cropType: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Wheat, Rice, Cotton"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Season</label>
                <select
                  value={batchForm.season}
                  onChange={(e) => setBatchForm((p) => ({ ...p, season: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Season</option>
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Production (tons)</label>
                <input
                  type="number"
                  value={batchForm.estimatedProduction}
                  onChange={(e) => setBatchForm((p) => ({ ...p, estimatedProduction: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={batchForm.status}
                  onChange={(e) => setBatchForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="harvested">Harvested</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <PlusSquare size={16} /> {hasBatch ? "Update Batch" : "Save Batch"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {batches.length === 0 ? (
          <p className="text-sm text-slate-500">No batch created yet. {role === "leader" && "Click 'Create Batch' to start."}</p>
        ) : (
          batch && (
            <div key={batch._id || batch.batchId} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{batch.batchId || "Batch"}</p>
                  <p className="mt-1 text-sm text-slate-600">{batch.cropType} • {batch.season || "—"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[batch.statusTimeline?.[0]?.progressStatus || "not started"]}`}>
                    {batch.statusTimeline?.[0]?.progressStatus === "completed" ? "Completed" : batch.statusTimeline?.[0]?.progressStatus === "pending" ? "In Progress" : "Not Started"}
                  </span>
                  {role === "leader" && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{batch.status}</span>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {renderTimeline(batch)}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><Package size={14} /> {batch.estimatedProduction || 0} tons</span>
                <span className="inline-flex items-center gap-2"><UserPlus size={14} /> {batch.farmersInvolved?.length || 0} farmers</span>
              </div>

              {/* Expandable Stage Management (Leader Only) */}
              {role === "leader" && (
                <>
                  <button
                    onClick={() => setExpandedBatch(expandedBatch === batch._id ? null : batch._id)}
                    className="mt-4 text-sm text-green-600 font-medium hover:underline"
                  >
                    {expandedBatch === batch._id ? "Hide Stage Management" : "Manage Stages"}
                  </button>

                  {expandedBatch === batch._id && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-3">Update Stage Status</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {STAGES.map((stage) => {
                          const currentStatus = batch.statusTimeline?.find((s) => s.stage === stage)?.progressStatus || "not started";
                          return (
                            <div key={stage} className="p-3 bg-slate-50 rounded-xl">
                              <p className="text-xs font-semibold text-slate-700 mb-2">{stage}</p>
                              <div className="flex gap-2">
                                {["not started", "pending", "completed"].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStageUpdate(batch.batchId, stage, status)}
                                    className={`px-2 py-1 text-xs rounded-lg font-medium ${currentStatus === status ? "bg-green-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                                  >
                                    {status === "not started" ? "Not Started" : status === "pending" ? "Pending" : "Done"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Buyer Interest Display */}
                      {batch.buyers && batch.buyers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-bold text-slate-900 mb-2">Buyer Interests ({batch.buyers.length})</h4>
                          <div className="space-y-2">
                            {batch.buyers.map((buyer, idx) => (
                              <div key={idx} className="p-3 bg-yellow-50 rounded-xl text-sm">
                                <p className="font-medium text-slate-900">{buyer.buyerName} - {buyer.businessName}</p>
                                <p className="text-slate-600">Phone: {buyer.phone} | Qty: {buyer.quantity} tons | {buyer.paymentMethod}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BatchManagement;