import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon = TrendingUp }) => (
  <div className="bg-white/90 backdrop-blur border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-800 grid place-items-center">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export default StatCard;
