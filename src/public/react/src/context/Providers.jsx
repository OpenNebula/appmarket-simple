// Import Marketplace context providers
import { SnackbarProvider } from "@/context/snackbar/SnackbarProvider";
import { AppliancesProvider } from "@/context/appliances/AppliancesProvider";
import { DrawerProvider } from "@/context/drawer/DrawerProvider";
import { FiltersProvider } from "@/context/filters/FiltersProvider";


import { useState, useEffect } from "react";

// Function to fetch appliances from your API
const fetchAppliances = async () => {
  try {

    const res = await fetch('/appliance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    
    const data = await res.json();
    
    return data?.appliances || [];

  } catch (err) {
    console.error('Error fetching appliances:', err);
    return [];
  }
};

/**
 * Wraps the application in all necessary context providers for the Marketplace.
 * 
 * Currently includes:
 * - `CheckboxProvider`: Handles state for filters and checkbox selections.
 * - `SnackbarProvider`: Provides a global snackbar system for showing alerts and notifications.
 *
 * @param {ProvidersProps} props - The props for the component.
 * @returns {JSX.Element} The application wrapped with all providers.
 */
export const Providers = ({ children }) => {
  const [appliances, setAppliances] = useState(null);

  // Fetch appliances once on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAppliances();
      setAppliances(data);
    };
    loadData();
  }, []);  

  return (
      <DrawerProvider>
        <SnackbarProvider>
          <AppliancesProvider appliances={appliances}>
            <FiltersProvider appliances={appliances}>
              {children}
            </FiltersProvider>
          </AppliancesProvider>
        </SnackbarProvider>
      </DrawerProvider>
  );
};

