// Material
import {
  Grid,
} from "@mui/material";

// Marketpace components
import Search from "@/components/search";
import Sort from "@/components/sort";
import Filter from "@/components/filter/action"

/**
 * Component to display the toolbar in the main layout. The toolbar will contain search, sort and filter buttons.
 * @returns {JSX.Element} The rendered Toolbar component.
 */
const Toolbar = () => {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 5 }} >
        <Search
          handler={(
            e,
          ) => setSearch(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Sort/>
      </Grid>
      <Grid size={{ xs: 12, md: 1 }} container justifyContent="flex-end">
        <Filter />
      </Grid>
    </Grid>
  )
}

export default Toolbar;