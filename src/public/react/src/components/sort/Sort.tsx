import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid2";

interface SortInterface {
  orderValues: string[];

  activeCategory: string[];
  handleCategory: (event: SelectChangeEvent<string[]>) => void;

  activeOrder: string[];
  handleOrder: (event: SelectChangeEvent<string[]>) => void;
}

const Sort = ({
  orderValues,
  activeCategory,
  handleCategory,
  activeOrder,
  handleOrder,
}: SortInterface) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 9 }}>
        <FormControl fullWidth>
          <InputLabel id="select-sort-category-label">Sort by</InputLabel>
          <Select
            labelId="select-sort-category-label"
            id="select-sort-category"
            value={activeCategory}
            label="Sorty by"
            onChange={handleCategory}
            sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
          >
            {orderValues.map((value: string) => {
              return (
                <MenuItem key={value} value={value.toLocaleLowerCase()}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl fullWidth>
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
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Sort;
