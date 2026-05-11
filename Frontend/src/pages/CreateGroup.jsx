import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup, getFarmerDashboard } from "../services/dashboardService";
import { useAuth } from "../hooks/useAuth";
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Sprout, 
  Calendar, 
  Maximize, 
  FileText, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const [hasActiveGroup, setHasActiveGroup] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const dashboard = await getFarmerDashboard();
        if (active) {
          setHasActiveGroup((dashboard.groups || []).length > 0);
        }
      } catch (error) {
        console.warn("Unable to load farmer dashboard", error);
      }
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (hasActiveGroup) {
      window.alert("You already have an active group this season. Leave or archive it before creating a new one.");
      return;
    }
    const group = await createGroup(form);
    // Role automatically transitions upon successful verification; preserve existing profile fields.
    setProfile((prev) => {
      const current = prev || profile || {};
      return { ...current, role: "leader", groupId: group.id };
    });
    navigate(`/group/${group.id}`);
  };

  return (
    /* Centering Wrapper: Centers component in the middle area */
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/40"
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <PlusCircle className="text-green-800" size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Create Collective Group
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 px-4 py-2.5 rounded-xl">
            <ShieldCheck size={18} className="shrink-0" />
            <p className="text-xs font-bold uppercase tracking-widest leading-none">
              Institutional Upgrade: Farmer → Group Leader[cite: 3]
            </p>
          </div>
          {hasActiveGroup && (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
              You already have an active group in the current season. Exit or archive that group before creating another collective.
            </div>
          )}
        </div>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 relative group">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
            <input
              name="groupName"
              placeholder="Collective Group Name"
              value={form.groupName}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
            />
          </div>

          {[
            { icon: MapPin, name: "state", placeholder: "State" },
            { icon: MapPin, name: "district", placeholder: "District" },
            { icon: MapPin, name: "village", placeholder: "Village" },
            { icon: Sprout, name: "cropFocus", placeholder: "Crop Focus" },
            { icon: Calendar, name: "cropSeason", placeholder: "Crop Season" },
            { icon: Maximize, name: "totalExpectedLand", placeholder: "Total Land (Acres)" },
          ].map((field) => (
            <div key={field.name} className="relative group">
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-800" size={18} />
              <input
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm"
              />
            </div>
          ))}

          <div className="md:col-span-2 relative group">
            <FileText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-800" size={18} />
            <textarea
              name="description"
              placeholder="Describe the Collective Group's goals..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-800 outline-none transition-all text-sm resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={hasActiveGroup}
            className={`md:col-span-2 mt-4 rounded-2xl py-4.5 font-bold uppercase tracking-widest text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              hasActiveGroup
                ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-green-800 text-white hover:bg-green-900 shadow-green-100"
            }`}
          >
            {hasActiveGroup ? "Cannot create while active in another group" : "Initialize Group Room"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateGroup;