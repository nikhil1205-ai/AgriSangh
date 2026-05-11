import { Calendar, Droplets, TrendingUp } from "lucide-react";

const ActiveCropBanner = ({ group }) => {
  const cropPlanning = group?.cropPlanning || {};
  const progress = 68; // This could be calculated based on timeline

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {cropPlanning.cropType || "No Active Crop"}
              </h2>
              <p className="text-green-100">
                {cropPlanning.season || "Season Not Set"} 2026
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-green-200" />
              <span className="text-sm">Timeline Progress: {progress}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-green-200" />
              <span className="text-sm">Irrigation: {group?.irrigationPlanning?.method || "Not Set"}</span>
            </div>
          </div>
        </div>

        <div className="lg:w-64">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Crop Progress</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCropBanner;