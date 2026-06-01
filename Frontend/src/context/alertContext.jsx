import { createContext } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children, value }) => {
  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
