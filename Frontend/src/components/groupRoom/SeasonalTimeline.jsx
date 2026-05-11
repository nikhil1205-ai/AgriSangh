const SeasonalTimeline = ({ group }) => {
  const steps = [
    { label: "Group Created", active: true },
    { label: "Members Joined", active: Boolean(group?.members?.length) },
    { label: "Crop Planned", active: Boolean(group?.cropPlan?.crop) },
    { label: "Contributions Locked", active: false },
    { label: "Batch Created", active: Boolean(group?.batches?.length) },
    { label: "Harvested", active: group?.status === "harvested" || group?.status === "sold" },
    { label: "Revenue Distributed", active: Boolean(group?.revenue?.totalRevenue) },
    { label: "Archived", active: group?.status === "archived" },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-green-700">Seasonal Timeline</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">Farming Lifecycle</h3>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-4">
            <div className={`h-4 w-4 rounded-full ${step.active ? "bg-green-600" : "bg-slate-300"}`} />
            <div>
              <p className={`text-sm font-semibold ${step.active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
              {index < steps.length - 1 && <div className="mt-2 h-0.5 w-full bg-slate-200" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalTimeline;