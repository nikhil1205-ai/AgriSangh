import ProgressBar from "../ui/ProgressBar";

const ContributionBoard = ({ contributions = [], batchLocked }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Contribution Board</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Transparency & Trust</h3>
        </div>
        <div className={`rounded-full px-4 py-2 text-xs font-semibold ${batchLocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {batchLocked ? "Locked" : "Editable"}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {contributions.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">No contributions recorded yet.</div>
        ) : (
          contributions.map((contribution) => (
            <div key={contribution.id || contribution._id || contribution.farmer} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{contribution.farmerName || contribution.farmer?.fullName || "Farmers"}</p>
                  <p className="text-sm text-slate-500">{contribution.farmerId || contribution.farmer?.farmerId || "—"}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{contribution.landContribution || 0} acres</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>Yield: {contribution.estimatedYield || 0} tons</span>
                <span>Participation: {contribution.participationPercentage || 0}%</span>
                <span>Season: {contribution.season || "—"}</span>
              </div>
              <div className="mt-4">
                <ProgressBar value={Number(contribution.participationPercentage || 0)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContributionBoard;