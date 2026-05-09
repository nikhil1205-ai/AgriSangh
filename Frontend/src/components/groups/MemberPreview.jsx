const MemberPreview = ({ member }) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 font-bold shadow-sm">
          {member.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{member.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{member.role}</p>
        </div>
      </div>
      <div className="mt-4 rounded-3xl bg-slate-100 p-3 text-sm font-semibold text-slate-900">
        Contribution <span className="text-emerald-700">{member.contribution}</span>
      </div>
    </div>
  );
};

export default MemberPreview;
