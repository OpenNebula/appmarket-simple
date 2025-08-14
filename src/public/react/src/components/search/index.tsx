// React imports
import { useState } from "react";

// MUI components
import { InputAdornment, TextField } from "@mui/material";

// Icons
import { Search as SearchIcon } from "iconoir-react";

// Appliances context
import { useAppliances } from "@/context/AppliancesProvider";

/**
 * Component to display the search bar and perform search by name in the appliances.
 * @returns {JSX.Element} The rendered Search component.
 */
export default function Search() {

  // Get setFilter function
  const { setFilter } = useAppliances();

  // Define variable to store query
  const [query, setQuery] = useState("");

  /**
   * Set filter when update query
   * @param e 
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setFilter("name", value);
  };

  return (
    <TextField
      value={query}
      onChange={handleChange}
      fullWidth    
      placeholder="Search appliance by name"      
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
