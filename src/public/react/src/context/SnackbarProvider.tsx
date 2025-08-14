// React imports
import React, { createContext, useState, useCallback, useContext } from "react";

// MUI components
import { Snackbar, IconButton } from "@mui/material";

// Icons
import { Xmark } from "iconoir-react";

// Type for the Snackbar context
type SnackbarContextType = {
  showMessage: (message: string) => void;
};

// Create the context
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

/**
 * Provides a global snackbar notification system for the application.
 *
 * Wrap your app with this provider to enable showing snackbars from anywhere
 * using the `useSnackbar` hook.
 *
 * This context is responsible for:
 * - Rendering a `Snackbar` component in a fixed location (usually bottom or top of the viewport).
 * - Managing snackbar state (open/close, message, position, duration).
 * - Exposing a function to trigger snackbars from any child component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The part of the React component tree that should have access to the snackbar context.
 * @returns {JSX.Element} The provider component that wraps its children with snackbar capabilities.
 */
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // State for open the snackbar
  const [open, setOpen] = useState(false);

  // Message to show
  const [message, setMessage] = useState("");

  // Action to show a message
  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  // Action to close snackbar
  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        message={message}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <Xmark />
          </IconButton>
        }
      />
    </SnackbarContext.Provider>
  );
};

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
