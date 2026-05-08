import StatCard from "../ui/StatCard";
import { BarChart3, Leaf, Users2, Wheat } from "lucide-react";

const AnalyticsGrid = ({ analytics }) => (
  <div className="grid md:grid-cols-4 gap-4">
    <StatCard title="Members" value={analytics.totalFarmers || 0} icon={Users2} />
    <StatCard title="Operational Land" value={`${analytics.totalOperationalLand || 0} acres`} icon={Leaf} />
    <StatCard title="Production Est." value={`${analytics.totalProductionEstimate || 0} qtl`} icon={Wheat} />
    <StatCard title="Participation" value={`${analytics.participationPercent || 0}%`} icon={BarChart3} />
  </div>
);

export default AnalyticsGrid;
