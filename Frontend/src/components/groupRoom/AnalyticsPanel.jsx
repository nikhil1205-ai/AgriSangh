import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AnalyticsPanel = ({ summary, contributions = [], batches = [], members = [] }) => {
  // Derive land trend from contributions (grouped by month)
  const landTrend = contributions.reduce((acc, c) => {
    const month = new Date(c.createdAt).toLocaleString("default", { month: "short" });
    const existing = acc.find((a) => a.name === month);
    if (existing) {
      existing.value += Number(c.landContribution || 0);
    } else {
      acc.push({ name: month, value: Number(c.landContribution || 0) });
    }
    return acc;
  }, []);

  const landSeries = landTrend.length > 0 ? landTrend : [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
  ];

  // Derive participation distribution from contributions vs members
  const contributedCount = contributions.length;
  const totalMembers = members.length || 1;
  const contributedPercent = Math.round((contributedCount / totalMembers) * 100);
  const activeBatches = batches.filter((b) => b.status !== "completed").length;

  const participationPie = [
    { name: "Active", value: contributedPercent, fill: "#10B981" },
    { name: "Partial", value: Math.max(0, 100 - contributedPercent - 20), fill: "#F59E0B" },
    { name: "Inactive", value: Math.max(0, 100 - contributedPercent), fill: "#EF4444" },
  ].filter((p) => p.value > 0);

  if (participationPie.length === 0) {
    participationPie.push({ name: "No Data", value: 100, fill: "#94A3B8" });
  }

  // Calculate batch progress from batches
  const totalBatches = batches.length;
  const completedBatches = batches.filter((b) => b.status === "completed").length;
  const batchProgressPercent = totalBatches > 0 ? Math.round((completedBatches / totalBatches) * 100) : 0;

  // Calculate average yield from contributions
  const totalYield = contributions.reduce((sum, c) => sum + Number(c.estimatedYield || 0), 0);

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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Yield</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{totalYield || summary?.yield || 0}t</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Participation</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{contributedCount}/{totalMembers}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Batch Progress</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{batchProgressPercent || summary?.batchProgress || 0}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Land Contribution Trend</p>
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
          <p className="text-sm text-slate-600">Member Activity Distribution</p>
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