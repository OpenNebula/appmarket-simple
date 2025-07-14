import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import BasicAccordion from "@/components/accordion/BasicAccordion";
import FilterCheckbox from "@/layout/marketplace/filters/checkboxes/FilterCheckboxes";
import { useAppContext } from "@/context/useAppContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { CheckboxFilters } from "@/context/interfaces";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
            <BasicAccordion defaultExpanded={false} name={"Date Interval"} key={key}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateRangePicker"]}>

                  <DatePicker
                    label="Init date"
                    value={contextFilters["Date Interval"][0]}
                    onChange={(newStartDate) => {
                      setDateInterval([newStartDate, contextFilters["Date Interval"][1]]);
                    }}
                    slotProps={{
                      field: { clearable: true, onClear: () => setDateInterval([undefined, contextFilters["Date Interval"][1]]) },
                    }}
                    format="DD/MM/YYYY"
                  />

                  <DatePicker
                    label="End date"
                    value={contextFilters["Date Interval"][1]} 
                    onChange={(newEndDate) => {
                      setDateInterval([contextFilters["Date Interval"][0], newEndDate]);
                    }}
                    slotProps={{
                      field: { clearable: true, onClear: () => setDateInterval([undefined, contextFilters["Date Interval"][1]]) },
                    }}                    
                    format="DD/MM/YYYY"
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
