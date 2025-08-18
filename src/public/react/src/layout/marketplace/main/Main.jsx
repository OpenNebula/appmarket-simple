// MUI imports
import {
  Box,
  CircularProgress,
  Typography,
  Drawer,
  Stack,
} from "@mui/material";


// Marketplace components
import Toolbar from "@/components/toolbar";
import Table from "@/components/table";
import FilterCard from "@/layout/marketplace/filters/FilterCard";

// Component styles
import { useTheme } from '@mui/material/styles';
import styles from '@/layout/marketplace/main/styles'

// Context imports
import { useAppliances } from '@/context/appliances/AppliancesContext'
import { useDrawer } from '@/context/drawer/DrawerContext'

const Main = () => {
  // const { appliances, contextFilters } = useAppContext();

  // Get styles for the component
  const theme = useTheme();
  const marketplaceStyles = styles(theme)

  // Get hooks from contexts
  const { drawerOpen, closeDrawer } = useDrawer();

  // Get appliances
  const { appliances } = useAppliances();

  // const handleCategoryChange = (
  //   event
  // ) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setActiveCategory(typeof value === "string" ? value.split(",") : value);
  // };

  // const handleOrder = (event: SelectChangeEvent<typeof activeOrder>) => {
  //   const {
  //     target: { value },
  //   } = event;

  //   setOrder(typeof value === "string" ? value.split(",") : value);
  // };

  // const handleToggleView = (
  //   _: React.MouseEvent<HTMLElement>,
  //   nextView: string,
  // ) => {
  //   setView(nextView);
  // };

  const orderValues = ["Name", "Hypervisor", "OS Systems"];

  // const appliancesFiltered: Appliance[] | undefined = appliances
  //   ?.filter((appliance) => {
  //     // Filter: Tags
  //     const activeTags =
  //       contextFilters.Tags?.filter((tag) => tag.value).map(
  //         (tag) => tag.name,
  //       ) ?? [];
  //     const tagCondition =
  //       activeTags.length === 0 ||
  //       (Array.isArray(appliance.tags)
  //         ? appliance.tags.some((tag) => activeTags.includes(tag))
  //         : typeof appliance.tags === "string" &&
  //           activeTags.includes(appliance.tags));

  //     // Filter: Hypervisors
  //     const activeHypervisors =
  //       contextFilters.Hypervisors?.filter((tag) => tag.value).map(
  //         (tag) => tag.name,
  //       ) ?? [];
  //     const hypervisorCondition =
  //       activeHypervisors.length === 0 ||
  //       (appliance.hypervisor &&
  //         activeHypervisors.includes(appliance.hypervisor));

  //     // Filter: OS Systems
  //     const activeOsSystems =
  //       contextFilters["OS Systems"]
  //         ?.filter((tag) => tag.value)
  //         .map((tag) => tag.name) ?? [];
  //     const osCondition =
  //       activeOsSystems.length === 0 ||
  //       (appliance["os-id"] && activeOsSystems.includes(appliance["os-id"]));

  //     // Filter: OpenNebula Versions
  //     const activeOpenNebulaVersions =
  //       contextFilters["OpenNebula Versions"]
  //         ?.filter((tag) => tag.value)
  //         .map((tag) => tag.name) ?? [];
  //     let opennebulaCondition = true;
  //     if (activeOpenNebulaVersions.length > 0) {
  //       if (appliance.opennebula_version) {
  //         const versions: string[] = appliance.opennebula_version
  //           .split(",")
  //           .map((version) => version.trim());
  //         opennebulaCondition = activeOpenNebulaVersions.some((version) =>
  //           versions.includes(version),
  //         );
  //       } else {
  //         opennebulaCondition = false;
  //       }
  //     }

  //     // Filter: Versions
  //     const activeVersions =
  //       contextFilters.Versions?.filter((tag) => tag.value).map(
  //         (tag) => tag.name,
  //       ) ?? [];
  //     const versionCondition =
  //       activeVersions.length === 0 ||
  //       (appliance.version && activeVersions.includes(appliance.version));

  //     // Filter: Date Interval
  //     const date: DateRange<Dayjs> | undefined = contextFilters["Date Interval"];
      
  //     let dateCondition = true;

  //     if (date) {

  //       const applianceDate = dayjs.unix(appliance.creation_time)

  //       if (date[0]) {
  //         dateCondition = dateCondition && (applianceDate.isAfter(date[0], 'day') || applianceDate.isSame(date[0], 'day')) ;
  //       }
  //       if (date[1]) {
  //         dateCondition = dateCondition && (applianceDate.isBefore(date[1], 'day') || applianceDate.isSame(date[0], 'day') );
  //       }
  //     }


  //     // Filter: Search
  //     const searchCondition =
  //       search === "" ||
  //       (appliance.name &&
  //         appliance.name
  //           .toLocaleLowerCase()
  //           .includes(search.toLocaleLowerCase()));

  //     return (
  //       tagCondition &&
  //       hypervisorCondition &&
  //       osCondition &&
  //       opennebulaCondition &&
  //       versionCondition &&
  //       dateCondition &&
  //       searchCondition
  //     );
  //   })
  //   .sort((a: Appliance, b: Appliance) => {
  //     const category = activeCategory[0] as keyof Appliance;
  //     const order = activeOrder[0];

  //     return order === "Asc"
  //       ? a[category]?.localeCompare(b[category])
  //       : b[category]?.localeCompare(a[category]);
  //   });


  return (
    <Box sx={{ flexGrow: 1 }}>

      {/* Filter */}
      {/* <Grid size={3}>
        <FilterCard />
      </Grid> */}

      {/* <Grid size={12}>
        <Box
          sx={{
            p: 3,
            maxHeight: "calc(100vh - 64px)",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Grid sx={{ my: 3 }} container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Search
                handler={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Sort
                orderValues={orderValues}
                activeCategory={activeCategory}
                handleCategory={handleCategoryChange}
                activeOrder={activeOrder}
                handleOrder={handleOrder}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDrawerOpen(true)}
              >
                Test
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <Typography variant="body1" gutterBottom>
              Showing {appliancesFiltered?.length} results
            </Typography>

            <ToggleButtonGroup
              sx={{ ml: "auto" }}
              value={view}
              exclusive
              onChange={handleToggleView}
            >
              <ToggleButton size="small" value="list" aria-label="list">
                <WindowIcon />
              </ToggleButton>
              <ToggleButton size="small" value="table" aria-label="module">
                <TableRowsIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {view === "list" ? (
            <AppliancesList appliancesFiltered={appliancesFiltered} />
          ) : (
            <AppliancesTable appliancesFiltered={appliancesFiltered} />
          )}
        </Box>
      </Grid> */}

      {/* Render the main layout component */}      
      <Stack direction="column" className={marketplaceStyles.container}>
        
        <Box className={marketplaceStyles.title}>
          <Typography variant='h3'>Appliances</Typography>        
        </Box>

        <Box className={marketplaceStyles.toolbar}>
          <Toolbar></Toolbar>
        </Box>

        <Box>
          
          {
            appliances === null ? (
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
            ) 
          }

        </Box>      
      
      </Stack>

      {/* Drawer Component */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <Box
          sx={{ width: 350, p: 2 }}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <FilterCard />
        </Box>
      </Drawer>


    
    </Box>
  );
};

export default Main;
