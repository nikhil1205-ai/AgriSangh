import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../services/dashboardService";
import { useAuth } from "../hooks/useAuth";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { setProfile } = useAuth();
  const [form, setForm] = useState({
    groupName: "",
    state: "",
    district: "",
    village: "",
    cropFocus: "",
    cropSeason: "",
    totalExpectedLand: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const group = await createGroup(form);
    setProfile((prev) => ({ ...prev, role: "leader", groupId: group.id }));
    navigate(`/leader/group/${group.id}`);
  };

  return (
    <div className="max-w-3xl bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Create Collective Group</h1>
      <p className="text-sm text-gray-600 mt-1">After creation, your role auto-upgrades from farmer to leader.</p>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 mt-5">
        <input className="border rounded-lg px-3 py-2" placeholder="Group Name" value={form.groupName} onChange={(e) => setForm((p) => ({ ...p, groupName: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="State" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="District" value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Village" value={form.village} onChange={(e) => setForm((p) => ({ ...p, village: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Crop Focus" value={form.cropFocus} onChange={(e) => setForm((p) => ({ ...p, cropFocus: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Crop Season" value={form.cropSeason} onChange={(e) => setForm((p) => ({ ...p, cropSeason: e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Total Expected Land" value={form.totalExpectedLand} onChange={(e) => setForm((p) => ({ ...p, totalExpectedLand: e.target.value }))} />
        <textarea className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Description/About Group" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <button className="md:col-span-2 bg-green-800 text-white rounded-lg py-2 font-semibold">Create Group Room</button>
      </form>
    </div>
  );
};

export default CreateGroup;
