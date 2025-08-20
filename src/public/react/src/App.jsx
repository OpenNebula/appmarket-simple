// React
import { Outlet } from "react-router";
import { useState, useMemo } from "react";

// Material
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Marketplace components
import TopBar from "@/components/topbar";

// Styles
import "./App.css";
import { theme } from '@/theme'

/**
 * Return the App component.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {

  // Define state for mode
  const [mode, setMode] = useState("light");

  // Create them using mode
  const marketplaceTheme = useMemo(() => createTheme(theme(mode)), [mode]);

  // Return App component
  return (

    <ThemeProvider theme={marketplaceTheme}>

      {/* Css Baseline component to unify browser styles */}
      <CssBaseline />

      {/* App top bar */}
      <TopBar mode={mode} setMode={setMode} />

      {/* React router */}
      <Outlet></Outlet>

    </ThemeProvider>
  );
}

export default App;
