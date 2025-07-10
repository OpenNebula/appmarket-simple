import Grid from "@mui/material/Grid2";

import FilterCard from "@/layout/marketplace/filters/FilterCard";
import { useAppContext } from "@/context/useAppContext";
import {
  Box,
  CircularProgress,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Appliance } from "@/interfaces/Appliances";
import Search from "@/components/search/Search";
import AppliancesTable from "@/layout/marketplace/appliance-table/AppliancesTable";
import WindowIcon from "@mui/icons-material/Window";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AppliancesList from "../appliances-list/AppliancesList";
import Sort from "@/components/sort/Sort";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";

const Main = () => {
  const { appliances, contextFilters } = useAppContext();

  const [search, setSearch] = useState<string>("");
  const [view, setView] = useState("list");

  const [activeCategory, setActiveCategory] = useState<string[]>(["name"]);
  const [activeOrder, setOrder] = useState<string[]>(["Asc"]);

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof activeCategory>,
  ) => {
    const {
      target: { value },
    } = event;
    setActiveCategory(typeof value === "string" ? value.split(",") : value);
  };

  const handleOrder = (event: SelectChangeEvent<typeof activeOrder>) => {
    const {
      target: { value },
    } = event;

    setOrder(typeof value === "string" ? value.split(",") : value);
  };

  const handleToggleView = (
    _: React.MouseEvent<HTMLElement>,
    nextView: string,
  ) => {
    setView(nextView);
  };

  const orderValues = ["Name", "Hypervisor", "OS Systems"];

  const appliancesFiltered: Appliance[] | undefined = appliances
    ?.filter((appliance) => {
      // Filter: Tags
      const activeTags =
        contextFilters.Tags?.filter((tag) => tag.value).map(
          (tag) => tag.name,
        ) ?? [];
      const tagCondition =
        activeTags.length === 0 ||
        (Array.isArray(appliance.tags)
          ? appliance.tags.some((tag) => activeTags.includes(tag))
          : typeof appliance.tags === "string" &&
            activeTags.includes(appliance.tags));

      // Filter: Hypervisors
      const activeHypervisors =
        contextFilters.Hypervisors?.filter((tag) => tag.value).map(
          (tag) => tag.name,
        ) ?? [];
      const hypervisorCondition =
        activeHypervisors.length === 0 ||
        (appliance.hypervisor &&
          activeHypervisors.includes(appliance.hypervisor));

      // Filter: OS Systems
      const activeOsSystems =
        contextFilters["OS Systems"]
          ?.filter((tag) => tag.value)
          .map((tag) => tag.name) ?? [];
      const osCondition =
        activeOsSystems.length === 0 ||
        (appliance["os-id"] && activeOsSystems.includes(appliance["os-id"]));

      // Filter: OpenNebula Versions
      const activeOpenNebulaVersions =
        contextFilters["OpenNebula Versions"]
          ?.filter((tag) => tag.value)
          .map((tag) => tag.name) ?? [];
      let opennebulaCondition = true;
      if (activeOpenNebulaVersions.length > 0) {
        if (appliance.opennebula_version) {
          const versions: string[] = appliance.opennebula_version
            .split(",")
            .map((version) => version.trim());
          opennebulaCondition = activeOpenNebulaVersions.some((version) =>
            versions.includes(version),
          );
        } else {
          opennebulaCondition = false;
        }
      }

      // Filter: Versions
      const activeVersions =
        contextFilters.Versions?.filter((tag) => tag.value).map(
          (tag) => tag.name,
        ) ?? [];
      const versionCondition =
        activeVersions.length === 0 ||
        (appliance.version && activeVersions.includes(appliance.version));

      // Filter: Date Interval
      const date: DateRange<Dayjs> | undefined = contextFilters["Date Interval"];
      
      let dateCondition = true;

      if (date) {

        const applianceDate = dayjs.unix(appliance.creation_time)

        if (date[0]) {
          dateCondition = dateCondition && (applianceDate.isAfter(date[0], 'day') || applianceDate.isSame(date[0], 'day')) ;
        }
        if (date[1]) {
          dateCondition = dateCondition && (applianceDate.isBefore(date[1], 'day') || applianceDate.isSame(date[0], 'day') );
        }
      }


      // Filter: Search
      const searchCondition =
        search === "" ||
        (appliance.name &&
          appliance.name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()));

      return (
        tagCondition &&
        hypervisorCondition &&
        osCondition &&
        opennebulaCondition &&
        versionCondition &&
        dateCondition &&
        searchCondition
      );
    })
    .sort((a: Appliance, b: Appliance) => {
      const category = activeCategory[0] as keyof Appliance;
      const order = activeOrder[0];

      return order === "Asc"
        ? a[category]?.localeCompare(b[category])
        : b[category]?.localeCompare(a[category]);
    });

  return appliances ? (
    <Grid container spacing={0.5}>
      {/* Filter */}
      <Grid size={3}>
        <FilterCard />
      </Grid>

      <Grid size={9}>
        <Box
          sx={{
            p: 3,
            maxHeight: "calc(100vh - 64px)",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Grid sx={{ my: 3 }} container spacing={2}>
            <Grid size={{ xs: 12, md: 9 }}>
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
      </Grid>
    </Grid>
  ) : (
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
  );
};

export default Main;
