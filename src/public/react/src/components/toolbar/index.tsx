// Material
import {
  Grid,
} from "@mui/material";


import Search from "@/components/search";
import Sort from "@/components/sort";

/**
 * Component to display the toolbar in the main layout. The toolbar will contain search, sort and filter buttons.
 * @returns {JSX.Element} The rendered Toolbar component.
 */
const Toolbar = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <Search
          handler={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
          ) => setSearch(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Sort/>
      </Grid>
      <Grid item xs={12} md={1}>
        Filter
      </Grid>
    </Grid>
  )
}

export default Toolbar;