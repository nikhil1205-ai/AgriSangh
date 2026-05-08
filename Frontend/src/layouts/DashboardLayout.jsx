import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Plus, Sprout, UserCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { profile, signout } = useAuth();
  const navigate = useNavigate();
  const [openActions, setOpenActions] = useState(false);
  const actionsRef = useRef(null);

  const onLogout = async () => {
    await signout();
    navigate("/login");
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!actionsRef.current) return;
      if (!actionsRef.current.contains(e.target)) setOpenActions(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

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
            <div className="relative" ref={actionsRef}>
              <button
                type="button"
                onClick={() => setOpenActions((p) => !p)}
                className="text-sm px-3 py-2 rounded-lg bg-green-800 text-white hover:bg-green-900 flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={openActions}
              >
                <Plus size={16} /> Actions
              </button>
              {openActions && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-2"
                >
                  <Link
                    role="menuitem"
                    to="/create-group"
                    onClick={() => setOpenActions(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Create Group
                  </Link>
                  <Link
                    role="menuitem"
                    to="/join-group"
                    onClick={() => setOpenActions(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Join Group
                  </Link>
                  <Link
                    role="menuitem"
                    to="/verify-batch"
                    onClick={() => setOpenActions(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Buyer Verify Page
                  </Link>
                </div>
              )}
            </div>
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
