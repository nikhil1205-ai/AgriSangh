import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const getFirebaseErrorMessage = (error) => {
  const code = error?.code || "";
  if (error?.message === "Network Error") {
    return "Backend API not reachable. Start backend server on port 5000.";
  }
  if (code.includes("auth/invalid-credential")) return "Invalid email or password.";
  if (code.includes("auth/user-not-found")) return "No account found for this email.";
  if (code.includes("auth/wrong-password")) return "Invalid email or password.";
  if (code.includes("auth/invalid-email")) return "Invalid email format.";
  if (code.includes("auth/network-request-failed")) return "Network issue. Check internet and try again.";
  return error?.message || "Unable to login.";
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    }
  };

  const onGoogle = async () => {
    setError("");
    try {
      await loginGoogle();
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
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-500">Login to your AgriSangh account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1"> Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-green-900 shadow-lg shadow-green-100 transition-all">
              Login Account
            </button>
            <button
              type="button"
              onClick={onGoogle}
              className="w-full border border-gray-300 py-3 rounded-2xl font-semibold text-sm text-gray-700 hover:bg-gray-50"
            >
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-500 pt-4">
              New to AgriSangh? <Link to="/register" className="text-green-800 font-bold hover:underline">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;