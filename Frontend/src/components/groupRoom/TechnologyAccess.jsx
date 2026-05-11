const services = [
  { title: "Drone Spraying", description: "Coordinate aerial pesticide and nutrient delivery." },
  { title: "Soil Testing", description: "Monitor soil health across the collective." },
  { title: "Equipment Sharing", description: "Share tractors, pumps and tools across members." },
  { title: "Smart Irrigation", description: "Plan water delivery using operational schedules." },
];

const TechnologyAccess = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Technology</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Shared Farm Tools</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Enablement</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-semibold text-slate-900">{service.title}</h4>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyAccess;