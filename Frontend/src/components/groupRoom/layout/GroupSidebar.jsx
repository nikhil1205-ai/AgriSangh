import { Home, Users, MessageCircle, Sprout, BarChart3, Box, DollarSign, Droplet, Cpu, Activity, Settings, LogOut, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const menuItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "members", label: "Members", icon: Users },
  { id: "chat", label: "Group Chat", icon: MessageCircle },
  { id: "crop", label: "Crop Planning", icon: Sprout },
  { id: "contributions", label: "Contributions", icon: BarChart3 },
  { id: "batch", label: "Batch Management", icon: Box, leaderOnly: true },
  { id: "revenue", label: "Revenue Distribution", icon: DollarSign },
  { id: "irrigation", label: "Irrigation Planning", icon: Droplet },
  { id: "technology", label: "Technology Access", icon: Cpu },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "timeline", label: "Seasonal Timeline", icon: Activity },
  { id: "settings", label: "Group Settings", icon: Settings },
];

const GroupSidebar = ({ open = false, activeTab, setActiveTab, group, profile, isLeader, onClose, onExit }) => {
  const filteredMenu = menuItems.filter((item) => !(item.leaderOnly && !isLeader));

  const renderMenu = () => (
    <nav className="space-y-2">
      {filteredMenu.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (onClose) onClose();
            }}
            className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${
              active ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  const content = (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950/20">
      <div className="sticky top-0 z-10 border-b border-slate-800/70 bg-slate-950/95 px-6 py-6 backdrop-blur-xl">
        <Link to="#" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/20"
          >
            <Sprout size={20} />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight leading-none uppercase text-sm text-white">AgriSangh</span>
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Infrastructure</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-emerald-400/80 font-medium">Active Group</p>
            <h2 className="mt-2 text-lg font-bold text-white truncate">{group?.groupName || group?.name || "Agri Collective"}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-3.5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Crop</p>
              <p className="mt-2 text-sm font-semibold text-white truncate">{group?.cropPlan?.crop || group?.cropFocus || "—"}</p>
            </div>

            <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-3.5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Season</p>
              <p className="mt-2 text-sm font-semibold text-white truncate">{group?.cropPlan?.season || group?.cropSeason || "—"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-slate-700/50 p-3.5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium mb-2 ">Status</p>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  group?.status === "harvested"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : group?.status === "archived"
                    ? "bg-slate-600/40 text-slate-300 border border-slate-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    group?.status === "harvested"
                      ? "bg-amber-400"
                      : group?.status === "archived"
                      ? "bg-slate-400"
                      : "bg-emerald-400"
                  }`}
                />
                {group?.status ? group.status.charAt(0).toUpperCase() + group.status.slice(1) : "Active"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8">{renderMenu()}</div>
        
      </div>

      <div className="border-t border-slate-800/70 bg-slate-950/95 px-6 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-3xl bg-slate-900/95 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">{profile?.fullName?.charAt(0)?.toUpperCase() || "A"}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{profile?.fullName || "Farmer"}</p>
            <p className="truncate text-xs uppercase tracking-[0.2em] text-slate-500">{isLeader ? "Leader" : "Farmer"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        >
          <LogOut size={16} /> Exit Group Room
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block lg:h-full lg:w-full">{content}</div>
      <div className={`${open ? "fixed inset-0 z-50 lg:hidden" : "hidden"}`}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
        <aside className="absolute left-0 top-0 h-full w-[280px] bg-slate-950 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">AgriSangh</p>
              <p className="text-sm text-white">Operations</p>
            </div>
            <button onClick={onClose} className="rounded-2xl bg-slate-800 p-2 text-slate-200 hover:bg-slate-700">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div className="rounded-[28px] bg-slate-900/95 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{group?.groupName || "Agri Collective"}</p>
              <p className="mt-2 text-xs text-slate-500">{group?.cropPlan?.crop || group?.cropFocus || "Crop TBD"}</p>
            </div>
            {renderMenu()}
          </div>
          <div className="mt-auto border-t border-slate-800/80 px-5 py-5">
            <div className="rounded-3xl bg-slate-900/95 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile</p>
              <p className="mt-2 text-sm font-semibold text-white">{profile?.fullName || "Farmer"}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{isLeader ? "Leader" : "Farmer"}</p>
            </div>
            <button
              onClick={onExit}
              className="mt-4 flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Exit Group Room
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default GroupSidebar;
