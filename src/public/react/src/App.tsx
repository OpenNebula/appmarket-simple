import AppBar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import Background from "./layout/background/Background";
import { Outlet } from "react-router";
import React from "react";
import { CssBaseline } from "@mui/material";
import "./App.css";

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

function App() {


  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = React.useMemo(() => createTheme(opennebulaTheme(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Background />

      <AppBar toggle={toggleColorMode} mode={mode} />

      <Outlet></Outlet>
    </ThemeProvider>
  );
}

export default App;
