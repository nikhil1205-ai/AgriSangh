import { useMemo, useState } from "react";
import { Bell, Menu, Search, SunMedium, ChevronDown, Users, Activity, Box, MessageCircle } from "lucide-react";

const notificationItems = [
  { label: "1 join request received", type: "Join request" },
  { label: "Crop plan updated", type: "Crop update" },
  { label: "New batch pending review", type: "Batch alert" },
  { label: "Irrigation reminder issued", type: "Irrigation" },
];

const GroupNavbar = ({ title, subtitle, currentSeason, profile, pendingRequests, isLeader, onOpenMobile, onQuickAction }) => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const notifications = useMemo(() => {
    const requests = pendingRequests?.length ? [{ label: `${pendingRequests.length} pending join requests`, type: "Join request" }] : [];
    return [...requests, ...notificationItems.slice(0, 3)];
  }, [pendingRequests]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-200/20">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobile} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 lg:hidden">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-green-600">{subtitle}</p>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          </div>
        </div>

        <div className="hidden flex-1 items-center gap-4 md:flex">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members, batches, crop plans..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative">
            <button onClick={() => setDropdownOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200">
              <Bell size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-400/10">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <div className="mt-3 space-y-3">
                  {notifications.map((item, index) => (
                    <div key={index} className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{item.type}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden flex-col items-end rounded-3xl bg-emerald-50 px-4 py-3 text-right text-slate-900 sm:flex">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Season</p>
            <p className="text-sm font-semibold">{currentSeason}</p>
          </div>

          <div className="flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">{profile?.fullName?.charAt(0)?.toUpperCase() || "A"}</div>
            <div className="hidden flex-col text-sm md:flex">
              <span className="font-semibold text-slate-900">{profile?.fullName || "Farmer"}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{isLeader ? "Leader" : "Farmer"}</span>
            </div>
            <ChevronDown className="hidden text-slate-500 md:inline" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default GroupNavbar;
