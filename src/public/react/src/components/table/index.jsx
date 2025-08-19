// React
import { useState } from "react";

// Material
import {
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

// Marketplace components
import TableList from "@/components/table/card";
import TableCard from "@/components/table/list";
import TableFooter from "@/components/table/footer"

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
  const handleToggleView = (_, nextView ) => {
    setView(nextView);
  }

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Paginate appliances
  const paginatedAppliances = appliances.slice(page * rowsPerPage, (page + 1) * rowsPerPage);


  return (
    <>
      {
        appliances?.length === 0 ? (
          <Typography>No appliances found</Typography>
        ) : (
          <Stack direction='column'>
            <Box className={tableStyles.switchView}>
              <ToggleButtonGroup            
                value={view}
                exclusive
                onChange={handleToggleView}                
              >
                <ToggleButton size="small" value="table" aria-label="table" className={tableStyles.switchToggleButton}>
                  <ViewGrid />
                </ToggleButton>
                <ToggleButton size="small" value="list" aria-label="list" className={tableStyles.switchToggleButton}>
                  <List />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {
              view === 'table' ? <TableList appliances={paginatedAppliances} /> : <TableCard appliances={paginatedAppliances} />
            }

            <TableFooter
              count={appliances.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(newSize) => {
                setRowsPerPage(newSize);
                setPage(0); // reset to first page when page size changes
              }}
            />
          </Stack>
        )
      }
    </>

  )
};

export default Table;