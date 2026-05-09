import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import IrrigationCard from "../components/irrigation/IrrigationCard";
import BatchList from "../components/batches/BatchList";
import AnalyticsGrid from "../components/analytics/AnalyticsGrid";
import ProgressBar from "../components/ui/ProgressBar";
import { auth } from "../config/firebase";
import { addContribution, getGroupRoom, getLeaderDashboard, leaveGroup, archiveGroup } from "../services/dashboardService";

const GroupRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({ group: null, contributions: [], batches: [] });
  const [analytics, setAnalytics] = useState({});
  const [contribution, setContribution] = useState({ landContribution: "", participationPercent: "", estimatedProduction: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    const [roomData, analyticsData] = await Promise.all([getGroupRoom(id), getLeaderDashboard(id)]);
    setRoom(roomData);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      const [roomData, analyticsData] = await Promise.all([getGroupRoom(id), getLeaderDashboard(id)]);
      if (active) {
        setRoom(roomData);
        setAnalytics(analyticsData);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [id]);

  const submitContribution = async (e) => {
    e.preventDefault();
    await addContribution({ groupId: id, ...contribution });
    setContribution({ landContribution: "", participationPercent: "", estimatedProduction: "" });
    load();
  };

  const leaveCurrentGroup = async () => {
    const ok = window.confirm("Are you sure you want to leave this group? This will end your active membership.");
    if (!ok) return;
    setActionLoading(true);
    try {
      await leaveGroup(id);
      navigate("/dashboard");
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to leave group.");
    } finally {
      setActionLoading(false);
    }
  };

  const archiveCurrentGroup = async () => {
    const ok = window.confirm("Archive this group and end the current season for all members?");
    if (!ok) return;
    setActionLoading(true);
    try {
      await archiveGroup(id);
      navigate("/dashboard");
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to archive group.");
    } finally {
      setActionLoading(false);
    }
  };

  const group = room.group;

  return (
    <div className="space-y-5">
      <SectionCard title="Group Overview">
        <div className="grid md:grid-cols-5 gap-3 text-sm">
          <p><span className="text-gray-500">Name:</span> {group?.name}</p>
          <p><span className="text-gray-500">Members:</span> {group?.members?.length || 0}</p>
          <p><span className="text-gray-500">Total Land:</span> {group?.totalExpectedLand || 0} acres</p>
          <p><span className="text-gray-500">Active Crop:</span> {group?.cropPlan?.crop || group?.cropFocus}</p>
          <p><span className="text-gray-500">Season:</span> {group?.cropPlan?.season}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {group?.leader?.uid === auth.currentUser?.uid ? (
            <button
              type="button"
              onClick={archiveCurrentGroup}
              disabled={actionLoading}
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              Archive Group
            </button>
          ) : (
            <button
              type="button"
              onClick={leaveCurrentGroup}
              disabled={actionLoading}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Leave Group
            </button>
          )}
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {group?.status || "active"}
          </span>
        </div>
      </SectionCard>

      <AnalyticsGrid analytics={analytics} />

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Crop Planning Section">
          <p className="text-sm text-gray-700">Selected crop: {group?.cropPlan?.crop}</p>
          <p className="text-sm text-gray-700 mt-1">Timeline: {group?.cropPlan?.timeline}</p>
          <p className="text-sm text-gray-700 mt-1">Farming schedule: Week-wise collaborative operations</p>
        </SectionCard>

        <SectionCard title="Contribution Section">
          <form onSubmit={submitContribution} className="grid grid-cols-3 gap-2">
            <input className="border rounded-lg px-2 py-2" placeholder="Land" value={contribution.landContribution} onChange={(e) => setContribution((p) => ({ ...p, landContribution: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Participation %" value={contribution.participationPercent} onChange={(e) => setContribution((p) => ({ ...p, participationPercent: e.target.value }))} />
            <input className="border rounded-lg px-2 py-2" placeholder="Production est." value={contribution.estimatedProduction} onChange={(e) => setContribution((p) => ({ ...p, estimatedProduction: e.target.value }))} />
            <button className="col-span-3 bg-green-800 text-white rounded-lg py-2">Add My Contribution</button>
          </form>
          <div className="space-y-2 mt-3">
            {(room.contributions || []).map((entry) => (
              <div key={entry.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{entry.farmerName}</span>
                  <span>{entry.participationPercent}%</span>
                </div>
                <ProgressBar value={Number(entry.participationPercent || 0)} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <BatchList batches={room.batches} />
        <IrrigationCard irrigationPlan={group?.irrigationPlan} />
        <SectionCard title="Technology + Revenue">
          <ul className="text-sm text-gray-700 space-y-1">
            {(group?.technologyAccess || []).map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          <p className="text-sm text-gray-600 mt-3">Revenue split is proportional to land contribution %.</p>
        </SectionCard>
      </div>
    </div>
  );
};

export default GroupRoom;
