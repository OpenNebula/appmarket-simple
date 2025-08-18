// React imports
import { useState } from "react";


// Import context
import { DrawerContext } from '@/context/drawer/DrawerContext';

/**
 * 
 * Provides a context to open and close the drawer from any component.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The part of the React component tree that should have access to the drawer context.
 * @returns {JSX.Element} The provider component that wraps its children with drawer context.
 */
export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <DrawerContext.Provider value={{ drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};