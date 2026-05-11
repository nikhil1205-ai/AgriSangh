import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Layers, MapPin, ShieldCheck, Sparkles, Users, Droplet } from "lucide-react";
import GroupMap from "./GroupMap";
import MemberPreview from "./MemberPreview";

const ActiveGroupCard = ({ group, isLeader }) => {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-2xl shadow-green-900/10 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100/80 px-4 py-2 text-sm font-semibold text-emerald-900">
            <Sparkles size={16} /> Active farming group
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-3xl font-extrabold text-slate-900">{group.name}</h2>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {group.season}
              </span>
            </div>
            <p className="text-slate-600 max-w-2xl">{group.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Crop</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{group.crop}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Leader</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{group.leader}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-emerald-50 p-5 border border-emerald-100/80">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Members</p>
              <p className="mt-3 text-2xl font-bold text-emerald-900">{group.members}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operational land</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{group.landArea}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Your contribution</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{group.contribution}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Batch status</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{group.batchStatus}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-1 lg:w-[420px]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Operational location</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{group.location.name}</p>
              </div>
              <MapPin className="text-emerald-700" size={20} />
            </div>
            <div className="mt-4 h-72 rounded-3xl overflow-hidden border border-slate-200"><GroupMap location={group.location} /></div>
          </div>
          <div className="grid gap-3 rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <Droplet size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Irrigation</p>
                <p className="text-base font-semibold text-slate-900">{group.irrigation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Progress</p>
                <p className="text-base font-semibold text-slate-900">{group.progress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Verification</p>
                <p className="text-base font-semibold text-slate-900">{group.verification}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Member contribution preview</h3>
            <p className="mt-2 text-sm text-slate-600">Quick access to contributor details, roles, and land participation.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <Users size={18} /> {group.members} members
          </div>
        </div>
        {group.membersPreview?.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {group.membersPreview.map((member) => (
              <div key={member.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 font-bold shadow-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                    {member.contribution}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Farmer</p>
                    <p className="font-semibold text-slate-900">{member.name}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Contribution</p>
                    <p className="font-semibold text-slate-900">{member.contribution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : group.membersList?.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {group.membersList.map((member) => (
              <div key={member.id || member.uid} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 font-bold shadow-sm">
                    {member.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{member.name || 'Unknown'}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{member.role || 'Member'}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Member</p>
                    <p className="font-semibold text-slate-900">{member.name || 'Unknown'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</p>
                    <p className="font-semibold text-slate-900">{member.role || 'Member'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No member details are available yet.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 my-8">
        <Link
          to={`/group/${group.id}`}
          className="inline-flex items-center justify-center rounded-3xl bg-emerald-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <ArrowRight size={18} className="mr-2" /> Enter Group Room
        </Link>
        <button type="button" className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          <BarChart3 size={18} className="mr-2 inline" /> View Analytics
        </button>
        <button type="button" className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          <Layers size={18} className="mr-2 inline" /> View Crop Plan
        </button>
      </div>
    </section>
  );
};

export default ActiveGroupCard;
