// React imports
import { createContext, useContext } from 'react';

// Create the context
export const FiltersContext = createContext();

// Use context
export const useFilters = () => useContext(FiltersContext);