// React imports
import { createContext, useContext } from 'react';

// Create the context
export const DrawerContext = createContext();

// Use context
export const useDrawer = () => useContext(DrawerContext);