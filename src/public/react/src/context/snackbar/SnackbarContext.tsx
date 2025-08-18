// React imports
import { createContext, useContext } from 'react';

// Create the context
export const SnackbarContext = createContext();

/**
 * Custom hook for accessing the global snackbar context.
 *
 * This hook allows any component inside a `SnackbarProvider` to display
 * snackbar notifications without directly managing their state or UI.
 *
 * @example
 * const { showSnackbar } = useSnackbar();
 * showSnackbar("Item saved successfully!");
 *
 * @throws {Error} If used outside of a `SnackbarProvider`, this hook will throw
 * to prevent undefined behavior.
 *
 * @returns {SnackbarContextType} The snackbar context value, which typically
 * includes methods such as `showSnackbar(message: string, options?: SnackbarOptions)`.
 */
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
