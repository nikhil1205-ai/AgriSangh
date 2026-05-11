import { Users, Leaf, Boxes, TrendingUp } from "lucide-react";
import StatCard from "../ui/StatCard";

const OverviewStats = ({ dashboard }) => {
  const stats = [
    {
      title: "Total Members",
      value: dashboard?.totalMembers || 0,
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Active Crop",
      value: dashboard?.activeCrop || "Not Set",
      icon: Leaf,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Active Batch Status",
      value: dashboard?.batchStatus || "No Batch",
      icon: Boxes,
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      title: "Operational Land",
      value: `${dashboard?.totalOperationalLand || 0} acres`,
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <stat.icon size={32} className="opacity-80" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;