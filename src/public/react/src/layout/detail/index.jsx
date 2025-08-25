// React imports
import { useParams } from "react-router-dom"

// Import MUI
import { Stack, CircularProgress } from "@mui/material"

// Import context provider
import { useAppliances } from "@/context/appliances/AppliancesContext"

// Marketplace components
import ApplianceDetails from "@/components/detail"

// Utilities
import { find } from "lodash"

const Detail = () => {
  // Get params from request
  const params = useParams()

  // Get appliance id
  const applianceId = params?.id

  // Get appliances
  const { allAppliances } = useAppliances()

  // Get appliance with id
  const appliance = find(allAppliances, ["_id.$oid", applianceId])

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ padding: "20px", flexGrow: 1, width: '100%' }}
    >
      {appliance ? (
        <ApplianceDetails appliance={appliance} />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  )
}

export default Detail
