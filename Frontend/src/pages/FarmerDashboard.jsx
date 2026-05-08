import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Users, Plus } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import StatCard from "../components/ui/StatCard";
import RolePill from "../components/shared/RolePill";
import ActionCard from "../components/dashboard/ActionCard";
import { addContribution, getFarmerDashboard } from "../services/dashboardService";

const FarmerDashboard = () => {
  const [contributionForm, setContributionForm] = useState({
    landContribution: "",
    participationPercent: "",
    estimatedProduction: "",
  });
  const [data, setData] = useState({
    profile: null,
    groups: [],
    contributions: [],
    currentGroups: [],
    previousGroups: [],
  });

  const loadData = async () => {
    const dashboard = await getFarmerDashboard();
    setData(dashboard);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      const dashboard = await getFarmerDashboard();
      if (active) {
        setData(dashboard);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  const currentGroup = data.groups?.[0];

  const submitContribution = async (e) => {
    e.preventDefault();
    if (!currentGroup?.id) return;
    await addContribution({ groupId: currentGroup?.id, ...contributionForm });
    setContributionForm({ landContribution: "", participationPercent: "", estimatedProduction: "" });
    loadData();
  };
  const totalContribution = (data.contributions || []).reduce(
    (sum, item) => sum + Number(item.landContribution || 0),
    0
  );

  return (
    <div className="space-y-5">
        <div className="flex justify-end gap-3">
          <Link
            to="/create-group"
            className="bg-green-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-900 flex items-center gap-2"
          >
            <Plus size={16} />
            Create Group
          </Link>

          <Link
            to="/join-group"
            className="border border-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100"
          >
            Join Group
          </Link>
        </div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="My Groups" value={data.currentGroups?.length || 0} icon={Users} />
        <StatCard title="Land Contributed" value={`${totalContribution} acres`} icon={Activity} />
        <StatCard title="Crop Interest" value={data.profile?.cropInterest || "-"} />
        <StatCard title="Role Status" value={data.profile?.role || "farmer"} />
      </div>

      <SectionCard title="Farmer Profile">
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <p><span className="text-gray-500">Name:</span> {data.profile?.fullName || "-"}</p>
          <p><span className="text-gray-500">Village:</span> {data.profile?.village || "-"}</p>
          <p><span className="text-gray-500">Land Size:</span> {data.profile?.landSize || 0} acres</p>
          <p><span className="text-gray-500">Crop Interests:</span> {data.profile?.cropInterest || "-"}</p>
          <p className="flex items-center gap-2"><span className="text-gray-500">Role:</span> <RolePill role={data.profile?.role || "farmer"} /></p>
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-2 gap-5">
        <ActionCard
          title="Create Group"
          description="Start a new collaborative farming collective and become leader automatically."
          to="/create-group"
          cta="Open Group Creation Form"
        />
        <ActionCard
          title="Join Group"
          description="Discover nearby crop-focused groups and send join request or direct join."
          to="/join-group"
          cta="Open Group Discovery"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Group History">
          <div className="space-y-2">
            {(data.currentGroups || []).map((entry, idx) => (
              <div key={`${entry.groupId}-${idx}`} className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="font-semibold text-gray-900">{entry.groupName}</p>
                <p className="text-gray-500">Joined: {new Date(entry.joinedAt).toLocaleDateString()}</p>
                <p className="text-green-800 text-xs uppercase mt-1">{entry.status}</p>
              </div>
            ))}
            {(data.currentGroups || []).length === 0 && <p className="text-sm text-gray-500">No active group history.</p>}
          </div>
        </SectionCard>
        <SectionCard title="Add Contribution">
          <form onSubmit={submitContribution} className="grid grid-cols-3 gap-2">
            <input
              placeholder="Land (acres)"
              className="border rounded-lg px-2 py-2"
              value={contributionForm.landContribution}
              onChange={(e) => setContributionForm((p) => ({ ...p, landContribution: e.target.value }))}
            />
            <input
              placeholder="Participation %"
              className="border rounded-lg px-2 py-2"
              value={contributionForm.participationPercent}
              onChange={(e) => setContributionForm((p) => ({ ...p, participationPercent: e.target.value }))}
            />
            <input
              placeholder="Production"
              className="border rounded-lg px-2 py-2"
              value={contributionForm.estimatedProduction}
              onChange={(e) => setContributionForm((p) => ({ ...p, estimatedProduction: e.target.value }))}
            />
            <button className="col-span-3 bg-green-800 text-white rounded-lg py-2">Save Contribution</button>
          </form>
          {currentGroup?.id && (
            <Link to={`/group/${currentGroup.id}`} className="inline-block mt-3 text-sm text-green-800 font-semibold">
              Open Group Room
            </Link>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Contribution History">
        <div className="space-y-2 text-sm">
          {(data.contributionHistory || []).map((entry, idx) => (
            <div key={`${entry.groupId}-${idx}`} className="bg-gray-50 rounded-lg p-3 flex justify-between">
              <span>{entry.landContribution} acres</span>
              <span>{entry.participationPercent}% participation</span>
              <span>{entry.estimatedProduction} qtl est.</span>
            </div>
          ))}
          {(data.contributionHistory || []).length === 0 && (
            <p className="text-sm text-gray-500">No contribution history yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default FarmerDashboard;
