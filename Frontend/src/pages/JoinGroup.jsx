import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/groups/GroupCard";
import { discoverGroups, joinGroup } from "../services/dashboardService";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", region: "", crop: "", season: "" });
  const [groups, setGroups] = useState([]);

  const load = async () => {
    const data = await discoverGroups(filters);
    setGroups(data);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      const data = await discoverGroups(filters);
      if (active) setGroups(data);
    };
    init();
    return () => {
      active = false;
    };
  }, [filters]);

  const onJoin = async (groupId) => {
    await joinGroup({ groupId, directJoin: true });
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Group Discovery</h1>
        <div className="grid md:grid-cols-4 gap-2 mt-4">
          <input className="border rounded-lg px-3 py-2" placeholder="Search group/location" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} />
          <input className="border rounded-lg px-3 py-2" placeholder="Region" value={filters.region} onChange={(e) => setFilters((p) => ({ ...p, region: e.target.value }))} />
          <input className="border rounded-lg px-3 py-2" placeholder="Crop" value={filters.crop} onChange={(e) => setFilters((p) => ({ ...p, crop: e.target.value }))} />
          <input className="border rounded-lg px-3 py-2" placeholder="Season" value={filters.season} onChange={(e) => setFilters((p) => ({ ...p, season: e.target.value }))} />
        </div>
        <button onClick={load} className="mt-3 px-4 py-2 bg-green-800 text-white rounded-lg text-sm">Search Groups</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onJoin={onJoin} />
        ))}
        {groups.length === 0 && <p className="text-sm text-gray-500">No groups found for selected filters.</p>}
      </div>
    </div>
  );
};

export default JoinGroup;
