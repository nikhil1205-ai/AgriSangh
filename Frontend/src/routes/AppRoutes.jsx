import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";
import FarmerDashboard from "../pages/FarmerDashboard";
import LeaderDashboard from "../pages/LeaderDashboard";
import BuyerVerification from "../pages/BuyerVerification";
import Profile from "../pages/Profile";
import CreateGroup from "../pages/CreateGroup";
import JoinGroup from "../pages/JoinGroup";
import GroupRoom from "../pages/GroupRoom";
import LeaderRoom from "../pages/LeaderRoom";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-batch" element={<BuyerVerification />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<FarmerDashboard />} />
        <Route path="home" element={<DashboardHome />} />
        <Route path="farmer" element={<FarmerDashboard />} />
        <Route path="leader" element={<LeaderDashboard />} />
      </Route>
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/join-group" element={<JoinGroup />} />
      <Route path="/group/:id" element={<GroupRoom />} />
      <Route element={<RoleRoute role="leader" />}>
        <Route path="/leader/group/:id" element={<LeaderRoom />} />
      </Route>
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default AppRoutes;
