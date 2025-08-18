// React imports
import { useState, useCallback } from "react";

// MUI components
import { Snackbar, IconButton } from "@mui/material";

// Import context
import { SnackbarContext } from '@/context/snackbar/SnackbarContext';

// Icons
import { Xmark } from "iconoir-react";

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
export const SnackbarProvider = ({ children }) => {

  // State for open the snackbar
  const [open, setOpen] = useState(false);

  // Message to show
  const [message, setMessage] = useState("");

  // Action to show a message
  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  // Action to close snackbar
  const handleClose = (_, reason) => {
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
