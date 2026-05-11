import { useState } from "react";
import { Package, Users, TrendingUp, Play, CheckCircle, Truck } from "lucide-react";
import { createBatch } from "../../services/dashboardService";

const BatchStatusCard = ({ batches, groupId, onRefresh }) => {
  const [creating, setCreating] = useState(false);
  const [newBatch, setNewBatch] = useState({
    cropType: "",
    estimatedProduction: "",
    membersInvolved: "",
  });

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createBatch({
        groupId,
        ...newBatch,
        membersInvolved: newBatch.membersInvolved.split(",").map(id => id.trim()),
      });
      setNewBatch({ cropType: "", estimatedProduction: "", membersInvolved: "" });
      onRefresh();
    } catch (error) {
      console.error("Error creating batch:", error);
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "planned": return <Play className="text-blue-600" size={16} />;
      case "active": return <Package className="text-green-600" size={16} />;
      case "harvested": return <CheckCircle className="text-orange-600" size={16} />;
      case "sold": return <Truck className="text-purple-600" size={16} />;
      default: return <Package className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "harvested": return "bg-orange-100 text-orange-800";
      case "sold": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Package className="text-indigo-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Batch Management</h3>
          <p className="text-sm text-gray-600">Track production batches and lifecycle</p>
        </div>
      </div>

      {/* Create New Batch Form */}
      <form onSubmit={handleCreateBatch} className="mb-6 p-4 bg-gray-50/50 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-3">Create New Batch</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Crop Type"
            value={newBatch.cropType}
            onChange={(e) => setNewBatch(prev => ({ ...prev, cropType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            placeholder="Est. Production (tons)"
            value={newBatch.estimatedProduction}
            onChange={(e) => setNewBatch(prev => ({ ...prev, estimatedProduction: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder="Member IDs (comma separated)"
            value={newBatch.membersInvolved}
            onChange={(e) => setNewBatch(prev => ({ ...prev, membersInvolved: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Batch"}
        </button>
      </form>

      {/* Existing Batches */}
      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(batch.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{batch.batchId}</h4>
                  <p className="text-sm text-gray-600">{batch.cropType}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                {batch.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={14} />
                <span>{batch.estimatedProduction} tons</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-green-600" size={14} />
                <span>{batch.farmersInvolved?.length || 0} farmers</span>
              </div>
            </div>
          </div>
        ))}

        {batches.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-500">No batches created yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchStatusCard;