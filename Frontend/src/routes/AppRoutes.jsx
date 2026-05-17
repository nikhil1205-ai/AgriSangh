import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import FarmerDashboard from "../pages/FarmerDashboard";
import BuyPage from "../pages/BuyPage";
import Profile from "../pages/Profile";
import CreateGroup from "../pages/CreateGroup";
import JoinGroup from "../pages/JoinGroup";
import GroupRoom from "../pages/GroupRoom";
import MyGroups from "../pages/MyGroups";
import MarketNews from "../pages/MarketNews";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/buy" element={<BuyPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
        <Route path="/mygroup" element={<MyGroups />} />
        <Route path="/market" element={<MarketNews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/join-group" element={<JoinGroup />} />
      </Route>
      <Route path="/group/:id" element={<GroupRoom />} />
    </Route>
  </Routes>
);

export default AppRoutes;
