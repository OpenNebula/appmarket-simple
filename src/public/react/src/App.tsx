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
            text: {
              h1: '#40435C'
            }
          }
        : {
            // 👇 palette values for dark mode
            primary: {
              main: "#093544",
            },
            text: {
              headings: '#F5F7F9'
            }
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
  
  // Get colors depending of the mode
  const baseTokens = getDesignTokens(mode);
  
  return {
    typography: {
      fontFamily: ['Inter'],      
      h1: {
        fontSize: '40px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '48px', 
        color: baseTokens.palette.text.headings,
      },
    },

    components: {
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
