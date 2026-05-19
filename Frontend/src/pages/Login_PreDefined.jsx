import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login_PreDefined = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await login({
          email: "nikzone112@gmail.com",
          password: "nik123",
        });

        navigate("/dashboard");
      } catch (error) {
        console.error("Predefined Login Failed:", error);
      }
    };

    autoLogin();
  }, [login, navigate]);

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