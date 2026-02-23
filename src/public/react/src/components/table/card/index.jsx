// MUI components
import Grid from "@mui/material/Grid"

// App components
import ApplianceCard from "@/components/card"

/**
 * Render a table with appliances in card format.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered TableCard component.
 */
const TableCard = ({ appliances }) => {
  return (
    <Grid container spacing={"24px"}>
      {appliances?.map((appliance, index) => (
        <Grid key={`card-${index}`} size={{ xs: 12, sm: 4, md: 4, xl: 3 }}>
          <ApplianceCard appliance={appliance} />
        </Grid>
      ))}
    </Grid>
  )
}

export default TableCard
