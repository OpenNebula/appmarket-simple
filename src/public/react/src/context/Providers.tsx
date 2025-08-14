// Import Marketplace context providers
import { CheckboxProvider } from "@/context/Context";
import { SnackbarProvider } from "@/context/SnackbarProvider";

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
export const Providers = ({ children }) => (
  <CheckboxProvider>
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  </CheckboxProvider>
);
