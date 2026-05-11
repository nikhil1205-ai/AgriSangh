import { useMemo } from "react";
import { UserPlus, UserMinus, ShieldCheck } from "lucide-react";

const GroupMembers = ({ members = [], role, pendingRequests = [], onApprove, onReject, onRemove }) => {
  const memberRows = useMemo(() => members.map((member) => ({
    id: member.id || member._id || member.firebaseUid,
    name: member.fullName || member.farmerId || "Farmer",
    farmerId: member.farmerId || "—",
    land: member.landSize || member.landContribution || 0,
    participation: member.participationPercentage || 0,
    role: member.role || "farmer",
    joinedAt: new Date(member.createdAt || member.joinedAt || Date.now()).toLocaleDateString(),
  })), [members]);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Members</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">Operational Team</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <UserPlus size={16} /> {members.length} active
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-100 bg-slate-50">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Farmer ID</th>
              <th className="px-4 py-3">Land</th>
              <th className="px-4 py-3">Participation</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberRows.map((member) => (
              <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-900">{member.name}</td>
                <td className="px-4 py-4">{member.farmerId}</td>
                <td className="px-4 py-4">{member.land} acres</td>
                <td className="px-4 py-4">{member.participation}%</td>
                <td className="px-4 py-4">{member.role}</td>
                <td className="px-4 py-4">{member.joinedAt}</td>
                <td className="px-4 py-4">
                  {role === "leader" ? (
                    <button
                      onClick={() => onRemove?.(member.id)}
                      className="rounded-2xl bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {role === "leader" && pendingRequests.length > 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-green-200 bg-green-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="text-green-700" />
            <p className="font-semibold text-slate-900">Pending join requests</p>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id || request._id} className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{request.fullName || request.farmerName || "Farmer"}</p>
                    <p className="text-sm text-slate-500">Requested at {new Date(request.requestedAt || request.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onApprove?.(request)} className="rounded-2xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700">Approve</button>
                    <button onClick={() => onReject?.(request)} className="rounded-2xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembers;