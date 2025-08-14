// React
import { useState } from "react";

// Material
import {
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

// Marketplace components
import TableList from "@/components/table/card";
import TableCard from "@/components/table/list";

// Component styles
import styles from '@/components/table/styles'

// Icons
import { List, ViewGrid } from 'iconoir-react';

/**
 * Component to display the table of appliances in the main layout. The table will have card and list view.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered Table component.
 */
const Table = ({ appliances }) => {  

  // Get styles for the component
  const theme = useTheme();
  const tableStyles = styles(theme)

  // Table mode view. List by default.
  const [view, setView] = useState("list");

  // Modify table view
  const handleToggleView = (_: React.MouseEvent<HTMLElement>, nextView: string ) => {
    setView(nextView);
  };

  return (
    <Stack direction='column'>
      <Box className={tableStyles.switchView}>
        <ToggleButtonGroup            
          value={view}
          exclusive
          onChange={handleToggleView}
        >
          <ToggleButton size="small" value="list" aria-label="list">
            <ViewGrid />
          </ToggleButton>
          <ToggleButton size="small" value="table" aria-label="module">
            <List />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {
        view === 'list' ? <TableList appliances={appliances} /> : <TableCard appliances={appliances} />
      }
    </Stack>
  )
};

export default Table;