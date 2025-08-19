// MUI imports
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material"

import { parseToOpenNebulaFormat } from "@/utils/parser";

// Card styles
import styles from '@/components/table/list/styles'
import { useTheme } from '@mui/material/styles';

// Import contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext";

// Import icons
import {
  Copy as CopyIcon,
  Download as DownloadIcon,
} from 'iconoir-react'

const createData = (
  name,
  hypervisor,
  short_description,
  os_id,
  version,
  actions,
) => {
  return { name, hypervisor, short_description, os_id, version, actions };
};

/**
 * Render a table with appliances in list format.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered TableList component.
 */
const TableList = ({ appliances }) => {

  // Get styles for the component
  const theme = useTheme();
  const listStyles = styles(theme)

  // Hook to display messages
  const { showMessage } = useSnackbar()

  // Handle the copy template action
  const handleCopyTemplate = (openNebulaTemplate) => {

    // Copy to clipboard
    navigator.clipboard.writeText(parseToOpenNebulaFormat(JSON.parse(openNebulaTemplate)))

    // Show copy message
    showMessage('Template copied to clipboard!')
  }

  // Handle the download action
  const handleDownload = (downloadLink) => {

    // Open new tab and download
    window.open(downloadLink, "_blank"); 

    // Close menu
    handleCloseMenu();
  }  

  /**
   * Create data for each row of the table.
   */
  const rows = appliances?.map((appliance) => {

    // Get the download link for the appliance
    const downloadLink = typeof appliance?.links?.download.href === "string" ? appliance?.links?.download.href : undefined;

    // Create copy template and download actions
    const actions = () => (
      <Stack direction="row" className={listStyles.containerActions} >

        <Tooltip title={'Copy template'}>

          <IconButton
            className={listStyles.actionIcon}
            sx={{ padding: 0}}
            onClick={() => handleCopyTemplate(appliance.opennebula_template) }
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download">
          <IconButton
            className={listStyles.actionIcon}
            sx={{ padding: 0}}
            onClick={() => handleDownload(downloadLink)}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>

      </Stack>
    );

    return createData(
      appliance.name,
      appliance.hypervisor,
      appliance.short_description,
      appliance["os-id"],
      appliance.version,
      actions,
    );
  });

  return (

      <TableContainer>
        <Table aria-label="simple table" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "14%" }}>Name</TableCell>
              <TableCell sx={{ width: "14%" }}>Hypervisor</TableCell>
              <TableCell sx={{ width: "30%" }}>Description</TableCell>
              <TableCell sx={{ width: "14%" }}>OS</TableCell>
              <TableCell sx={{ width: "14%" }}>Appliance Version</TableCell>
              <TableCell sx={{ width: "14%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow
                key={row.name}                
              >
                <TableCell sx={{ width: "14%" }}>{row.name}</TableCell>
                <TableCell sx={{ width: "14%" }}>{row.hypervisor}</TableCell>
                <TableCell sx={{ width: "30%" }}>{row.short_description}</TableCell>
                <TableCell sx={{ width: "14%" }}>{row.os_id}</TableCell>
                <TableCell sx={{ width: "14%" }}>{row.version}</TableCell>
                <TableCell sx={{ width: "14%" }}>{row.actions()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

  );
};

export default TableList;
