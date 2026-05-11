const IrrigationPlanner = ({ irrigation }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Irrigation</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Water Coordination</h3>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">Schedule</span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-sm text-slate-500">Method</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{irrigation?.method || "Not scheduled"}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-sm text-slate-500">Next irrigation</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{irrigation?.nextDate || "TBD"}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-sm text-slate-500">Water alert</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{irrigation?.reminder || "No alert"}</p>
        </div>
      </div>
    </div>
  );
};

export default IrrigationPlanner;