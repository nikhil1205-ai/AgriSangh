import { useEffect, useState } from "react";
import { BarChart3, Boxes, Leaf, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SectionCard from "../components/ui/SectionCard";
import StatCard from "../components/ui/StatCard";
import {
  createBatch,
  createGroup,
  decideJoinRequest,
  getJoinRequests,
  getLeaderDashboard,
  updateCropPlan,
} from "../services/dashboardService";

const LeaderDashboard = () => {
  const { becomeLeader } = useAuth();
  const [groupId, setGroupId] = useState("");
  const [groupForm, setGroupForm] = useState({ name: "", region: "", cropFocus: "" });
  const [cropPlan, setCropPlan] = useState({ crop: "", season: "" });
  const [batchForm, setBatchForm] = useState({
    cropType: "",
    membersInvolved: "",
    estimatedProduction: "",
    harvestTimeline: "",
  });
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);

  const refresh = async (gid) => {
    if (!gid) return;
    const [dash, reqs] = await Promise.all([getLeaderDashboard(gid), getJoinRequests(gid)]);
    setDashboard(dash);
    setRequests(reqs);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      if (!groupId) return;
      const [dash, reqs] = await Promise.all([getLeaderDashboard(groupId), getJoinRequests(groupId)]);
      if (active) {
        setDashboard(dash);
        setRequests(reqs);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [groupId]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const created = await createGroup(groupForm);
    becomeLeader();
    setGroupId(created.id);
    setGroupForm({ name: "", region: "", cropFocus: "" });
  };

  const handleCropPlan = async (e) => {
    e.preventDefault();
    await updateCropPlan(groupId, cropPlan);
    setCropPlan({ crop: "", season: "" });
    refresh(groupId);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    await createBatch({ groupId, ...batchForm });
    setBatchForm({ cropType: "", membersInvolved: "", estimatedProduction: "", harvestTimeline: "" });
    refresh(groupId);
  };

  const handleRequestAction = async (requestId, action) => {
    await decideJoinRequest(groupId, { requestId, action });
    refresh(groupId);
  };

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Farmers" value={dashboard?.totalFarmers || 0} icon={Users} />
        <StatCard title="Operational Land" value={`${dashboard?.totalOperationalLand || 0} acres`} icon={Leaf} />
        <StatCard title="Active Crop" value={dashboard?.activeCrop || "-"} icon={BarChart3} />
        <StatCard title="Batch Status" value={dashboard?.batches?.length ? "Active" : "Not Created"} icon={Boxes} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Create Farming Group">
          <form onSubmit={handleCreateGroup} className="grid gap-2">
            <input className="border rounded-lg px-3 py-2" placeholder="Group name" value={groupForm.name} onChange={(e) => setGroupForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Region" value={groupForm.region} onChange={(e) => setGroupForm((p) => ({ ...p, region: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Crop focus" value={groupForm.cropFocus} onChange={(e) => setGroupForm((p) => ({ ...p, cropFocus: e.target.value }))} />
            <button className="bg-green-800 text-white py-2 rounded-lg">Create Group (Leader)</button>
          </form>
          {groupId && <p className="text-xs text-gray-500 mt-2">Active Group ID: {groupId}</p>}
        </SectionCard>

        <SectionCard title="Crop Plan + Season">
          <form onSubmit={handleCropPlan} className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg px-3 py-2" placeholder="Crop (e.g. Wheat)" value={cropPlan.crop} onChange={(e) => setCropPlan((p) => ({ ...p, crop: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Season (Kharif/Rabi)" value={cropPlan.season} onChange={(e) => setCropPlan((p) => ({ ...p, season: e.target.value }))} />
            <button className="col-span-2 bg-green-800 text-white py-2 rounded-lg">Update Crop Plan</button>
          </form>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Approve/Reject Join Requests">
          <div className="space-y-2">
            {requests.length === 0 && <p className="text-sm text-gray-500">No pending requests.</p>}
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm">{request.farmerName}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleRequestAction(request.id, "approved")} className="px-2 py-1 bg-green-700 text-white rounded text-xs">
                    Approve
                  </button>
                  <button onClick={() => handleRequestAction(request.id, "rejected")} className="px-2 py-1 bg-red-600 text-white rounded text-xs">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Batch / Lot Creation">
          <form onSubmit={handleCreateBatch} className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg px-3 py-2" placeholder="Crop type" value={batchForm.cropType} onChange={(e) => setBatchForm((p) => ({ ...p, cropType: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Members involved" value={batchForm.membersInvolved} onChange={(e) => setBatchForm((p) => ({ ...p, membersInvolved: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Estimated production" value={batchForm.estimatedProduction} onChange={(e) => setBatchForm((p) => ({ ...p, estimatedProduction: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Harvest timeline" value={batchForm.harvestTimeline} onChange={(e) => setBatchForm((p) => ({ ...p, harvestTimeline: e.target.value }))} />
            <button className="col-span-2 bg-green-800 text-white py-2 rounded-lg">Generate Batch ID</button>
          </form>
          <div className="mt-3 space-y-2">
            {dashboard?.batches?.map((batch) => (
              <div key={batch.id} className="text-sm bg-green-50 text-green-900 rounded-lg px-3 py-2">
                {batch.batchId} - {batch.cropType} ({batch.authenticity})
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default LeaderDashboard;
