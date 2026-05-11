import { useState } from "react";
import { Edit3, CalendarCheck } from "lucide-react";

const CropPlanning = ({ group, role, onUpdate }) => {
  const [plan, setPlan] = useState({
    crop: group?.cropPlan?.crop || group?.cropFocus || "",
    season: group?.cropPlan?.season || group?.cropSeason || "",
    timeline: group?.cropPlan?.timeline || "",
    sowing: group?.cropPlan?.sowing || "",
    harvest: group?.cropPlan?.harvest || "",
  });

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Crop Planning</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Coordinated Farming Workflow</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <CalendarCheck size={16} /> {plan.season || "Planning"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { label: "Crop Type", value: plan.crop },
          { label: "Season", value: plan.season },
          { label: "Timeline", value: plan.timeline },
          { label: "Sowing Window", value: plan.sowing || "Pending" },
          { label: "Harvest Window", value: plan.harvest || "Pending" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{item.value || "Not set"}</p>
          </div>
        ))}
      </div>

      {role === "leader" && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-slate-700">
            <Edit3 size={16} />
            <p className="font-semibold">Update crop plan</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={plan.crop} onChange={(e) => setPlan((p) => ({ ...p, crop: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Crop type" />
            <input value={plan.season} onChange={(e) => setPlan((p) => ({ ...p, season: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Season" />
            <input value={plan.timeline} onChange={(e) => setPlan((p) => ({ ...p, timeline: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Timeline" />
            <input value={plan.sowing} onChange={(e) => setPlan((p) => ({ ...p, sowing: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Sowing window" />
            <input value={plan.harvest} onChange={(e) => setPlan((p) => ({ ...p, harvest: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Harvest window" />
          </div>
          <button onClick={() => onUpdate?.(plan)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
            <CalendarCheck size={16} /> Save Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default CropPlanning;