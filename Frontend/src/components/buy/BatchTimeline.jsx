import { CheckCircle2, Clock, Circle, ArrowRight } from "lucide-react";

const STATUS_COLORS = {
  "not started": { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-300" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-400" },
  completed: { bg: "bg-green-100", text: "text-green-700", border: "border-green-500" },
};

const STAGE_ICONS = {
  "Planning Stage": "📋",
  "Growing Stage": "🌱",
  "Harvest Stage": "🌾",
  "Sold": "💰",
};

const BatchTimeline = ({ timeline = [], currentStage = "" }) => {
  const activeIndex = timeline.findIndex((s) => s.progressStatus === "pending");
  const completedCount = timeline.filter((s) => s.progressStatus === "completed").length;

  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
      <div
        className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${activeIndex >= 0 ? (completedCount / (timeline.length - 1)) * 100 : completedCount === timeline.length ? 100 : 0}%` }}
      />

      {/* Stage Pills */}
      <div className="relative flex justify-between">
        {timeline.map((stage, idx) => {
          const colors = STATUS_COLORS[stage.progressStatus];
          const isActive = stage.progressStatus === "pending";
          const isCompleted = stage.progressStatus === "completed";

          return (
            <div key={stage.stage} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${colors.bg} ${colors.border} ${isCompleted ? "text-green-600" : isActive ? "text-yellow-600" : "text-gray-400"} transition-all duration-300`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : isActive ? (
                  <Clock size={20} className="text-yellow-600 animate-pulse" />
                ) : (
                  <span className="text-sm">{idx + 1}</span>
                )}
              </div>
              <div className="mt-3 flex flex-col items-center">
                <span className="text-lg mb-1">{STAGE_ICONS[stage.stage]}</span>
                <span className={`text-xs font-semibold text-center ${colors.text}`}>
                  {stage.stage.replace(" Stage", "")}
                </span>
                <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {stage.progressStatus === "not started" ? "Not Started" : stage.progressStatus === "pending" ? "In Progress" : "Done"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Stage Indicator */}
      {currentStage && (
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-800">
            <ArrowRight size={16} />
            Current: {currentStage}
          </span>
        </div>
      )}
    </div>
  );
};

export default BatchTimeline;