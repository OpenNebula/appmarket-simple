// MUI components
import {
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Stack,
} from '@mui/material'

import { useAppliances } from "@/context/appliances/AppliancesContext";
import Typography from "@mui/material/Typography";

import { useState } from 'react'

// MUI components
import { InputAdornment, OutlinedInput } from "@mui/material";

// Component styles
import { useTheme } from '@mui/material/styles';
import styles from '@/components/sort/styles'
import clsx from 'clsx'

// Icons
import { 
  Sort as SortIcon, 
  NavArrowDown,
  SortUp,
  SortDown,
} from "iconoir-react";

// Utilities
import { useSnackbar } from "@/context/snackbar/SnackbarContext";

const Sort = () => {

  // Hook to display message
  const { showMessage } = useSnackbar();

  // Get styles for the component
  const theme = useTheme();
  const sortStyles = styles(theme)

  // Values to order by
  const orderValues = ["Name", "Hypervisor", "OS Systems"];

  // Function to update sort by in appliances
  const { setSorting } = useAppliances();

  // Selected category to sort by
  const [activeCategory, setActiveCategory] = useState("");

  // Function to sort appliances by category
  const handleSort = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string;
    setActiveCategory(selected);
    setSorting(selected.toLowerCase(), sortOrder);
  };

  // Set order to sory by
  const [sortOrder, setSortOrder] = useState("asc");

  // Change order to sort by between asc and desc
  const handleSortOrder = (_: React.MouseEvent<HTMLElement>, sortOrder: string ) => {

    // Show warning message
    !activeCategory && showMessage('To order, select first a Sort by category')

    // Set order
    setSortOrder(sortOrder);

    // Call hook to sort
    setSorting(activeCategory.toLowerCase(), sortOrder);
  };

  // Use Nav Arrow Down instead the default one
  const CustomArrowIcon = (props: any) => (
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
  );

  return (
    <Grid container spacing={1}>

      <Grid item xs={12} md={5} >

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
                return <Typography className={sortStyles.placeholderText} >Sort by</Typography>;
              }
              return selected.charAt(0).toUpperCase() + selected.slice(1);
            }}
          >
            {orderValues.map((value: string) => (
              <MenuItem key={value} value={value.toLowerCase()}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Grid>

      <Grid item xs={12} md={7} >

        <ToggleButtonGroup            
          value={sortOrder}
          exclusive
          onChange={handleSortOrder}          
          className={sortStyles.switchToggleGroup}
        >
          <ToggleButton value="asc" aria-label="asc" className={clsx(sortStyles.switchToggleButton, sortStyles.switchToggleButtonFirst)}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SortUp />
              <Typography>Ascending</Typography>
            </Stack>                  
          </ToggleButton>
          <ToggleButton value="desc" aria-label="desc" className={sortStyles.switchToggleButton}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SortDown />
              <Typography>Descending</Typography>
            </Stack>                    
          </ToggleButton>
        </ToggleButtonGroup>

      </Grid>
    </Grid>
  );
};

export default Sort;
