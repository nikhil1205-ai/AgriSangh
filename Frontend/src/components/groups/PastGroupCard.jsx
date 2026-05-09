const PastGroupCard = ({ group }) => {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{group.season}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{group.name}</h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
            {group.status}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{group.summary}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Crop</p>
            <p className="mt-2 font-semibold text-slate-900">{group.crop}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Yield</p>
            <p className="mt-2 font-semibold text-slate-900">{group.yield}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{group.members}</span> Members
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{group.landArea}</span> Land
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{group.verification}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PastGroupCard;
