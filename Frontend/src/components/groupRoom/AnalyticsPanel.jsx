import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AnalyticsPanel = ({ summary }) => {
  const landSeries = [
    { name: "Mar", value: 22 },
    { name: "Apr", value: 40 },
    { name: "May", value: 33 },
    { name: "Jun", value: 48 },
    { name: "Jul", value: 55 },
  ];
  const participationPie = [
    { name: "High", value: 45, fill: "#10B981" },
    { name: "Medium", value: 35, fill: "#F59E0B" },
    { name: "Low", value: 20, fill: "#EF4444" },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Analytics</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Operational Insights</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Live</div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Yield</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.yield || 0}t</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Participation</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.participation || 0}%</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Batch Progress</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.batchProgress || 0}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Operational Land Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={landSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Participation Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={participationPie} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                {participationPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;