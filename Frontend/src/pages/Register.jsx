import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Eye, EyeOff, Layers, Lock, Mail, MapPin, Phone, Sprout, User, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const getFirebaseErrorMessage = (error) => {
  // Backend/Axios errors
  const backendMessage =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message;
  if (backendMessage) {
    const status = error?.response?.status;
    return status ? `Backend error (${status}): ${backendMessage}` : `Backend error: ${backendMessage}`;
  }

  const code = error?.code || "";
  if (error?.message === "Network Error") {
    return "Backend API not reachable. Start backend server on port 5000.";
  }
  if (code.includes("auth/email-already-in-use")) return "This email is already registered.";
  if (code.includes("auth/invalid-email")) return "Invalid email format.";
  if (code.includes("auth/weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("auth/operation-not-allowed")) {
    return "Email/Password sign-up is disabled in Firebase console.";
  }
  if (code.includes("auth/network-request-failed")) return "Network issue. Check internet and try again.";
  return error?.message || "Registration failed. Check firebase config and try again.";
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  state: '',
  district: '',
  village: '',
  landSize: '',
  cropInterest: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 bg-green-800 rounded-xl items-center justify-center shadow-lg shadow-green-100 mb-6">
          <Users className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join the Collective</h2>
        <p className="mt-2 text-sm text-gray-500">Register as a farmer and join collective farming groups</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <div className="bg-green-50 text-green-900 border border-green-100 rounded-xl p-3 text-sm mb-6">
            New users are registered as farmers. A farmer becomes leader after creating a group.
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="fullName" placeholder="Full Name" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800" onChange={handleInputChange} />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="phone" placeholder="Phone Number" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800" onChange={handleInputChange} />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                />
                </div>
            </div>

            <div className="space-y-4 border-l-2 border-green-800/20 pl-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="state" placeholder="State" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="district" placeholder="District" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
              </div>
              <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="village" placeholder="Village Name" className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative"><Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="landSize" placeholder="Land Size (acres)" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                <div className="relative"><Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="cropInterest" placeholder="Crop Interest" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
              </div>
            </div>

            <div className="space-y-4">

                {/* Password */}
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Set Password"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                    />

                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-green-900 shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all">
              Complete Registration <ChevronRight size={18} />
            </button>

            <p className="text-center text-sm text-gray-500 pt-4">
              Already have an account? <Link to="/login" className="text-green-800 font-bold hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;