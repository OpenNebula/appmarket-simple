// Material
import {
  Grid,
} from "@mui/material";


import Search from "@/components/search";
import Sort from "@/components/sort";
import Filter from "@/components/filter"

/**
 * Component to display the toolbar in the main layout. The toolbar will contain search, sort and filter buttons.
 * @returns {JSX.Element} The rendered Toolbar component.
 */
const Toolbar = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={5}>
        <Search
          handler={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
          ) => setSearch(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Sort/>
      </Grid>
      <Grid item xs={12} md={1} container justifyContent="flex-end">
        <Filter />
      </Grid>
    </Grid>
  )
}

export default Toolbar;