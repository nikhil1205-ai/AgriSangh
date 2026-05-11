import { DollarSign, PieChart, Users } from "lucide-react";

const RevenuePreview = ({ revenues }) => {
  const totalRevenue = revenues.reduce((sum, rev) => sum + rev.totalRevenue, 0);
  const latestRevenue = revenues[0]; // Assuming sorted by date

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
          <DollarSign className="text-yellow-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Distribution</h3>
          <p className="text-sm text-gray-600">Group revenue and farmer shares</p>
        </div>
      </div>

      {latestRevenue ? (
        <div className="space-y-6">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="text-3xl font-bold text-green-800">₹{latestRevenue.totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-green-600">Total Revenue</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <PieChart size={16} />
              Distribution Breakdown
            </h4>
            {latestRevenue.distribution.map((dist, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{dist.farmerId}</p>
                    <p className="text-sm text-gray-500">{dist.percentage}% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{dist.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <DollarSign className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500">No revenue data available</p>
        </div>
      )}
    </div>
  );
};

export default RevenuePreview;