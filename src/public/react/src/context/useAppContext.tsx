import { useContext } from "react";
import { AppContext } from "./AppContext";
import { ContextType } from "./interfaces";

export const useAppContext = (): ContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a CheckboxProvider");
  }
  return context;
};
