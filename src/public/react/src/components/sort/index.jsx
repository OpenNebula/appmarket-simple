// React imports
import { useState } from "react"

// MUI components
import {
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  FormControl,
  Select,
  Stack,
  Typography,
  InputAdornment,
  OutlinedInput,
} from "@mui/material"

// Appliances context
import { useAppliances } from "@/context/appliances/AppliancesContext"

// Component styles
import { useTheme } from "@mui/material/styles"
import styles from "@/components/sort/styles"
import clsx from "clsx"

// Icons
import { Sort as SortIcon, NavArrowDown, SortUp, SortDown } from "iconoir-react"

// Utilities
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

/**
 * Component to display a component to sort the appliances. The component is created with a select, to select a category, and the order button, asc or desc.
 * @returns {JSX.Element} The rendered Sort component.
 */
const Sort = () => {
  // Hook to display message
  const { showMessage } = useSnackbar()

  // Get styles for the component
  const theme = useTheme()
  const sortStyles = styles(theme)

  // Values to order by
  const orderValues = ["Name", "Hypervisor", "OS Systems"]

  // Function to update sort by in appliances
  const { setSorting } = useAppliances()

  // Selected category to sort by
  const [activeCategory, setActiveCategory] = useState("")

  // Function to sort appliances by category
  const handleSort = (event) => {
    const selected = event.target.value
    setActiveCategory(selected)
    setSorting(selected.toLowerCase(), sortOrder)
  }

  // Set order to sory by
  const [sortOrder, setSortOrder] = useState("asc")

  // Change order to sort by between asc and desc
  const handleSortOrder = (_, sortOrder) => {
    // Show warning message
    if (!activeCategory) {
      showMessage("To order, select first a Sort by category")
    }

    // Set order
    setSortOrder(sortOrder)

    // Call hook to sort
    setSorting(activeCategory.toLowerCase(), sortOrder)
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

  return (
    <Stack direction="row" sx={{ gap: "8px" }}>
      <FormControl fullWidth>
        <Select
          value={activeCategory}
          onChange={handleSort}
          displayEmpty
          input={
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              }
            />
          }
          IconComponent={CustomArrowIcon}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Typography className={sortStyles.placeholderText}>
                  Sort by
                </Typography>
              )
            }
            return selected.charAt(0).toUpperCase() + selected.slice(1)
          }}
        >
          {orderValues.map((value) => (
            <MenuItem key={value} value={value.toLowerCase()}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={handleSortOrder}
        className={sortStyles.switchToggleGroup}
      >
        <ToggleButton
          value="asc"
          aria-label="asc"
          className={clsx(
            sortStyles.switchToggleButton,
            sortStyles.switchToggleButtonFirst,
          )}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SortUp />
            <Typography>Ascending</Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton
          value="desc"
          aria-label="desc"
          className={sortStyles.switchToggleButton}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SortDown />
            <Typography>Descending</Typography>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default Sort
