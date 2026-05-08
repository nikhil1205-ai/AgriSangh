import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardHome = () => {
  const { profile } = useAuth();

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.fullName || "Farmer"}</h1>
        <p className="text-gray-600 mt-2">
          Manage your collective farming operations, contributions, and verified batch identity in one place.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="px-4 py-2 bg-green-800 text-white rounded-lg" to="/dashboard/farmer">
            Farmer Dashboard
          </Link>
          <Link className="px-4 py-2 border border-gray-300 rounded-lg" to="/dashboard/leader">
            Leader Dashboard
          </Link>
          <Link className="px-4 py-2 border border-gray-300 rounded-lg" to="/verify-batch">
            Buyer Verify Page
          </Link>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-900 to-green-700 text-white rounded-2xl p-6 shadow-lg">
        <p className="text-xs uppercase tracking-widest text-green-100">Demo Flow</p>
        <ol className="mt-4 space-y-2 text-sm">
          <li>1. Farmer registers and logs in</li>
          <li>2. Leader creates group</li>
          <li>3. Farmers request to join</li>
          <li>4. Leader approves and sets crop season</li>
          <li>5. Farmers add contributions</li>
          <li>6. Leader generates verified batch ID</li>
        </ol>
      </div>
    </div>
  );
};

export default DashboardHome;
