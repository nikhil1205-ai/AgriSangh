import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import api from "./api";
import { auth, googleProvider } from "../config/firebase";

export const registerWithEmail = async ({ email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithEmail = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

// Sync (create/update) farmer profile in MongoDB via backend.
export const saveProfile = async (payload) => {
  const response = await api.post("/farmers/create", payload);
  return response.data.data;
};

export const logout = () => signOut(auth);
