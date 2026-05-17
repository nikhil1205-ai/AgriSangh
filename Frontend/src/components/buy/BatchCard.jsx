import { Package, Users, DollarSign, Calendar, ArrowRight, Leaf, Sprout, Wheat, ShoppingBag } from "lucide-react";

const CROP_ICONS = {
  wheat: <Wheat size={20} />,
  rice: <Leaf size={20} />,
  cotton: <Sprout size={20} />,
  default: <Package size={20} />,
};

const STATUS_BADGES = {
  "not started": { bg: "bg-gray-100", text: "text-gray-600", label: "Not Started" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" },
  completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
};

const BatchCard = ({ batch, onClick }) => {
  if (!batch) return null;

  const group = batch.group || {};
  const timeline = batch.statusTimeline || [];
  const currentStage = timeline.find((s) => s.progressStatus === "pending") || timeline.find((s) => s.progressStatus === "completed");
  const currentStatus = currentStage?.progressStatus || "not started";
  const statusBadge = STATUS_BADGES[currentStatus];

  // Get crop icon based on crop type
  const cropTypeLower = (batch.cropType || "").toLowerCase();
  const cropIcon = CROP_ICONS[cropTypeLower] || CROP_ICONS.default;

  // Calculate progress
  const completedStages = timeline.filter((s) => s.progressStatus === "completed").length;
  const progress = timeline.length > 0 ? Math.round((completedStages / timeline.length) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl border border-slate-100 p-5 cursor-pointer hover:border-green-300 hover:shadow-xl hover:shadow-green-100 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            {cropIcon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{batch.batchId}</h3>
            <p className="text-sm text-slate-500">{batch.cropType}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <Package size={14} className="text-slate-500" />
          </div>
          <span>{batch.estimatedProduction || 0} tons</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <Users size={14} className="text-slate-500" />
          </div>
          <span>{batch.farmersInvolved?.length || 0} farmers</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <DollarSign size={14} className="text-slate-500" />
          </div>
          <span>{batch.paymentMethod || "Pending"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <Calendar size={14} className="text-slate-500" />
          </div>
          <span>{batch.season || "Season"}</span>
        </div>
      </div>

      {/* Group Info */}
      <div className="p-3 bg-slate-50 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Collective Group</p>
            <p className="text-sm font-semibold text-slate-900">{group.groupName || "Group"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Group ID</p>
            <p className="text-sm font-semibold text-slate-900">{group.groupId || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Current Stage */}
      {currentStage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentStatus === "completed" ? "bg-green-500" : currentStatus === "pending" ? "bg-yellow-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm font-medium text-slate-700">{currentStage.stage}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            View Details <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* Buyer Interests Count */}
      {batch.buyers && batch.buyers.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded-xl">
          <ShoppingBag size={14} />
          <span>{batch.buyers.length} buyer(s) interested</span>
        </div>
      )}
    </div>
  );
};

export default BatchCard;