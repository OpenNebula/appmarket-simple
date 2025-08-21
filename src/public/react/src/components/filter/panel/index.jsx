import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box, Stack, Button, Select, MenuItem } from "@mui/material";
import BasicAccordion from "@/components/accordion/BasicAccordion";
import FilterCheckbox from "@/components/filter/checkboxes";
import { useAppContext } from "@/context/useAppContext";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

// React imports
import { useState } from 'react'

// Import contexts
import { useFilters } from "@/context/filters/FiltersContext";
import { useAppliances } from "@/context/appliances/AppliancesContext";

// Toolbar styles
import styles from '@/components/filter/panel/styles'
import { useTheme } from '@mui/material/styles';

// Icons
import { FilterList as FilterIcon, NavArrowDown, Calendar } from 'iconoir-react'

const FilterPanel = () => {
  
  // Get styles for the component
  const theme = useTheme();
  const panelStyles = styles(theme)

  // Get setFilter function: This function will apply the current selected filter to the list of appliances.
  const { setFilter } = useAppliances();

  // User filters context: This context will give us the ability to get and modify the filters definition and which values are selected in each filter.
  const { filters, selectedFilters, setFilterValue } = useFilters()

  // Local state to store temporary selections
  const [tempSelections, setTempSelections] = useState(selectedFilters || {})

  // Handle change in a select but only update tempSelections
  const handleSelectChange = (key, values) => {
    setTempSelections((prev) => ({
      ...prev,
      [key]: values,
    }))
  }

  // Apply button commits tempSelections to context
  const applyFilters = () => {
    Object.entries(tempSelections).forEach(([key, values]) => {

      // Store the selected value
      setFilterValue(key, values)

      // Apply filters in appliances
      // Push to Appliances filtering:
      // - arrays/strings: as-is
      // - date object: null if both empty, else the object
      if (values && typeof values === "object" && !Array.isArray(values)) {
        const { start, end } = values || {}
        if (!start && !end) {
          setFilter(key, null)
        } else {
          setFilter(key, values)
        }
      } else {
        setFilter(key, values)
      }
    })
  }

  // Use Nav Arrow Down instead the default one
  const CustomArrowIcon = (props) => (
    <NavArrowDown
      {...props}
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
      }}
    />
  )

  /**
   * Render a filter as different components. Now, select and date are available.
   * @param {Object} filter - The filter data
   * @returns {JSX.Element} The rendered filter component.
   */
  const renderFilterInput = (filter) => {

    switch (filter?.type) {
      
      case "select": 
        return (
          <>
            <Typography variant="h5">{filter?.label}</Typography>
            <Select                    
              multiple
              displayEmpty
              value={tempSelections[filter.key] || []}
              onChange={(e) => handleSelectChange(filter.key, e.target.value)}
              IconComponent={CustomArrowIcon}
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return <Typography className={panelStyles.placeholderText}>Select a value</Typography>;
                }
                return selected.join(", ");
              }}
            >
              {filter?.values.map((value) => (
                <MenuItem key={value} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </>
      )

      case 'date': {
        const currentRange = tempSelections[filter.key] || { start: null, end: null }
        
        return (
          <>
            <Typography variant="h5">{`Start ${filter?.label}`}</Typography>
            <DatePicker
              value={currentRange.start}
              onChange={(newDate) =>
                handleSelectChange(filter.key, {
                  ...currentRange,
                  start: newDate ?? null,
                })
              }
              format="DD/MM/YYYY"
            />

            <Typography variant="h5">{`End ${filter?.label}`}</Typography>
            <DatePicker
              value={currentRange.end}
              onChange={(newDate) =>
                handleSelectChange(filter.key, {
                  ...currentRange,
                  end: newDate ?? null,
                })
              }
              format="DD/MM/YYYY"
            />
          </>          
        )
      }
    }
  }

  return (
    
    <Stack direction="column" className={panelStyles.panelContainer} >

      <Stack direction="column" className={panelStyles.filtersContainer}>
        <Typography variant="h4" className={panelStyles.titleText}>Filters</Typography>
        {
          filters?.map((filter) => {
            return (
              <Stack key={`stack-${filter.key}`} direction="column" className={panelStyles.filterContainer}>
                {/* <Typography variant="h5">{filter?.label}</Typography> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {renderFilterInput(filter)}
                </LocalizationProvider>
              </Stack>
            )
          })
        }
      </Stack>

      <Button variant="contained" startIcon={<FilterIcon />} className={panelStyles.filterButton} onClick={applyFilters}>
        Apply Filters
      </Button>

    </Stack>



    // <Card sx={{ height: "calc(100vh - 64px)", overflowY: "auto" }}>
    //   <CardContent>
    //     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    //       {/* <FilterAltIcon sx={{ mr: 2 }} /> */}

    //       <Typography variant="h6">Filters</Typography>
    //     </Box>

    //     {filters && filters.map({key, label, type, values}) => (
    //       key !== "Date Interval" ? (
    //         <BasicAccordion
    //           defaultExpanded={
    //             key === "Hypervisors" || key === "OpenNebula Versions"
    //           }
    //           key={key}
    //           name={key}
    //         >
    //           {values.map(
    //             (
    //               value,
    //               index,
    //             ) => {
    //               return (<div>{value.name}</div>)
    //               {/* return (
    //                 <FilterCheckbox
    //                   key={`${key}-${value}-${index}`}
    //                   group={key}
    //                   totalCount={value.totalCount}
    //                   value={value.name}
    //                 />
    //               ); */}
    //             },
    //           )}
    //         </BasicAccordion>
    //       ) : (
    //         <BasicAccordion defaultExpanded={false} name={"Date Interval"} key={key}>
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DemoContainer components={["DateRangePicker"]}>

    //               <DatePicker
    //                 label="Init date"
    //                 value={filters["Date Interval"][0]}
    //                 onChange={(newStartDate) => {
    //                   setDateInterval([newStartDate, filters["Date Interval"][1]]);
    //                 }}
    //                 slotProps={{
    //                   field: { clearable: true, onClear: () => setDateInterval([undefined, filters["Date Interval"][1]]) },
    //                 }}
    //                 format="DD/MM/YYYY"
    //               />

    //               <DatePicker
    //                 label="End date"
    //                 value={filters["Date Interval"][1]} 
    //                 onChange={(newEndDate) => {
    //                   setDateInterval([filters["Date Interval"][0], newEndDate]);
    //                 }}
    //                 slotProps={{
    //                   field: { clearable: true, onClear: () => setDateInterval([undefined, filters["Date Interval"][1]]) },
    //                 }}                    
    //                 format="DD/MM/YYYY"
    //               />
    //             </DemoContainer>
    //           </LocalizationProvider>
    //         </BasicAccordion>
    //       ),
    //     )}
    //   </CardContent>
    // </Card>
  );
};

export default FilterPanel
