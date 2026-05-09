import { useEffect, useMemo, useState } from "react";
import { User, Sprout, History, BadgeCheck, Bell, Settings } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import RolePill from "../components/shared/RolePill";
import { getFarmerDashboard } from "../services/dashboardService";

const Profile = () => {
  const { profile: ctxProfile } = useAuth();
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const d = await getFarmerDashboard();
        if (active) setDash(d);
      } catch {
        if (active) setDash(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const p = dash?.profile || ctxProfile;
  const contributionHistory = dash?.contributionHistory || [];
  const groupHistory = p?.groupHistory || [];

  const batchesParticipated = useMemo(() => {
    const seen = new Set();
    (contributionHistory || []).forEach((c) => {
      if (c.groupId) seen.add(c.groupId);
    });
    return seen.size;
  }, [contributionHistory]);

  if (loading && !p) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white/80 p-10 text-center text-sm text-slate-500">
        Loading profile…
      </div>
    );
  }

  if (!p) return null;

  const joinedSince = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-3xl border border-green-100/80 bg-gradient-to-br from-white to-green-50/40 p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-800">Profile</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {p.fullName || "Farmer"}
            </h1>
            <p className="mt-1 font-mono text-sm font-semibold text-green-900">{p.farmerId || "—"}</p>
            <p className="mt-2 text-sm text-slate-600">Member since {joinedSince}</p>
          </div>
          <RolePill role={p.role || "farmer"} />
        </div>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <User size={20} className="text-green-800" />
          <h2 className="text-lg font-bold">Personal information</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{p.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{p.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Village</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{p.village || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">State / District</dt>
            <dd className="mt-0.5 font-medium text-slate-900">
              {[p.state, p.district].filter(Boolean).join(" · ") || "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <Sprout size={20} className="text-green-800" />
          <h2 className="text-lg font-bold">Farming information</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Land size</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{p.landSize ?? 0} acres</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Crop preferences</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{p.cropInterest || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Farming interests</dt>
            <dd className="mt-0.5 text-slate-700">
              Collaborative collectives, seasonal planning, and shared batches with your group.
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <History size={20} className="text-green-800" />
          <h2 className="text-lg font-bold">Participation history</h2>
        </div>

        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Groups joined</h3>
        {groupHistory.length === 0 ? (
          <p className="mb-6 text-sm text-slate-500">No group history yet.</p>
        ) : (
          <ul className="mb-6 space-y-2">
            {groupHistory.map((g, idx) => (
              <li
                key={`${g.groupId}-${idx}`}
                className="flex flex-wrap items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-slate-900">{g.groupName || g.groupId}</span>
                <span className="text-xs uppercase text-slate-500">{g.status || "—"}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Contributions</h3>
        {contributionHistory.length === 0 ? (
          <p className="mb-6 text-sm text-slate-500">No contributions recorded yet.</p>
        ) : (
          <div className="mb-6 space-y-2">
            {contributionHistory.slice(0, 12).map((c, idx) => (
              <div
                key={`${c.groupId}-${idx}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm"
              >
                <span className="font-mono text-xs text-slate-600">{c.groupId || "—"}</span>
                <span className="text-slate-800">
                  {c.landContribution ?? 0} acres · {c.participationPercent ?? 0}%
                </span>
              </div>
            ))}
          </div>
        )}

        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Collectives participated (for batches context)
        </h3>
        <p className="text-sm text-slate-700">
          You have activity across <strong>{batchesParticipated}</strong> group
          {batchesParticipated === 1 ? "" : "s"} in your contribution record. Full batch lists live in
          each group room.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <BadgeCheck size={20} className="text-green-800" />
          <h2 className="text-lg font-bold">Role</h2>
        </div>
        <p className="text-sm text-slate-600">
          You are a <strong className="text-slate-900">{p.role === "leader" ? "Leader" : "Farmer"}</strong>
          . Creating a group upgrades you to lead that collective.
        </p>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
        <div className="flex items-center gap-2 text-amber-900">
          <Bell size={20} />
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>
        <p className="mt-2 text-sm text-amber-950/85">
          Join approvals, new batches, and crop updates will appear here when the notification service is
          connected.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-lg bg-white/70 px-3 py-2 text-amber-950/90">No notifications yet.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <Settings size={20} className="text-green-800" />
          <h2 className="text-lg font-bold">Settings</h2>
        </div>
        <p className="text-sm text-slate-600">
          Edit profile and preferences will use the same forms as registration flow in a later iteration.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Edit profile (coming soon)
          </span>
          <span className="text-sm text-slate-500">
            Sign out from the header when you&apos;re done.
          </span>
        </div>
      </section>
    </div>
  );
};

export default Profile;
