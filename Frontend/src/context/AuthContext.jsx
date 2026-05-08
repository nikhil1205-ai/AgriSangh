import { createContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { loginWithEmail, loginWithGoogle, logout, registerWithEmail, saveProfile } from "../services/authService";

const AuthContext = createContext(null);
const FALLBACK_TOKEN = "firebase-session";

const buildFallbackProfile = (user, extra = {}) => ({
  uid: user.uid,
  email: user.email,
  fullName: user.displayName || "Agri Farmer",
  role: "farmer",
  ...extra,
});

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (form) => {
    const user = await registerWithEmail({ email: form.email, password: form.password });
    try {
      const result = await saveProfile({
        ...form,
        uid: user.uid,
        email: user.email,
        role: "farmer",
      });
      localStorage.setItem("agrisangh_token", result.token);
      setProfile(result.user);
      return result.user;
    } catch {
      const fallback = buildFallbackProfile(user, form);
      localStorage.setItem("agrisangh_token", FALLBACK_TOKEN);
      setProfile(fallback);
      return fallback;
    }
  };

  const login = async ({ email, password }) => {
    const user = await loginWithEmail({ email, password });
    try {
      const result = await saveProfile({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "Agri Farmer",
        role: "farmer",
      });
      localStorage.setItem("agrisangh_token", result.token);
      setProfile(result.user);
      return result.user;
    } catch {
      const fallback = buildFallbackProfile(user);
      localStorage.setItem("agrisangh_token", FALLBACK_TOKEN);
      setProfile(fallback);
      return fallback;
    }
  };

  const loginGoogle = async () => {
    const user = await loginWithGoogle();
    try {
      const result = await saveProfile({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "Agri Farmer",
        role: "farmer",
      });
      localStorage.setItem("agrisangh_token", result.token);
      setProfile(result.user);
      return result.user;
    } catch {
      const fallback = buildFallbackProfile(user);
      localStorage.setItem("agrisangh_token", FALLBACK_TOKEN);
      setProfile(fallback);
      return fallback;
    }
  };

  const becomeLeader = () => setProfile((prev) => ({ ...prev, role: "leader" }));

  const signout = async () => {
    await logout();
    localStorage.removeItem("agrisangh_token");
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      register,
      login,
      loginGoogle,
      signout,
      becomeLeader,
      setProfile,
    }),
    [firebaseUser, loading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { AuthContext };
