import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LaunchIcon from "@mui/icons-material/Launch";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Typography } from "@mui/material";

// @ts-ignore
import config from "@config";

interface NavBarProps {
  toggle: Function;
  mode: "light" | "dark";
}

function ResponsiveAppBar({ toggle, mode }: NavBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const title = config.title;
  const subtitle = config.subtitle;
  const appLogo = config.logo;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="relative" sx={{ zIndex: "2" }} enableColorOnDark>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <img style={{ height: "43px" }} src={appLogo} alt="" />

          <Box sx={{ ml: 1 }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ fontFamily: "Poppins", fontWeight: "200" }}>
              {subtitle}
            </Typography>
          </Box>

          <IconButton
            style={{ marginLeft: "auto" }}
            onClick={() => toggle()}
            color="inherit"
          >
            {mode === "dark" ? <Brightness7Icon /> : <BedtimeIcon />}
          </IconButton>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleClose}
                component="a"
                target="_blank"
                href="https://docs.opennebula.io/6.10/"
                color="inherit"
              >
                OpenNebula Documentation
                <LaunchIcon sx={{ ml: 2 }} />
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
