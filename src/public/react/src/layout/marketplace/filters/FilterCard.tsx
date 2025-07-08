import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import BasicAccordion from "@/components/accordion/BasicAccordion";
import FilterCheckbox from "@/layout/marketplace/filters/checkboxes/FilterCheckboxes";
import { useAppContext } from "@/context/Context";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { CheckboxFilters } from "@/context/interfaces";

const FilterCard = () => {
  const { contextFilters, setDateInterval } = useAppContext();

  return (
    <Card sx={{ height: "calc(100vh - 64px)", overflowY: "auto" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterAltIcon sx={{ mr: 2 }} />

          <Typography variant="h6">Filters</Typography>
        </Box>

        {Object.entries(contextFilters).map(([key, values]) =>
          key !== "Date Interval" ? (
            <BasicAccordion
              defaultExpanded={
                key === "Hypervisors" || key === "OpenNebula Versions"
              }
              key={key}
              name={key}
            >
              {values.map(
                (
                  value: { name: string; totalCount: number; value: boolean },
                  index: string,
                ) => {
                  return (
                    <FilterCheckbox
                      key={`${key}-${value}-${index}`}
                      group={key as keyof CheckboxFilters}
                      totalCount={value.totalCount}
                      value={value.name}
                    />
                  );
                },
              )}
            </BasicAccordion>
          ) : (
            <BasicAccordion defaultExpanded={false} name={"Date Interval"}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateRangePicker"]}>
                  <DateRangePicker
                    value={contextFilters["Date Interval"]}
                    onChange={setDateInterval}
                    localeText={{ start: "Init date", end: "End date" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </BasicAccordion>
          ),
        )}
      </CardContent>
    </Card>
  );
};

export default FilterCard;
