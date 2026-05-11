import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

const AnalyticsCharts = ({ dashboard, contributions }) => {
  // Sample data - in real app, this would come from dashboard
  const landData = [
    { name: "Jan", land: 45 },
    { name: "Feb", land: 52 },
    { name: "Mar", land: 48 },
    { name: "Apr", land: 61 },
    { name: "May", land: 55 },
    { name: "Jun", land: 67 },
  ];

  const participationData = [
    { name: "High", value: 35, color: "#10b981" },
    { name: "Medium", value: 45, color: "#f59e0b" },
    { name: "Low", value: 20, color: "#ef4444" },
  ];

  const yieldData = [
    { name: "Week 1", yield: 12 },
    { name: "Week 2", yield: 19 },
    { name: "Week 3", yield: 15 },
    { name: "Week 4", yield: 25 },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="text-cyan-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Operational Analytics</h3>
          <p className="text-sm text-gray-600">Performance metrics and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Contribution Trend */}
        <div className="p-4 bg-gray-50/50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            Land Contribution Trend
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={landData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="land" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Participation Distribution */}
        <div className="p-4 bg-gray-50/50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <PieChartIcon size={16} />
            Participation Levels
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {participationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Projection */}
        <div className="p-4 bg-gray-50/50 rounded-xl lg:col-span-2">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={16} />
            Estimated Yield Progress
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yield" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;