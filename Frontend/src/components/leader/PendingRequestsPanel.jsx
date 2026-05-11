import { useState } from "react";
import { UserPlus, Check, X, Clock } from "lucide-react";
import { decideJoinRequest } from "../../services/dashboardService";

const PendingRequestsPanel = ({ requests, groupId, onRefresh }) => {
  const [processing, setProcessing] = useState({});

  const handleDecision = async (requestId, action) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));
    try {
      await decideJoinRequest(groupId, { requestId, action });
      onRefresh();
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <UserPlus className="text-orange-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
          <p className="text-sm text-gray-600">Review join requests from farmers</p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-500">No pending requests</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{request.farmerName}</p>
                  <p className="text-sm text-gray-500">
                    Requested {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(request.id, "approved")}
                  disabled={processing[request.id]}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(request.id, "rejected")}
                  disabled={processing[request.id]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPanel;