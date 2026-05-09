const TrendCard = ({ trend }) => {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{trend.crop}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{trend.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${trend.movementClass}`}>
          {trend.movement}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{trend.price}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demand</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{trend.demand}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{trend.insight}</p>
    </article>
  );
};

export default TrendCard;
