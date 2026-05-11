const GroupOverview = ({ group, summary, activity }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-green-700 font-semibold uppercase tracking-[0.3em]">Group Mission Control</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">{group?.groupName || group?.name || "Unnamed Collective"}</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">This room connects the leader and farmers into one operational farming unit, with live coordination for crop planning, batch operations, irrigation, and revenue strategy.</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-3xl border border-green-100 bg-green-50 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-green-700" />
          <span className="text-sm font-semibold text-green-700">{group?.status?.toUpperCase() || "ACTIVE"}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-white shadow-lg">
          <p className="text-xs uppercase opacity-80">Total Members</p>
          <p className="mt-3 text-3xl font-bold">{group?.members?.length || 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Operational Land</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{summary?.land || group?.totalOperationalLand || 0} acres</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Active Batch</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{summary?.activeBatch || "None"}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Estimated Yield</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{summary?.yield || 0} tons</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Estimated Revenue</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">₹{summary?.revenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-xs uppercase text-slate-500">Crop</p>
          <p className="mt-2 font-semibold text-slate-900">{group?.cropPlan?.crop || group?.cropFocus || "Not defined"}</p>
          <p className="mt-1 text-sm text-slate-600">Season: {group?.cropPlan?.season || group?.cropSeason || "Unknown"}</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-xs uppercase text-slate-500">Leader</p>
          <p className="mt-2 font-semibold text-slate-900">{group?.leader?.fullName || group?.leader?.farmerId || "Leader"}</p>
          <p className="mt-1 text-sm text-slate-600">Status: {group?.status || "active"}</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-xs uppercase text-slate-500">Timeline</p>
          <p className="mt-2 font-semibold text-slate-900">{group?.cropPlan?.timeline || "Planning stage"}</p>
          <p className="mt-1 text-sm text-slate-600">Irrigation: {group?.irrigationPlanning?.method || "Not scheduled"}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em]">Recent Activity</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {activity?.length ? (
            activity.map((entry, index) => (
              <li key={index} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-green-50 text-green-700">{entry.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{entry.title}</p>
                  <p className="text-sm text-slate-500">{entry.detail}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-slate-500">No recent activity yet. Collaboration will appear here as your group moves through the season.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupOverview;