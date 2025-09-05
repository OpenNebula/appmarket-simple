// Material
import { Stack, Box, ToggleButton, ToggleButtonGroup } from "@mui/material"

// Marketpace components
import Search from "@/components/search"
import Sort from "@/components/sort"
import Filter from "@/components/filter/action"

// Appliances context
import { useAppliances } from "@/context/appliances/AppliancesContext"

// Component styles
import { useTheme } from "@mui/material/styles"
import styles from "@/components/toolbar/styles"

// Icons
import { List, ViewGrid } from "iconoir-react"

/**
 * Component to display the toolbar in the main layout. The toolbar will contain search, sort and filter buttons.
 * @returns {JSX.Element} The rendered Toolbar component.
 */
const Toolbar = ({ view, setView }) => {
  // Get styles for the component
  const theme = useTheme()
  const toolbarStyles = styles(theme)

  // Get setFilter function: This function will apply the current selected filter to the list of appliances.
  const { setFilter } = useAppliances()

  // Modify table view
  const handleToggleView = (_, nextView) => {
    setView(nextView)
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Search expands to take available space */}
      <Box flex={1}>
        <Search handler={(e) => setFilter("name", e.target.value)} />
      </Box>

      {/* Sort auto-sizes */}
      <Sort />

      {/* Toggle auto-sizes */}
      <ToggleButtonGroup value={view} exclusive onChange={handleToggleView}>
        <ToggleButton
          size="small"
          value="card"
          aria-label="card"
          className={toolbarStyles.switchToggleButton}
        >
          <ViewGrid />
        </ToggleButton>
        <ToggleButton
          size="small"
          value="list"
          aria-label="list"
          className={toolbarStyles.switchToggleButton}
        >
          <List />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Filter aligned to the far right */}
      <Box flexShrink={0} marginLeft="auto">
        <Filter />
      </Box>
    </Stack>
  )
}

export default Toolbar
