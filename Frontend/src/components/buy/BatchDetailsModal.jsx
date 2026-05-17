import React, { useState } from "react";
import { X, Package, Users, Calendar, DollarSign, BadgeCheck } from "lucide-react";
import BatchTimeline from "./BatchTimeline";
import BuyerInterestForm from "./BuyerInterestForm";

const STATUS_COLORS = {
  "not started": "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

const BatchDetailsModal = ({ batch, onClose, onExpressInterest }) => {
  const [showInterestForm, setShowInterestForm] = useState(false);

  if (!batch) return null;

  const group = batch.group || {};
  const timeline = batch.statusTimeline || [];

  // Determine current stage
  const currentStageObj = timeline.find((s) => s.progressStatus === "pending") || timeline.find((s) => s.progressStatus === "completed");
  const currentStage = currentStageObj?.stage || "Planning Stage";

  // Current progress percentage
  const completedStages = timeline.filter((s) => s.progressStatus === "completed").length;
  const progressPercent = timeline.length > 0 ? (completedStages / timeline.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-800 to-green-700 rounded-t-3xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{batch.batchId}</h2>
              <p className="text-green-100 text-sm">{batch.cropType} • {batch.season || "Season"}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Production Progress</span>
              <span className="text-slate-500">{Math.round(progressPercent)}% Complete</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Operational Timeline</h3>
            <BatchTimeline timeline={timeline} currentStage={currentStage} />
          </div>

          {/* Batch Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                <Package size={16} /> Estimated Production
              </div>
              <p className="text-xl font-bold text-slate-900">{batch.estimatedProduction || 0} tons</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                <Users size={16} /> Farmers Involved
              </div>
              <p className="text-xl font-bold text-slate-900">{batch.farmersInvolved?.length || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                <DollarSign size={16} /> Payment Method
              </div>
              <p className="text-xl font-bold text-slate-900">{batch.paymentMethod || "Pending"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                <Calendar size={16} /> Created
              </div>
              <p className="text-xl font-bold text-slate-900">
                {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Group Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck size={18} className="text-green-600" />
              <h3 className="font-bold text-slate-900">Collective Group Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Group ID</span>
                <p className="font-medium text-slate-900">{group.groupId || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-500">Group Name</span>
                <p className="font-medium text-slate-900">{group.groupName || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Group Leader</span>
                <p className="font-medium text-slate-900">{group.leader?.name || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Interest Form or Button */}
          {!showInterestForm ? (
            <button
              onClick={() => setShowInterestForm(true)}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-200"
            >
              I'm Interested in This Batch
            </button>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl">
              <BuyerInterestForm
                batchId={batch.batchId}
                onSubmit={onExpressInterest}
                onClose={() => setShowInterestForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsModal;