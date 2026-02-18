// React imports
import { useParams, useNavigate } from "react-router-dom"

// Import MUI
import { Stack, CircularProgress, Button, Box, Typography } from "@mui/material"

// Import context provider
import { useAppliances } from "@/context/appliances/AppliancesContext"

// Marketplace components
import ApplianceDetails from "@/components/detail"

// Icons
import { ArrowLeft as BackIcon } from "iconoir-react"

// Utilities
import { find } from "lodash"

const Detail = () => {
  // Hooks from router
  const params = useParams()
  const navigate = useNavigate()

  // Get appliance id
  const applianceId = params?.id

  // Get appliances
  const { allAppliances, isLoading } = useAppliances()

  // Get appliance with id
  const appliance = find(allAppliances, ["_id.$oid", applianceId])

  return (
    <Stack
      direction="column"
      sx={{ minHeight: "100vh" }} // full screen height if you want vertical centering
    >
      {/* Top-left aligned */}
      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="filled"
          startIcon={<BackIcon />}
          sx={{ margin: "30px" }}
          onClick={() => navigate("/")}
        >
          Back to appliances
        </Button>
      </Box>

      {/* Centered horizontally */}
      <Box
        display="flex"
        justifyContent="center"
        sx={{ marginLeft: "200px", marginRight: "200px" }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : appliance ? (
          <ApplianceDetails
            sx={{ alignSelf: "center" }}
            appliance={appliance}
          />
        ) : (
          <Box textAlign="center">
            <Stack spacing={2}>
              <Typography variant="h4" component="h2">
                Appliance not found
              </Typography>
              <Typography variant="body1">
                The requested appliance with ID <b>{applianceId}</b> was not
                found.
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default Detail
