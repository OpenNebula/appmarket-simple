import { createContext } from "react";
import { ContextType } from "./interfaces";

export const AppContext = createContext<ContextType | null>(null);
