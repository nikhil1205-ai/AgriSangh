import { useEffect, useState, useMemo } from "react";
import { BarChart3, Leaf, MapPin, Sparkles, ShieldCheck, Users, Zap } from "lucide-react";
import axios from "axios";
import ActiveGroupCard from "../components/groups/ActiveGroupCard";
import PastGroupCard from "../components/groups/PastGroupCard";
import { getFarmerDashboard, getGroupRoom } from "../services/dashboardService";

const MyGroups = () => {
  
  const [data, setData] = useState({
    profile: null,
    groups: [],
    contributionHistory: [],
    currentGroups: [],
    previousGroups: [],
  });
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);

  const loadData = async () => {
    const dashboard = await getFarmerDashboard();
    setData(dashboard);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const dashboard = await getFarmerDashboard();
        if (active) setData(dashboard);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const activeGroupId = data.groups?.[0]?.id ?? null;

  useEffect(() => {
    if (!activeGroupId) {
      setActiveRoom(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setRoomLoading(true);
      try {
        const room = await getGroupRoom(activeGroupId);
        if (!cancelled) setActiveRoom(room);
      } catch {
        if (!cancelled) setActiveRoom(null);
      } finally {
        if (!cancelled) setRoomLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeGroupId]);

  const profile = data.profile;
  const g = activeRoom?.group;

    const myContributionPct = useMemo(() => {
      const list = activeRoom?.contributions || [];
      const match = list.find((c) => c.farmerName === profile?.fullName);
      if (match?.participationPercent != null) return Number(match.participationPercent);
      const last = (data.contributionHistory || []).find((c) => c.groupId === activeGroupId);
      return last?.participationPercent != null ? Number(last.participationPercent) : null;
    }, [activeRoom, profile, data.contributionHistory, activeGroupId]);
  
    const totalContributionLand = useMemo(
      () =>
        (data.contributionHistory || []).reduce(
          (sum, row) => sum + Number(row.landContribution || 0),
          0
        ),
      [data.contributionHistory]
    );
  
    const batchCountActive = (activeRoom?.batches || []).length;
  
    const pastTimeline = useMemo(() => {
      const hist = data.profile?.groupHistory || [];
      const activeId = activeGroupId;
      const leftOrOld = hist.filter((h) => h.status === "left" || (h.groupId && h.groupId !== activeId));
      if (leftOrOld.length) {
        return leftOrOld.map((h, idx) => ({
          key: `${h.groupId}-${idx}`,
          title: h.groupName || h.groupId,
          subtitle: h.status === "left" ? "Left group" : "Previous",
          date: h.leftAt || h.joinedAt,
          meta: h.groupId,
        }));
      }
      const contrib = data.contributionHistory || [];
      const seen = new Set();
      const rows = [];
      contrib.forEach((c, idx) => {
        if (!c.groupId || c.groupId === activeId) return;
        if (seen.has(c.groupId)) return;
        seen.add(c.groupId);
        rows.push({
          key: `${c.groupId}-${idx}`,
          title: c.groupId,
          subtitle: `${c.landContribution ?? 0} acres · ${c.participationPercent ?? 0}%`,
          date: c.createdAt,
          meta: c.estimatedProduction != null ? `Est. ${c.estimatedProduction} qtl` : "",
        });
      });
      return rows.slice(0, 8);
    }, [data.profile, data.contributionHistory, activeGroupId]);
  
    const joinedSince = profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";
  
    const currentSeason =
      g?.cropPlan?.season || g?.cropSeason || activeRoom?.batches?.[0]?.season || "—";
  
    const activeCrop = g?.cropPlan?.crop || g?.cropFocus || "—";
    const currentBatch = activeRoom?.batches?.[0];
    const leaderName = g?.leader?.name || g?.leader?.fullName || "—";

    const activeGroup = activeGroupId ? {
      id: activeGroupId,
      name: g?.name || "Active Group",
      description: g?.description || "Description of the active group.",
      crop: activeCrop,
      season: currentSeason,
      leader: leaderName,
      members: g?.members?.length || 0,
      landArea: `${totalContributionLand} acres`,
      contribution: myContributionPct ? `${myContributionPct}%` : "0%",
      batchStatus: currentBatch ? "Ready for Dispatch" : "In Progress",
      location: {
        name: g?.location ? `${g.location.state}, ${g.location.district}, ${g.location.village}` : "Location",
        lat: g?.lat || 26.9200,
        lng: g?.lng || 81.1900,
        members: (activeRoom?.contributions || []).map(c => ({
          id: c.farmerName,
          name: c.farmerName,
          lat: c.lat || 26.9200,
          lng: c.lng || 81.1900
        }))
      },
      irrigation: g?.irrigationStatus || "Drip irrigation active",
      progress: g?.progress || "79% crop cycle complete",
      verification: g?.verificationStatus || "Verified batch ID",
      membersPreview: (activeRoom?.contributions || []).slice(0, 4).map(c => ({
        id: c.farmerName,
        name: c.farmerName,
        role: c.role || "Member",
        contribution: `${c.participationPercent || 0}%`,
        avatar: c.farmerName.charAt(0).toUpperCase()
      }))
    } : null;

    const pastGroups = pastTimeline.map(item => ({
      id: item.key,
      name: item.title,
      season: item.date ? new Date(item.date).getFullYear().toString() : "2025",
      summary: item.subtitle,
      crop: "Wheat",
      yield: item.meta.includes("qtl") ? item.meta : "21.4 t",
      members: 14,
      landArea: "36 acres",
      verification: "Batch certified"
    }));

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 text-white p-8 shadow-2xl shadow-emerald-900/20 border border-white/10">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/80">My Groups</p>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">Operational gateway into collective farming.</h1>
            <p className="text-slate-100/85 max-w-2xl text-base sm:text-lg">
              Access your active group, explore operational intelligence, and keep a pulse on verified crop progress from one collaborative command center.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Active group</p>
              <p className="mt-3 text-3xl font-bold">{activeGroup ? "1" : "0"}</p>
              <p className="mt-2 text-sm text-emerald-100/80">Farmer may only hold one active group at a time.</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Current season</p>
              <p className="mt-3 text-3xl font-bold">{currentSeason}</p>
              <p className="mt-2 text-sm text-emerald-100/80">Operational season with verified batch readiness.</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center p-14 rounded-[32px] bg-white/80 border border-slate-200 shadow-sm">
          <p className="text-slate-600">Loading group insights...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeGroup && (
            <ActiveGroupCard group={activeGroup} role={profile?.role} />
          )}

          <section className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Past collective history</p>
                <h2 className="text-2xl font-bold text-slate-900">Completed and archived collaborations</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-sm">
                <Leaf size={18} /> Operational record maintained
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {pastGroups.map((group) => (
                <PastGroupCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyGroups;
