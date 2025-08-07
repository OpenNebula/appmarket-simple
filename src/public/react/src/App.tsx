// React
import { Outlet } from "react-router";
import React from "react";

// Material
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Marketplace components
import AppBar from "@/components/navbar/Navbar";

// Styles
import "./App.css";

/**
 * Return the palette for dark and light modes
 * @param {string} mode - Dark or light
 * @returns {object} - Palette
 */
const getDesignTokens = (mode: "light" | "dark") => {
  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // 👇 palette values for light mode
            primary: {
              main: "#1897C2",
            },
          }
        : {
            // 👇 palette values for dark mode
            primary: {
              main: "#093544",
            },
          }),
    },
  };
};

/**
 * Define theme TODO -> In a different file
 * @param {string} mode - Dark or light
 * @returns {object} - Theme
 */
const opennebulaTheme = (mode: "light" | "dark") => {
  return {
    ...getDesignTokens(mode),
    typography: {
      fontFamily: ["Ubuntu", "Poppins"].join(","),
    },
    components: {
      // Name of the component
      MuiIconButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            variants: [
              {
                props: { color: "info" },
                style: {
                  ":hover": {
                    background: "#046B8E",
                  },
                  background: "#0D7FA5",
                  color: "white",
                },
              },
              {
                props: { color: "secondary" },
                style: {
                  ":hover": {
                    background: "#DFDFDF",
                  },
                  background: "white",
                  color: "#0D7FA5",
                },
              },
            ],
          },
        },
      },
    },
  };
};

/**
 * Return the App component.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {

  // Define state for mode
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  // Event to change mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Create them using mode
  const theme = React.useMemo(() => createTheme(opennebulaTheme(mode)), [mode]);

  // Return App component
  return (

    <ThemeProvider theme={theme}>

      {/* Css Baseline component to unify browser styles */}
      <CssBaseline />

      {/* App top bar */}
      <AppBar toggle={toggleColorMode} mode={mode} />

      {/* React router */}
      <Outlet></Outlet>

    </ThemeProvider>
  );
}

export default App;
