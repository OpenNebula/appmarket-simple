// React
import { useState } from "react";

// Material
import {
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

// Marketplace components
import TableList from "@/components/table/list";
import TableCard from "@/components/table/card";

// Styles
import styles from './styles.module.css'

// Icons
import { List, ViewGrid } from 'iconoir-react';

/**
 * Component to display the table of appliances in the main layout. The table will have card and list view.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered Table component.
 */
const Table = ({ appliances }) => {  

  // Table mode view. List by default.
  const [view, setView] = useState("list");

  // Modify table view
  const handleToggleView = (_: React.MouseEvent<HTMLElement>, nextView: string ) => {
    setView(nextView);
  };

  return (
    <Stack direction='column'>
      <Box className={styles.switchView}>
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