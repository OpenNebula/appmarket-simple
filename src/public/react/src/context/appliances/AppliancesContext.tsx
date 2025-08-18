// React imports
import { createContext, useContext } from 'react';

// Create the context
export const AppliancesContext = createContext();

// Use context
export const useAppliances = () => useContext(AppliancesContext);
