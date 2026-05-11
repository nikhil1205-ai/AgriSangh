import { createContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { loginWithEmail, loginWithGoogle, logout, registerWithEmail, saveProfile } from "../services/authService";
import { getFarmerDashboard } from "../services/dashboardService";

const AuthContext = createContext(null);

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
      if (user) {
        try {
          const dashboard = await getFarmerDashboard();
          setProfile(dashboard.profile);
        } catch (err) {
          console.warn("Unable to restore user profile", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (form) => {
    const user = await registerWithEmail({ email: form.email, password: form.password });
    // Ensure backend receives a fresh Firebase token immediately after signup
    await user.getIdToken(true);

    const saved = await saveProfile({
      ...form,
      uid: user.uid,
      email: user.email,
      role: "farmer",
    });

    setProfile(saved);
    return saved;
  };

  const login = async ({ email, password }) => {
    const user = await loginWithEmail({ email, password });
    await user.getIdToken(true);

    const loginPayload = {
      uid: user.uid,
      email: user.email,
    };
    if (user.displayName) loginPayload.fullName = user.displayName;

    const saved = await saveProfile(loginPayload);

    setProfile(saved);
    return saved;
  };

  const loginGoogle = async () => {
    const user = await loginWithGoogle();
    await user.getIdToken(true);

    const googlePayload = {
      uid: user.uid,
      email: user.email,
    };
    if (user.displayName) googlePayload.fullName = user.displayName;

    const saved = await saveProfile(googlePayload);

    setProfile(saved);
    return saved;
  };

  const becomeLeader = () => setProfile((prev) => ({ ...prev, role: "leader" }));

  const signout = async () => {
    await logout();
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
