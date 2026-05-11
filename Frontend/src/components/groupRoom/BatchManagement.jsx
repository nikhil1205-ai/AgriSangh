import { useState } from "react";
import { PlusSquare, CheckCircle2, Package, Truck } from "lucide-react";

const statuses = ["planned", "active", "harvested", "sold"];

const BatchManagement = ({ batches = [], role, onCreate, onUpdateStatus }) => {
  const [batchForm, setBatchForm] = useState({ cropType: "", estimatedProduction: "", farmers: "" });

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Batch Management</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Production Lifecycle</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">{batches.length} batches</span>
      </div>

      {role === "leader" && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-slate-700">
            <PlusSquare size={16} /> Add Batch
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input value={batchForm.cropType} onChange={(e) => setBatchForm((p) => ({ ...p, cropType: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Crop type" />
            <input value={batchForm.estimatedProduction} onChange={(e) => setBatchForm((p) => ({ ...p, estimatedProduction: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Est. production" />
            <input value={batchForm.farmers} onChange={(e) => setBatchForm((p) => ({ ...p, farmers: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Farmers involved" />
          </div>
          <button onClick={() => onCreate?.(batchForm)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
            <PlusSquare size={16} /> Create Batch
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {batches.length === 0 ? (
          <p className="text-sm text-slate-500">No batches are active yet.</p>
        ) : (
          batches.map((batch) => (
            <div key={batch.id || batch._id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{batch.batchId || "Batch"}</p>
                  <p className="mt-1 text-sm text-slate-600">{batch.cropType} • {batch.season || "—"}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{batch.status}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><Package size={14} /> {batch.estimatedProduction || 0} tons</span>
                <span className="inline-flex items-center gap-2"><UserPlus size={14} /> {batch.farmersInvolved?.length || 0} farmers</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} /> {batch.status === "active" ? "In progress" : batch.status}</span>
              </div>
              {role === "leader" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button key={status} onClick={() => onUpdateStatus?.(batch, status)} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BatchManagement;