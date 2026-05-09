const NewsCard = ({ item }) => {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badgeClass}`}>
          {item.badge}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">{item.region}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{item.impacts}</span>
      </div>
    </article>
  );
};

export default NewsCard;
