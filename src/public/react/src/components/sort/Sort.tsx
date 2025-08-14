import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";

import { useAppliances } from "@/context/AppliancesProvider";
import Typography from "@mui/material/Typography";

import { useState } from 'react'

interface SortInterface {
  orderValues: string[];

  activeCategory: string[];
  handleCategory: (event: SelectChangeEvent<string[]>) => void;

  activeOrder: string[];
  handleOrder: (event: SelectChangeEvent<string[]>) => void;
}

const Sort = ({  
  activeOrder,
  handleOrder,
}: SortInterface) => {

  // Values to order by
  const orderValues = ["Name", "Hypervisor", "OS Systems"];

  // Function to update sort by in appliances
  const { setSorting } = useAppliances();

  // Selected category to sort by
  const [activeCategory, setActiveCategory] = useState("");

  // Function to sort appliances
  const handleSort = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string;
    setActiveCategory(selected);
    setSorting(selected.toLowerCase(), "asc");
  };


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9} >
        <FormControl fullWidth>
          <Select
            value={activeCategory}
            onChange={handleSort}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="textSecondary">Sort by</Typography>;
              }
              return selected.charAt(0).toUpperCase() + selected.slice(1); // capitalize first letter
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

      <Grid item xs={12} md={3} >
        {/* <FormControl fullWidth>
          <InputLabel id="select-order-label">Order</InputLabel>
          <Select
            labelId="select-order-label"
            id="select-order"
            value={activeOrder}
            label="Order"
            onChange={handleOrder}
            sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
          >
            <MenuItem value={"Asc"}>Asc</MenuItem>
            <MenuItem value={"Desc"}>Desc</MenuItem>
          </Select>
        </FormControl> */}
      </Grid>
    </Grid>
  );
};

export default Sort;
