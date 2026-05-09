const WeatherAlert = ({ alert }) => {
  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${alert.variant}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
          <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
        </div>
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          {alert.level}
        </span>
      </div>
    </div>
  );
};

export default WeatherAlert;
