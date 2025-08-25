// MUI imports
import {
  Box,
  CircularProgress,
  Typography,
  Drawer,
  Stack,
  IconButton,
} from "@mui/material"

// Marketplace components
import Toolbar from "@/components/toolbar"
import Table from "@/components/table"
import FilterPanel from "@/components/filter/panel"
import FilterTags from "@/components/filter/tags"

// Component styles
import { useTheme } from "@mui/material/styles"
import styles from "@/layout/dashboard/styles"

// Context imports
import { useAppliances } from "@/context/appliances/AppliancesContext"
import { useDrawer } from "@/context/drawer/DrawerContext"

// Icons
import { Xmark as CloseIcon } from "iconoir-react"

const Dashboard = () => {
  // Get styles for the component
  const theme = useTheme()
  const marketplaceStyles = styles(theme)

  // Get hooks from contexts
  const { drawerOpen, closeDrawer } = useDrawer()

  // Get appliances
  const { appliances } = useAppliances()

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Render the main layout component */}
      <Stack direction="column" className={marketplaceStyles.container}>
        <Box className={marketplaceStyles.title}>
          <Typography variant="h3">Appliances</Typography>
        </Box>

        <Stack direction="column" className={marketplaceStyles.toolbar}>
          <Toolbar />
          <FilterTags />
        </Stack>

        <Box>
          {appliances === null ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table appliances={appliances} />
          )}
        </Box>
      </Stack>

      {/* Drawer Component */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box
          sx={{
            width: 350,
            p: 2,
            position: "relative", // needed for absolute positioning of the close button
            height: "100%",
          }}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <IconButton
            onClick={closeDrawer}
            className={marketplaceStyles.closePanel}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Your filter content */}
          <FilterPanel />
        </Box>
      </Drawer>
    </Box>
  )
}

export default Dashboard
