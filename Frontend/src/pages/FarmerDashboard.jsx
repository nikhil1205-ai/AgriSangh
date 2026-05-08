import { useEffect, useState } from "react";
import { Activity, Droplets, Tractor, Users } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import StatCard from "../components/ui/StatCard";
import ProgressBar from "../components/ui/ProgressBar";
import { addContribution, fetchGroups, getFarmerDashboard, joinGroup } from "../services/dashboardService";

const FarmerDashboard = () => {
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [contributionForm, setContributionForm] = useState({
    landContribution: "",
    participationPercent: "",
    estimatedProduction: "",
  });
  const [data, setData] = useState({ groups: [], contributions: [] });

  const loadData = async () => {
    const [allGroups, dashboard] = await Promise.all([fetchGroups(), getFarmerDashboard()]);
    setGroups(allGroups);
    setData(dashboard);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      const [allGroups, dashboard] = await Promise.all([fetchGroups(), getFarmerDashboard()]);
      if (active) {
        setGroups(allGroups);
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
    await addContribution({ groupId: currentGroup?.id, ...contributionForm });
    setContributionForm({ landContribution: "", participationPercent: "", estimatedProduction: "" });
    loadData();
  };

  const requestJoin = async () => {
    if (!groupId) return;
    await joinGroup({ groupId });
    setGroupId("");
  };

  const totalContribution = data.contributions.reduce((sum, item) => sum + Number(item.landContribution), 0);
  const estimatedRevenue = totalContribution * 35000;

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="My Groups" value={data.groups.length} icon={Users} />
        <StatCard title="Land Contributed" value={`${totalContribution} acres`} icon={Activity} />
        <StatCard title="Revenue Estimate" value={`Rs ${estimatedRevenue.toLocaleString()}`} icon={Tractor} />
        <StatCard title="Water Reminder" value={currentGroup?.irrigationPlan?.schedule || "Pending"} icon={Droplets} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Join Collective Group">
          <div className="flex gap-2">
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="">Select group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} - {group.region}
                </option>
              ))}
            </select>
            <button onClick={requestJoin} className="px-4 py-2 bg-green-800 text-white rounded-lg">
              Request
            </button>
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
        </SectionCard>
      </div>

      <SectionCard title="Technology Access + Irrigation + Revenue Split">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">Technology Access</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>Drone spraying: Available</li>
              <li>Soil testing: Available</li>
              <li>Smart irrigation: Scheduled</li>
              <li>Equipment sharing: Enabled</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">Participation Progress</p>
            <div className="mt-2 space-y-2">
              {data.contributions.map((entry) => (
                <div key={entry.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{entry.farmerName}</span>
                    <span>{entry.participationPercent}%</span>
                  </div>
                  <ProgressBar value={Number(entry.participationPercent)} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">Revenue Share Logic</p>
            <p className="text-gray-600 mt-2">Revenue share is proportional to land contribution percentage.</p>
            <p className="text-gray-800 mt-2 font-semibold">Your est. earning: Rs {estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default FarmerDashboard;
