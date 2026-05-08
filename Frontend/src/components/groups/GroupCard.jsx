const GroupCard = ({ group, onJoin }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
        <p className="text-sm text-gray-500">
          {group.location?.village}, {group.location?.district}, {group.location?.state}
        </p>
      </div>
      <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-md">
        {group.cropPlan?.season}
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
      <p>Leader: {group.leaderName || "Leader"}</p>
      <p>Members: {group.totalMembers || group.members?.length || 0}</p>
      <p>Crop: {group.cropFocus}</p>
      <p>Total Land: {group.totalLand || group.totalExpectedLand || 0} acres</p>
    </div>
    <button
      onClick={() => onJoin(group.id)}
      className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg text-sm font-semibold"
    >
      Join Group
    </button>
  </div>
);

export default GroupCard;
