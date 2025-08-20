// MUI components
import { 
  AppBar,
  Toolbar,
  Stack,
  Select,
  MenuItem,
  Button,
  Typography,
 } from "@mui/material";

import config from "@config";
import { NavLink } from "react-router-dom";

// Toolbar styles
import styles from '@/components/topbar/styles'
import { useTheme } from '@mui/material/styles';

// Icons
import { NavArrowDown, SunLight as LightModeIcon, HalfMoon as DarkModeIcon } from 'iconoir-react'

// Utilites
import { capitalize } from 'lodash'

const TopBar = ({ mode, setMode }) => {

  // Get styles for the component
  const theme = useTheme();
  const topbarStyles = styles(theme)

  // Get logo svg
  const appLogo = config.logo;

  // Use Nav Arrow Down instead the default one
  const CustomArrowIcon = (props) => (
    <NavArrowDown
      {...props}
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    />
  )

  return (
    <AppBar position="sticky" sx={{ zIndex: "2" }} enableColorOnDark>
        <Toolbar disableGutters className={topbarStyles.toolbarContainer}>

          <NavLink style={{ textDecoration: "none", color: "inherit", lineHeight: 0 }} to="/">
            <img style={{ height: "40px" }} src={appLogo} alt="" />
          </NavLink>

          <Stack direction="row" alignItems="center" sx={{ gap: '20px'}}>

            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              
              IconComponent={CustomArrowIcon}
              className={topbarStyles.selectMode}
            >
              {['light', 'dark'].map((themeMode) => (
                <MenuItem key={themeMode} value={themeMode}>
                  <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                    {themeMode === 'light' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    <span>{capitalize(themeMode)}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>

            <Button
              variant='outlined'
              className={topbarStyles.docButton}
              component="a"
              href="https://docs.opennebula.io/stable"
              target="_blank"              
            >
              <Typography>Take me to OpenNebula documentation</Typography>
            </Button>

          </Stack>   

        </Toolbar>
    </AppBar>
  );
}
export default TopBar;
