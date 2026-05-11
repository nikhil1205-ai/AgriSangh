import { useEffect, useState } from "react";
import { ArrowRight, Plus, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getLeaderDashboard,
  getJoinRequests,
  getContributions,
  getBatches,
  getGroupRoom,
  getRevenues,
  fetchGroups,
  createGroup,
} from "../services/dashboardService";

// Leader Components
import OverviewStats from "../components/leader/OverviewStats";
import ActiveCropBanner from "../components/leader/ActiveCropBanner";
import PendingRequestsPanel from "../components/leader/PendingRequestsPanel";
import MemberContributionTable from "../components/leader/MemberContributionTable";
import BatchStatusCard from "../components/leader/BatchStatusCard";
import RevenuePreview from "../components/leader/RevenuePreview";
import OperationsFeed from "../components/leader/OperationsFeed";
import AnalyticsCharts from "../components/leader/AnalyticsCharts";

const LeaderDashboard = () => {
  const { user } = useAuth();
  const [stage, setStage] = useState("groupSelect"); // "groupSelect" or "groupRoom"
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [group, setGroup] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createGroupForm, setCreateGroupForm] = useState({
    name: "",
    region: "",
    cropFocus: "",
  });

  // Fetch user's groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    loadGroups();
  }, [user]);

  // Load group room data when group is selected
  const enterGroupRoom = async (groupId) => {
    setLoading(true);
    try {
      const [
        dash,
        reqs,
        contribs,
        batchData,
        groupData,
        revenueData,
      ] = await Promise.all([
        getLeaderDashboard(groupId),
        getJoinRequests(groupId),
        getContributions(groupId),
        getBatches(groupId),
        getGroupRoom(groupId),
        getRevenues(groupId),
      ]);

      setSelectedGroupId(groupId);
      setDashboard(dash);
      setRequests(reqs);
      setContributions(contribs);
      setBatches(batchData);
      setGroup(groupData);
      setRevenues(revenueData || []);
      setStage("groupRoom");
    } catch (error) {
      console.error("Error entering group room:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh group room data
  const refreshGroupRoom = async (gid) => {
    if (!gid) return;
    try {
      const [
        dash,
        reqs,
        contribs,
        batchData,
        groupData,
        revenueData,
      ] = await Promise.all([
        getLeaderDashboard(gid),
        getJoinRequests(gid),
        getContributions(gid),
        getBatches(gid),
        getGroupRoom(gid),
        getRevenues(gid),
      ]);

      setDashboard(dash);
      setRequests(reqs);
      setContributions(contribs);
      setBatches(batchData);
      setGroup(groupData);
      setRevenues(revenueData || []);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Handle create group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const created = await createGroup(createGroupForm);
      setGroups([...groups, created]);
      setCreateGroupForm({ name: "", region: "", cropFocus: "" });
      // Auto-enter the newly created group
      await enterGroupRoom(created.id);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // GROUP SELECTION STAGE
  if (stage === "groupSelect") {
    return (
      <div className="min-h-screen bg-[#f8faf8] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Group Room</h1>
            <p className="text-gray-600">
              Select a farming group to manage operations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Existing Groups */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Groups</h2>

              {groups.length === 0 ? (
                <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                  <Lock className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-500">
                    No groups found. Create one to get started.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {groups.map((grp) => (
                    <div
                      key={grp.id}
                      className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-green-300 transition-all cursor-pointer"
                      onClick={() => enterGroupRoom(grp.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {grp.groupName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {grp.village}, {grp.district}
                          </p>
                          <div className="flex gap-4 mt-3">
                            <span className="text-sm">
                              👥 {grp.members?.length || 0} Members
                            </span>
                            <span className="text-sm">
                              🌾 {grp.cropFocus || "Not set"}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="text-green-600" size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Group Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Group
              </h2>

              <form
                onSubmit={handleCreateGroup}
                className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 space-y-4"
              >
                <input
                  type="text"
                  placeholder="Group name"
                  value={createGroupForm.name}
                  onChange={(e) =>
                    setCreateGroupForm((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Region / Village"
                  value={createGroupForm.region}
                  onChange={(e) =>
                    setCreateGroupForm((p) => ({
                      ...p,
                      region: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Crop focus (e.g., Wheat)"
                  value={createGroupForm.cropFocus}
                  onChange={(e) =>
                    setCreateGroupForm((p) => ({
                      ...p,
                      cropFocus: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Group
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GROUP ROOM STAGE
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setStage("groupSelect")}
            className="mb-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
          >
            ← Back to Groups
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {group?.groupName || "Group Room"}
          </h1>
          <p className="text-gray-600">
            {group?.village}, {group?.district}
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats dashboard={dashboard} />

      {/* Active Crop Banner */}
      <ActiveCropBanner group={group} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Operations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Requests */}
          <PendingRequestsPanel
            requests={requests}
            groupId={selectedGroupId}
            onRefresh={() => refreshGroupRoom(selectedGroupId)}
          />

          {/* Member Contributions */}
          <MemberContributionTable contributions={contributions} />

          {/* Batch Management */}
          <BatchStatusCard
            batches={batches}
            groupId={selectedGroupId}
            onRefresh={() => refreshGroupRoom(selectedGroupId)}
          />

          {/* Operations Feed */}
          <OperationsFeed groupId={selectedGroupId} />
        </div>

        {/* Right Column - Analytics & Revenue */}
        <div className="space-y-8">
          {/* Revenue Preview */}
          <RevenuePreview revenues={revenues} />

          {/* Analytics Charts */}
          <AnalyticsCharts dashboard={dashboard} contributions={contributions} />
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
