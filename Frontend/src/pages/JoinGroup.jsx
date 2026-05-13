import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/groups/GroupCard";
import { discoverGroups, joinGroup, getFarmerDashboard } from "../services/dashboardService";
import { motion } from 'framer-motion';
import {
  Handshake,
  Search,
  MapPin,
  Sprout,
  Calendar,
  Users
} from 'lucide-react';

const JoinGroup = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", region: "", crop: "", season: "" });
  const [groups, setGroups] = useState([]);
  const [hasActiveGroup, setHasActiveGroup] = useState(false);

  const load = async () => {
    const data = await discoverGroups(filters);
    setGroups(data);
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const [dashboard, groups] = await Promise.all([getFarmerDashboard(), discoverGroups(filters)]);
        if (active) {
          setHasActiveGroup((dashboard.groups || []).length > 0);
          setGroups(groups);
        }
      } catch (error) {
        console.warn("Unable to load discovery or dashboard data", error);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [filters]);

  const onJoin = async (groupId) => {
    if (hasActiveGroup) {
      window.alert("You already have an active group this season. Leave or archive it before joining another.");
      return;
    }

    const ok = window.confirm("Join this group? Your land size will be automatically added from your profile.");
    if (!ok) return;
    try {
      await joinGroup({ groupId, directJoin: true });
      navigate(`/group/${groupId}`);
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Unable to join group.");
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/40"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <Handshake className="text-green-800" size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Group Discovery
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 px-4 py-2.5 rounded-xl">
            <Users size={18} className="shrink-0" />
            <p className="text-xs font-bold uppercase tracking-widest leading-none">
              Find and Join Collectives
            </p>
          </div>
          {hasActiveGroup && (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
              You already have an active group this season. Leave or archive your current group before joining a new one.
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
                placeholder="Search group/location"
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              />
            </div>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
                placeholder="Region"
                value={filters.region}
                onChange={(e) => setFilters((p) => ({ ...p, region: e.target.value }))}
              />
            </div>
            <div className="relative group">
              <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
                placeholder="Crop"
                value={filters.crop}
                onChange={(e) => setFilters((p) => ({ ...p, crop: e.target.value }))}
              />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
                placeholder="Season"
                value={filters.season}
                onChange={(e) => setFilters((p) => ({ ...p, season: e.target.value }))}
              />
            </div>
          </div>
          <button
            onClick={load}
            className="mt-4 bg-green-800 text-white rounded-2xl py-3 px-6 font-bold uppercase tracking-widest text-sm hover:bg-green-900 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Search Groups
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onJoin={onJoin} disabled={hasActiveGroup} />
          ))}
          {groups.length === 0 && <p className="text-sm text-gray-500 col-span-2 text-center">No groups found for selected filters.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default JoinGroup;