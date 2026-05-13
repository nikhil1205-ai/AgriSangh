const RevenueBoard = ({ revenue = {} }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Revenue</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Distribution Preview</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Visualization</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">₹{revenue.totalRevenue?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Share style</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">Percentage based</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {(revenue.distribution || []).slice(0, 4).map((item, index) => (
          <div key={index} className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
              <span>{item.farmerId || item.farmer?.farmerId || item.farmer?.fullName || `Share ${index + 1}`}</span>
              <span className="font-semibold text-slate-900">₹{item.amountInQuintal?.toLocaleString() || item.amount?.toLocaleString() || 0}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-green-600" style={{ width: `${item.percentage || 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueBoard;