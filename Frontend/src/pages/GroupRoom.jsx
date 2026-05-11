import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import GroupOverview from "../components/groupRoom/GroupOverview";
import GroupMembers from "../components/groupRoom/GroupMembers";
import GroupChat from "../components/groupRoom/GroupChat";
import CropPlanning from "../components/groupRoom/CropPlanning";
import ContributionBoard from "../components/groupRoom/ContributionBoard";
import BatchManagement from "../components/groupRoom/BatchManagement";
import RevenueBoard from "../components/groupRoom/RevenueBoard";
import IrrigationPlanner from "../components/groupRoom/IrrigationPlanner";
import TechnologyAccess from "../components/groupRoom/TechnologyAccess";
import SeasonalTimeline from "../components/groupRoom/SeasonalTimeline";
import AnalyticsPanel from "../components/groupRoom/AnalyticsPanel";
import GroupSettings from "../components/groupRoom/GroupSettings";
import GroupLayout from "../components/groupRoom/layout/GroupLayout";
import GroupSidebar from "../components/groupRoom/layout/GroupSidebar";
import GroupNavbar from "../components/groupRoom/layout/GroupNavbar";
import MobileGroupSidebar from "../components/groupRoom/layout/MobileGroupSidebar";
import {
  archiveGroup,
  createBatch,
  decideJoinRequest,
  getGroupRoom,
  getJoinRequests,
  getLeaderDashboard,
  leaveGroup,
  removeMember,
  updateCropPlan,
} from "../services/dashboardService";

const pageTitles = {
  overview: "Overview",
  members: "Members",
  chat: "Group Chat",
  crop: "Crop Planning",
  contributions: "Contributions",
  batch: "Batch Management",
  revenue: "Revenue Distribution",
  irrigation: "Irrigation Planning",
  technology: "Technology Access",
  analytics: "Analytics",
  timeline: "Seasonal Timeline",
  settings: "Group Settings",
};

const GroupRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, firebaseUser } = useAuth();
  const [room, setRoom] = useState({ group: null, contributions: [], batches: [] });
  const [analytics, setAnalytics] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const group = room.group;
  const quickSeason = group?.cropPlan?.season || group?.cropSeason || "Rabi 2026";
  const isLeader = profile?.role === "leader" || group?.leader?.uid === firebaseUser?.uid;
  const isMember = useMemo(() => {
    if (!group || !firebaseUser) return false;
    const currentUid = firebaseUser.uid;
    return (
      group?.leader?.uid === currentUid ||
      (group?.members || []).some((member) => member?.uid === currentUid || member?.firebaseUid === currentUid)
    );
  }, [group, firebaseUser]);

  const loadGroupRoom = async () => {
    try {
      const roomData = await getGroupRoom(id);
      setRoom(roomData);
      if (isLeader) {
        try {
          const analyticsData = await getLeaderDashboard(id);
          setAnalytics(analyticsData);
        } catch {
          setAnalytics({});
        }
        try {
          const requests = await getJoinRequests(id);
          setPendingRequests(requests || []);
        } catch {
          setPendingRequests([]);
        }
      }
    } catch (error) {
      console.error("Unable to load group room", error);
    }
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      if (!active) return;
      await loadGroupRoom();
    };
    init();
    return () => {
      active = false;
    };
  }, [id, isLeader]);

  const summary = useMemo(
    () => ({
      land: group?.totalExpectedLand || group?.totalOperationalLand || 0,
      activeBatch: group?.batches?.length ? group.batches[0]?.batchId || group.batches[0]?.cropType : "None",
      yield: analytics?.projectedYield || analytics?.yield || group?.projectedYield || 0,
      revenue: group?.revenue?.totalRevenue || analytics?.revenue || 0,
      participation: analytics?.participation || 0,
      batchProgress: analytics?.batchProgress || 0,
    }),
    [analytics, group]
  );

  const activity = useMemo(
    () => [
      {
        icon: "🌾",
        title: "Crop plan confirmed",
        detail: group?.cropPlan?.crop ? `Crop plan for ${group.cropPlan.crop} is set.` : "Waiting for leader approval.",
      },
      {
        icon: "💧",
        title: "Irrigation scheduled",
        detail: group?.irrigationPlan?.method ? `Next watering on ${group.irrigationPlan.nextDate}` : "No irrigation schedule yet.",
      },
      {
        icon: "📊",
        title: "Contribution data updated",
        detail: `${room.contributions?.length || 0} contributions recorded.`,
      },
    ],
    [group, room.contributions]
  );

  const handleCropPlanUpdate = async (payload) => {
    try {
      setActionLoading(true);
      await updateCropPlan(id, payload);
      await loadGroupRoom();
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to update crop plan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBatch = async (payload) => {
    try {
      setActionLoading(true);
      await createBatch({ groupId: id, ...payload });
      await loadGroupRoom();
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to create batch.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecision = async (request, approved) => {
    try {
      setActionLoading(true);
      await decideJoinRequest(id, { requestId: request.id || request._id, approved });
      await loadGroupRoom();
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to update request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberUid) => {
    try {
      setActionLoading(true);
      await removeMember(id, memberUid);
      await loadGroupRoom();
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to remove member.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    const ok = window.confirm("Leave this group and return to your dashboard?");
    if (!ok) return;
    try {
      setActionLoading(true);
      await leaveGroup(id);
      navigate("/dashboard");
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to leave group.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveGroup = async () => {
    const ok = window.confirm("Archive this group and end the current season for everyone?");
    if (!ok) return;
    try {
      setActionLoading(true);
      await archiveGroup(id);
      navigate("/dashboard");
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to archive group.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGroup = () => {
    window.alert("Use the group settings panel to update information when backend support is available.");
  };

  const handleTransferLeadership = () => {
    window.alert("Leadership transfer will be available after selecting a member.");
  };

  const handleQuickAction = (target) => {
    setActiveTab(target);
    setMobileSidebarOpen(false);
  };

  const handleExitAction = () => {
    if (isLeader) {
      handleArchiveGroup();
    } else {
      handleLeaveGroup();
    }
  };

  if (!group) {
    return <div className="min-h-screen bg-slate-100 px-4 py-10 text-center text-slate-700">Loading group room...</div>;
  }

  const renderWorkspace = () => {
    switch (activeTab) {
      case "members":
        return (
          <GroupMembers
            members={group.members || []}
            role={isLeader ? "leader" : "farmer"}
            pendingRequests={pendingRequests}
            onApprove={(request) => handleDecision(request, true)}
            onReject={(request) => handleDecision(request, false)}
            onRemove={handleRemoveMember}
          />
        );
      case "chat":
        return <GroupChat role={isLeader ? "leader" : "farmer"} userName={profile?.fullName || "You"} />;
      case "crop":
        return <CropPlanning group={group} role={isLeader ? "leader" : "farmer"} onUpdate={handleCropPlanUpdate} />;
      case "contributions":
        return <ContributionBoard contributions={room.contributions} batchLocked={group.status !== "active"} />;
      case "batch":
        return <BatchManagement batches={room.batches} role={isLeader ? "leader" : "farmer"} onCreate={handleCreateBatch} onUpdateStatus={() => window.alert("Batch status updates are available after backend integration.")} />;
      case "revenue":
        return <RevenueBoard revenue={group.revenue || { totalRevenue: 0, distribution: [] }} />;
      case "irrigation":
        return <IrrigationPlanner irrigation={group.irrigationPlan || group.irrigation} />;
      case "technology":
        return <TechnologyAccess />;
      case "analytics":
        return <AnalyticsPanel summary={summary} />;
      case "timeline":
        return <SeasonalTimeline group={group} />;
      case "settings":
        return <GroupSettings group={group} role={isLeader ? "leader" : "farmer"} onUpdate={handleUpdateGroup} onTransfer={handleTransferLeadership} onArchive={handleArchiveGroup} />;
      default:
        return (
          <div className="space-y-6">
            <GroupOverview group={group} summary={summary} activity={activity} />
            <div className="grid gap-6 xl:grid-cols-2">
              <ContributionBoard contributions={room.contributions} batchLocked={group.status !== "active"} />
              <AnalyticsPanel summary={summary} />
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              <IrrigationPlanner irrigation={group.irrigationPlan || group.irrigation} />
              <TechnologyAccess />
              <SeasonalTimeline group={group} />
            </div>
          </div>
        );
    }
  };

  return (
    <GroupLayout
      sidebar={
        <GroupSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          group={group}
          profile={profile}
          isLeader={isLeader}
          onExit={handleExitAction}
        />
      }
      mobileSidebar={
        <MobileGroupSidebar
          open={mobileSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          group={group}
          profile={profile}
          isLeader={isLeader}
          onClose={() => setMobileSidebarOpen(false)}
          onExit={handleExitAction}
        />
      }
      navbar={
        <GroupNavbar
          title={pageTitles[activeTab] || "Workspace"}
          subtitle="Operations Center"
          currentSeason={quickSeason}
          profile={profile}
          pendingRequests={pendingRequests}
          isLeader={isLeader}
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onQuickAction={handleQuickAction}
        />
      }
    >
      <div className="space-y-6">
        <div className="space-y-6">{renderWorkspace()}</div>
      </div>
    </GroupLayout>
  );
};

export default GroupRoom;
