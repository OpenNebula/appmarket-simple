import BasicCard from "@/components/appliance/Card";
import Grid from "@mui/material/Grid2";
import { Appliance } from "@/interfaces/Appliances";

export interface ApplianceListInterface {
  appliancesFiltered: Appliance[] | undefined;
}

const AppliancesList = ({ appliancesFiltered }: ApplianceListInterface) => {
  return (
    <>
      <Grid container sx={{ my: 3 }} spacing={3}>
        {appliancesFiltered?.map((appliance: Appliance) => (
          <Grid key={appliance._id.$oid} size={{ xs: 12, md: 6, lg: 3 }}>
            <BasicCard appliance={appliance} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AppliancesList;
