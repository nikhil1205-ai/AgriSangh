import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, 
  Sprout, 
  UserCircle2, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Database, 
  Bell, 
  Search,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { profile, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onLogout = async () => {
    await signout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Groups", path: "/collective", icon: Users },
    { name: "Market News", path: "/market", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 font-sans selection:bg-green-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]" />
      </div>

      {/* Futuristic Navigation Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "py-3 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm" 
            : "py-5 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="#" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/20"
              >
                <Sprout size={20} />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 tracking-tight leading-none uppercase text-sm">AgriSangh</span>
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Infrastructure</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === item.path 
                      ? "bg-green-800 text-white shadow-md shadow-green-900/10" 
                      : "text-slate-600 hover:bg-white/50 hover:text-green-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-white rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-1">
              <Link to="/profile" className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-slate-900 leading-none">{profile?.fullName || "User"}</span>
                <span className="text-[10px] text-slate-500 uppercase font-medium tracking-tighter">Verified Farmer</span>
              </Link>
              <Link to="/profile" className="p-0.5 border-2 border-green-800/20 rounded-full hover:border-green-800 transition-colors">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden">
                  <UserCircle2 size={24} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Glassmorphism Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-[32px] p-6 shadow-2xl shadow-green-900/5 min-h-[calc(100vh-180px)]"
        >
          {/* Dashboard Context Header - Hidden on subpages if desired */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Collective Workspace
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Operational infrastructure for your farming unit.
              </p>
            </div>
          </div>

          <Outlet />
        </motion.div>
      </main>

      {/* Footer / Mobile Nav Bar */}
      <footer className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl border border-white/10 p-2 flex items-center justify-around shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`p-3 rounded-xl transition-all ${
                location.pathname === item.path ? "text-white bg-green-800" : "text-slate-400"
              }`}
            >
              <item.icon size={20} />
            </Link>
          ))}
        </div>
      </footer>
    </div>
    
  );
};

export default DashboardLayout;