import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Users,
  Plus,
  Handshake,
  Leaf,
  Calendar,
  Package,
  Percent,
  Activity,
  LineChart,
  Clock,
  ChevronRight,
  Bell,
} from "lucide-react";
import RolePill from "../components/shared/RolePill";
import { getFarmerDashboard, getGroupRoom } from "../services/dashboardService";

/**
 * Farmer Home — personal overview, ONE active group, quick entry, mini analytics.
 * Operational work happens inside Group / Leader rooms.
 */
const FarmerDashboard = () => {
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

  if (loading && !profile) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white/80 p-10 text-center text-sm text-slate-500">
        Loading your workspace…
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Farmer overview</h2>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Farmer ID</p>
                <p className="font-mono text-lg font-bold text-green-900">{profile?.farmerId || "—"}</p>
              </div>
              <RolePill role={profile?.role || "farmer"} />
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">Name</dt>
                <dd className="font-semibold text-slate-900">{profile?.fullName || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Village</dt>
                <dd className="font-semibold text-slate-900">{profile?.village || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Total land</dt>
                <dd className="font-semibold text-slate-900">{profile?.landSize ?? 0} acres</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Crop preference</dt>
                <dd className="font-semibold text-slate-900">{profile?.cropInterest || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Joined since</dt>
                <dd className="flex items-center gap-2 text-slate-900">
                  <Clock size={16} className="text-green-700" />
                  {joinedSince}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
              Active group
            </h2>
            {!activeGroupId && (
              <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 p-8 text-center">
                <Users className="mx-auto mb-3 text-green-700" size={36} />
                <p className="font-semibold text-slate-800">No active group yet</p>
                <p className="mt-1 text-sm text-slate-600">Join or create one collective — you can hold one active group.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/join-group"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-900"
                  >
                    <Handshake size={18} /> Join a group
                  </Link>
                  <Link
                    to="/create-group"
                    className="inline-flex items-center gap-2 rounded-xl border border-green-800 bg-white px-5 py-3 text-sm font-bold text-green-900 transition hover:bg-green-50"
                  >
                    <Plus size={18} /> Create a group
                  </Link>
                </div>
              </div>
            )}

            {activeGroupId && (
              <div className="overflow-hidden rounded-2xl border-2 border-green-800/25 bg-gradient-to-br from-white to-green-50/60 shadow-md shadow-green-900/5">
                <div className="border-b border-green-100 bg-green-800 px-6 py-4 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sprout size={22} />
                      <span className="font-bold">{g?.name || g?.groupName || data.groups[0]?.name}</span>
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/90">Leader: {leaderName}</p>
                </div>
                <div className="p-6">
                  {roomLoading ? (
                    <p className="text-sm text-slate-500">Loading group details…</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                        <Leaf className="shrink-0 text-green-700" size={20} />
                        <div>
                          <p className="text-xs text-slate-500">Active crop</p>
                          <p className="font-semibold text-slate-900">{activeCrop}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                        <Calendar className="shrink-0 text-green-700" size={20} />
                        <div>
                          <p className="text-xs text-slate-500">Season</p>
                          <p className="font-semibold text-slate-900">{currentSeason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                        <Package className="shrink-0 text-green-700" size={20} />
                        <div>
                          <p className="text-xs text-slate-500">Current batch</p>
                          <p className="font-semibold text-slate-900">
                            {currentBatch?.batchId || "None yet"}
                          </p>
                          {currentBatch?.status && (
                            <p className="text-xs text-slate-500">{currentBatch.status}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                        <Percent className="shrink-0 text-green-700" size={20} />
                        <div>
                          <p className="text-xs text-slate-500">Your contribution</p>
                          <p className="font-semibold text-slate-900">
                            {myContributionPct != null ? `${myContributionPct}%` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-green-100 pt-4">
                    <span className="text-xs font-semibold uppercase text-slate-500">Status</span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-900">
                      Participating
                    </span>
                    <Link
                      to={
                        profile?.role === "leader"
                          ? `/leader/group/${activeGroupId}`
                          : `/group/${activeGroupId}`
                      }
                      className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-green-800 hover:underline"
                    >
                      Enter group room <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
              Past group history
            </h2>
            {pastTimeline.length === 0 ? (
              <p className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-slate-500">
                No past groups yet. When you leave a collective or participate elsewhere, it appears
                here.
              </p>
            ) : (
              <div className="relative space-y-0 border-l-2 border-green-200 pl-6">
                {pastTimeline.map((item) => (
                  <div key={item.key} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-green-600 shadow" />
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                      {item.meta && <p className="mt-1 text-xs text-slate-600">{item.meta}</p>}
                      {item.date && (
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                to="/create-group"
                className="flex items-center justify-between rounded-2xl bg-green-800 p-5 text-white shadow-md transition hover:bg-green-900"
              >
                <span className="flex items-center gap-3">
                  <Plus size={22} />
                  <span className="font-bold">Create group</span>
                </span>
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/join-group"
                className="flex items-center justify-between rounded-2xl border-2 border-green-800/20 bg-white p-5 text-green-900 shadow-sm transition hover:bg-green-50"
              >
                <span className="flex items-center gap-3">
                  <Handshake size={22} />
                  <span className="font-bold">Join group</span>
                </span>
                <ChevronRight size={20} />
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Accounting, batches, and contributions are managed inside each group room.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Mini analytics</h2>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Activity size={18} className="text-green-700" />
                  Total contribution (land)
                </span>
                <span className="font-bold text-slate-900">{totalContributionLand} acres</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Package size={18} className="text-green-700" />
                  Batches (active group)
                </span>
                <span className="font-bold text-slate-900">{batchCountActive}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar size={18} className="text-green-700" />
                  Current season
                </span>
                <span className="font-bold text-slate-900">{currentSeason}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <LineChart size={18} className="text-green-700" />
                  Est. revenue share
                </span>
                <span className="max-w-[55%] text-right text-sm font-bold text-slate-900">
                  {myContributionPct != null
                    ? `~${myContributionPct}% of pool`
                    : "—"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
            <div className="flex items-center gap-2 text-amber-900">
              <Bell size={20} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Notifications preview</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-amber-950/90">
              <li className="rounded-lg bg-white/70 px-3 py-2">Group join approved — Coming soon</li>
              <li className="rounded-lg bg-white/70 px-3 py-2">New batch created — Coming soon</li>
              <li className="rounded-lg bg-white/70 px-3 py-2">Crop plan updated — Coming soon</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
