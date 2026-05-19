import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login_PreDefined = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const predefinedUser = {
      email: "nikzone112@gmail.com",
      password: "nik123",
    };

    // Save predefined user locally
    localStorage.setItem("user", JSON.stringify(predefinedUser));
    localStorage.setItem("isAuthenticated", "true");

    // Direct redirect to dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-semibold text-slate-800">
          Logging in...
        </h1>
      </div>
    </div>
  );
};

export default Login_PreDefined;