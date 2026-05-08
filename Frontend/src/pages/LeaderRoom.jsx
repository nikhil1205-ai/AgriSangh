import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import AnalyticsGrid from "../components/analytics/AnalyticsGrid";
import BatchList from "../components/batches/BatchList";
import IrrigationCard from "../components/irrigation/IrrigationCard";
import {
  createBatch,
  decideJoinRequest,
  getGroupRoom,
  getJoinRequests,
  getLeaderDashboard,
  removeMember,
  updateCropPlan,
  updateGroup,
} from "../services/dashboardService";

const LeaderRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({ group: null, contributions: [], batches: [] });
  const [analytics, setAnalytics] = useState({});
  const [requests, setRequests] = useState([]);
  const [cropPlan, setCropPlan] = useState({ crop: "", season: "", timeline: "" });
  const [batchForm, setBatchForm] = useState({ cropType: "", membersInvolved: "", estimatedProduction: "", harvestTimeline: "" });
  const [groupForm, setGroupForm] = useState({ groupName: "", state: "", district: "", village: "", totalExpectedLand: "", description: "" });

  const load = async () => {
    const [roomData, analyticsData, requestData] = await Promise.all([
      getGroupRoom(id),
      getLeaderDashboard(id),
      getJoinRequests(id),
    ]);
    setRoom(roomData);
    setAnalytics(analyticsData);
    setRequests(requestData);
    setGroupForm({
      groupName: roomData.group?.name || "",
      state: roomData.group?.location?.state || "",
      district: roomData.group?.location?.district || "",
      village: roomData.group?.location?.village || "",
      totalExpectedLand: roomData.group?.totalExpectedLand || "",
      description: roomData.group?.about || "",
    });
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      const [roomData, analyticsData, requestData] = await Promise.all([
        getGroupRoom(id),
        getLeaderDashboard(id),
        getJoinRequests(id),
      ]);
      if (active) {
        setRoom(roomData);
        setAnalytics(analyticsData);
        setRequests(requestData);
        setGroupForm({
          groupName: roomData.group?.name || "",
          state: roomData.group?.location?.state || "",
          district: roomData.group?.location?.district || "",
          village: roomData.group?.location?.village || "",
          totalExpectedLand: roomData.group?.totalExpectedLand || "",
          description: roomData.group?.about || "",
        });
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [id]);

  const handleRequest = async (requestId, action) => {
    await decideJoinRequest(id, { requestId, action });
    load();
  };

  const handleBatch = async (e) => {
    e.preventDefault();
    await createBatch({ groupId: id, ...batchForm });
    setBatchForm({ cropType: "", membersInvolved: "", estimatedProduction: "", harvestTimeline: "" });
    load();
  };

  const handleCrop = async (e) => {
    e.preventDefault();
    await updateCropPlan(id, cropPlan);
    setCropPlan({ crop: "", season: "", timeline: "" });
    load();
  };

  const handleGroupUpdate = async (e) => {
    e.preventDefault();
    await updateGroup(id, groupForm);
    load();
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Leader Group Room">
        <p className="text-sm text-gray-700">
          Full access enabled for this group. Manage members, planning, contributions, batches, irrigation, and analytics.
        </p>
      </SectionCard>

      <AnalyticsGrid analytics={analytics} />

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Group Management">
          <form onSubmit={handleGroupUpdate} className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg px-3 py-2" value={groupForm.groupName} onChange={(e) => setGroupForm((p) => ({ ...p, groupName: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" value={groupForm.state} onChange={(e) => setGroupForm((p) => ({ ...p, state: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" value={groupForm.district} onChange={(e) => setGroupForm((p) => ({ ...p, district: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" value={groupForm.village} onChange={(e) => setGroupForm((p) => ({ ...p, village: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" value={groupForm.totalExpectedLand} onChange={(e) => setGroupForm((p) => ({ ...p, totalExpectedLand: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" value={groupForm.description} onChange={(e) => setGroupForm((p) => ({ ...p, description: e.target.value }))} />
            <button className="col-span-2 bg-green-800 text-white rounded-lg py-2">Update Group</button>
          </form>
          <div className="space-y-2 mt-4">
            {(room.group?.memberProfiles || []).map((member) => (
              <div key={member.uid} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm">
                <span>{member.name} ({member.role})</span>
                {member.role !== "leader" && (
                  <button onClick={() => removeMember(id, member.uid).then(load)} className="text-red-600 font-semibold">Remove</button>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Join Request Approval">
          <div className="space-y-2">
            {requests.map((request) => (
              <div key={request.id} className="flex justify-between bg-gray-50 p-2 rounded-lg text-sm">
                <span>{request.farmerName}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleRequest(request.id, "approved")} className="text-green-700 font-semibold">Approve</button>
                  <button onClick={() => handleRequest(request.id, "rejected")} className="text-red-600 font-semibold">Reject</button>
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-gray-500">No pending requests.</p>}
          </div>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Crop Planning">
          <form onSubmit={handleCrop} className="grid grid-cols-3 gap-2">
            <input className="border rounded-lg px-2 py-2" placeholder="Crop" value={cropPlan.crop} onChange={(e) => setCropPlan((p) => ({ ...p, crop: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Season" value={cropPlan.season} onChange={(e) => setCropPlan((p) => ({ ...p, season: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Timeline" value={cropPlan.timeline} onChange={(e) => setCropPlan((p) => ({ ...p, timeline: e.target.value }))} />
            <button className="col-span-3 bg-green-800 text-white rounded-lg py-2">Save Crop Plan</button>
          </form>
        </SectionCard>

        <SectionCard title="Batch Management">
          <form onSubmit={handleBatch} className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg px-2 py-2" placeholder="Crop type" value={batchForm.cropType} onChange={(e) => setBatchForm((p) => ({ ...p, cropType: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Members involved" value={batchForm.membersInvolved} onChange={(e) => setBatchForm((p) => ({ ...p, membersInvolved: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Estimated production" value={batchForm.estimatedProduction} onChange={(e) => setBatchForm((p) => ({ ...p, estimatedProduction: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Harvest timeline" value={batchForm.harvestTimeline} onChange={(e) => setBatchForm((p) => ({ ...p, harvestTimeline: e.target.value }))} />
            <button className="col-span-2 bg-green-800 text-white rounded-lg py-2">Create Batch + Lot ID</button>
          </form>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <BatchList batches={room.batches} />
        <IrrigationCard irrigationPlan={room.group?.irrigationPlan} />
        <SectionCard title="Technology Access + Revenue">
          <ul className="text-sm text-gray-700 space-y-1">
            {(room.group?.technologyAccess || []).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-3">Revenue split uses contribution percentage (light MVP logic).</p>
        </SectionCard>
      </div>
    </div>
  );
};

export default LeaderRoom;
