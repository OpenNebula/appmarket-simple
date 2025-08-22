// MUI imports
import { Stack, Chip } from "@mui/material"

// Import filtert context
import { useFilters } from "@/context/filters/FiltersContext"
import { useAppliances } from "@/context/appliances/AppliancesContext"

// FiterTags styles
import styles from '@/components/filter/tags/styles'
import { useTheme } from '@mui/material/styles'

// Icons
import { Xmark } from 'iconoir-react'

// Utilities
import { without, find } from 'lodash'
import dayjs from 'dayjs'

/**
 * Render tags with selected values in the filter. 
 * @returns {JSX.Element} The rendered filter tags component.
 */
const FilterTags = () => {

  // Get styles for the component
  const theme = useTheme()
  const tagsStyles = styles(theme)

  // Get current filters that are applied
  const { selectedFilters, setFilterValue, filters } = useFilters()

  // Get setFilter function: This function will apply the current selected filter to the list of appliances.
  const { setFilter, clearFilter } = useAppliances()

  // Delete a single value from the filters
  const handleDeleteSingleValue = (key, value) => {

    // Get current values in the filter
    const current = selectedFilters[key]
    
    // Delete the selected value
    const updated = without(current, value)

    // Clear filter if there is no values or updated if there is at least one value
    if (updated?.length === 0) {
      clearFilter(key)
      setFilterValue(key, null)
    } 
    else {
      setFilterValue(key, updated)
      setFilter(key, updated)
    }
  }

  // Delete a date filter
  const handleDeleteDateValue = (key, start) => {

    // Get current values in the filter
    const current = selectedFilters[key]
    
    // Delete the selected value
    const updated = {      
      start: start ? undefined : current?.start,
      end: !start ? undefined : current?.end,
    }

    // Update filter
    setFilterValue(key, updated)
    setFilter(key, updated)
  }

  return (
    <Stack direction="row" sx={{ gap: '4px', minHeight: '24px', flexWrap: 'wrap' }}>
      {selectedFilters && Object.entries(selectedFilters).flatMap(([key, values]) => {
        const filterDefinition = find(filters, { key })

        if (filterDefinition.type === 'select') {
          return values?.map((value) => {
            const total = filterDefinition?.total[value]

            return (
              <Chip
                key={`${key}-${value}`}
                label={`${value} (${total})`}
                size="small"
                variant="filled"
                onDelete={() => handleDeleteSingleValue(key, value)}
                className={tagsStyles.filterTag}
                deleteIcon={<Xmark width={16} height={16} />}
              />
            )
          }) || []
        }

        if (filterDefinition.type === 'date') {
          const startDate = values.start && dayjs(values.start).format("DD/MM/YYYY")
          const endDate = values.end && dayjs(values.end).format("DD/MM/YYYY")

          const chips = []

          if (startDate) {
            chips.push(
              <Chip
                key={`${key}-start`}
                label={`Start date: ${startDate}`}
                size="small"
                variant="filled"
                onDelete={() => handleDeleteDateValue(key, true)}
                className={tagsStyles.filterTag}
                deleteIcon={<Xmark width={16} height={16} />}
              />
            )
          }

          if (endDate) {
            chips.push(
              <Chip
                key={`${key}-end`}
                label={`End date: ${endDate}`}
                size="small"
                variant="filled"
                onDelete={() => handleDeleteDateValue(key, false)}
                className={tagsStyles.filterTag}
                deleteIcon={<Xmark width={16} height={16} />}
              />
            )
          }

          return chips
        }

        return []
      })}
    </Stack>

  )

}

export default FilterTags