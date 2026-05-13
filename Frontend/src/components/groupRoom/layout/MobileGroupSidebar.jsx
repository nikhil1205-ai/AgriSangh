import { X, Home, Users, MessageCircle, Sprout, BarChart3, Box, DollarSign, Droplet, Cpu, Activity, Settings } from "lucide-react";

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

const MobileGroupSidebar = ({ open, activeTab, setActiveTab, group, profile, isLeader, onClose, onExit }) => {
  const filteredMenu = menuItems.filter((item) => !(item.leaderOnly && !isLeader));

  return (
    <div className={`${open ? "fixed inset-0 z-50" : "hidden"}`}>
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
          <nav className="space-y-2">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${active ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t border-slate-800/80 px-5 py-5">
          <div className="rounded-3xl bg-slate-900/95 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile</p>
            <p className="mt-2 text-sm font-semibold text-white">{profile?.fullName || "Farmer"}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{isLeader ? "Leader" : "Farmer"}</p>
          </div>
          <button onClick={onExit} className="mt-4 flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
            Exit Group Room
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MobileGroupSidebar;
