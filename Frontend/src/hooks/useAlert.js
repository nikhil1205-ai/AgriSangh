import { useContext } from "react";
import { AlertContext } from "../context/alertContext.jsx";

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }

  return context;
};
