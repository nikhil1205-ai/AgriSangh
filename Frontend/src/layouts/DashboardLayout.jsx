import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Sprout, UserCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { profile, signout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-green-800 rounded-lg grid place-items-center text-white">
              <Sprout size={16} />
            </span>
            <span className="font-bold text-gray-900">AgriSangh Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/profile" className="text-sm text-gray-700 hover:text-green-800 flex items-center gap-1">
              <UserCircle2 size={16} /> {profile?.fullName || "Profile"}
            </Link>
            <button
              onClick={onLogout}
              className="text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
