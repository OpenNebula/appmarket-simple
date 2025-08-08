// Material
import {
  Grid,
} from "@mui/material";

/**
 * Component to display the toolbar in the main layout. The toolbar will contain search, sort and filter buttons.
 * @returns {JSX.Element} The rendered Toolbar component.
 */
const Toolbar = () => {
  return (
    <Grid container spacing={0}>
      <Grid xs={12} md={5}>
        Filter
      </Grid>
      <Grid xs={12} md={5}>
        Sort
      </Grid>
      <Grid xs={12} md={2}>
        Filter
      </Grid>
    </Grid>
  )
}

export default Toolbar;