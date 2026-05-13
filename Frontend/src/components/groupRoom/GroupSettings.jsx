const GroupSettings = ({ group, role, onUpdate, onTransfer, onArchive, onLeave }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-green-700">Group Settings</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{role === "leader" ? "Leader Controls" : "Farmer Settings"}</h3>
      <div className="mt-6 space-y-4">
        {role === "leader" ? (
          <>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
              <p className="text-sm text-slate-700">Archive group when season ends.</p>
              <button onClick={onArchive} className="mt-4 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
                Archive Group
              </button>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
              <p className="text-sm text-slate-700">Transfer leadership to another trusted farmer.</p>
              <button onClick={onTransfer} className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                Transfer Leadership
              </button>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
              <p className="text-sm text-slate-700">Edit group information and team roles.</p>
              <button onClick={onUpdate} className="mt-4 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                Update Group Info
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
            <p className="text-sm text-slate-700">Leave this group and return to your dashboard.</p>
            <button onClick={onLeave} className="mt-4 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
              Leave Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSettings;