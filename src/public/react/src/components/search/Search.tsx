import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEventHandler } from "react";

interface SearchInterface {
  handler: ChangeEventHandler;
}

export default function Search({ handler }: SearchInterface) {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Search appliance"
      fullWidth
      onChange={handler}
      placeholder="Search appliance by name"
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}
