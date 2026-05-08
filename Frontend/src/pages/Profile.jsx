import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-3xl bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900">Farmer Profile</h1>
      <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
        <p><span className="text-gray-500">Name:</span> {profile.fullName}</p>
        <p><span className="text-gray-500">Email:</span> {profile.email}</p>
        <p><span className="text-gray-500">Phone:</span> {profile.phone || "-"}</p>
        <p><span className="text-gray-500">State:</span> {profile.state || "-"}</p>
        <p><span className="text-gray-500">District:</span> {profile.district || "-"}</p>
        <p><span className="text-gray-500">Village:</span> {profile.village || "-"}</p>
        <p><span className="text-gray-500">Land Size:</span> {profile.landSize || 0} acres</p>
        <p><span className="text-gray-500">Crop Interest:</span> {profile.cropInterest || "-"}</p>
        <p><span className="text-gray-500">Role:</span> {profile.role}</p>
      </div>
    </div>
  );
};

export default Profile;
