// React imports
import { useState, useMemo } from "react"

// MUI imports
import {
  Stack,
  Button,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

// Import contexts
import { useFilters } from "@/context/filters/FiltersContext"
import { useAppliances } from "@/context/appliances/AppliancesContext"

// Filter panel styles
import styles from "@/components/filter/panel/styles"
import { useTheme } from "@mui/material/styles"

// Icons
import { FilterList as FilterIcon, NavArrowDown } from "iconoir-react"

// Utilities
import { sum, map, isArray, isObject, isNil } from "lodash"

const FilterPanel = () => {
  // Get styles for the component
  const theme = useTheme()
  const panelStyles = styles(theme)

  // Get setFilter function: This function will apply the current selected filter to the list of appliances.
  const { setFilter } = useAppliances()

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

  const validValuesCount = useMemo(() => {
    return sum(
      map(tempSelections, (value) => {
        if (isArray(value)) {
          return value.length > 0 ? 1 : 0
        } else if (isObject(value)) {
          let count = 0
          if (!isNil(value.start)) count++
          if (!isNil(value.end)) count++
          return count
        }
        return 0
      }),
    )
  }, [tempSelections])

  /**
   * Render a filter as different components. Now, select and date are available.
   * @param {Object} filter - The filter data
   * @returns {JSX.Element} The rendered filter component.
   */
  const renderFilterInput = (filter) => {
    const limit = filter?.key === "version" ? 1 : 2

    switch (filter?.type) {
      case "select":
        return (
          <>
            <Typography variant="bodysm" className={panelStyles.title}>
              {filter?.label}
            </Typography>
            <Autocomplete
              multiple
              options={filter.values || []}
              value={tempSelections[filter.key] || []}
              onChange={(e, newValue) =>
                handleSelectChange(filter.key, newValue)
              }
              disableCloseOnSelect
              disableClearable
              popupIcon={<NavArrowDown />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    !tempSelections[filter.key] ||
                    tempSelections[filter.key].length === 0
                      ? "Select values"
                      : ""
                  }
                  variant="outlined"
                />
              )}
              renderValue={(values) => {
                // Render a limit list of tags
                if (values?.length > limit) {
                  const visibleTags = values?.slice(0, limit)
                  const hiddenCountTags = values?.length - limit

                  return `${visibleTags.join(", ")} +${hiddenCountTags}`
                }

                return values.join(",")
              }}
            />
          </>
        )

      case "date": {
        const currentRange = tempSelections[filter.key] || {
          start: null,
          end: null,
        }

        return (
          <>
            <Typography
              variant="bodysm"
              className={panelStyles.title}
            >{`Start ${filter?.label}`}</Typography>
            <DatePicker
              value={currentRange.start ?? null}
              onChange={(newDate) =>
                handleSelectChange(filter.key, {
                  ...currentRange,
                  start: newDate ?? null,
                })
              }
              format="DD/MM/YYYY"
            />

            <Typography
              variant="bodysm"
              className={panelStyles.title}
            >{`End ${filter?.label}`}</Typography>
            <DatePicker
              value={currentRange.end ?? null}
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
    <Stack direction="column" className={panelStyles.panelContainer}>
      <Stack direction="column" className={panelStyles.filtersContainer}>
        <Typography variant="h4" className={panelStyles.titleText}>
          Filters
        </Typography>
        {filters?.map((filter) => {
          return (
            <Stack
              key={`stack-${filter.key}`}
              direction="column"
              className={panelStyles.filterContainer}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {renderFilterInput(filter)}
              </LocalizationProvider>
            </Stack>
          )
        })}
      </Stack>

      <Button
        variant="contained"
        startIcon={<FilterIcon />}
        className={panelStyles.filterButton}
        onClick={applyFilters}
      >
        Apply Filters ({validValuesCount})
      </Button>
    </Stack>
  )
}

export default FilterPanel
