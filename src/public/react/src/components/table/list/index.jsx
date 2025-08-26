// React imports
import { useState } from "react"

// MUI imports
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"

import { parseToOpenNebulaFormat } from "@/utils/parser"

// Card styles
import styles from "@/components/table/list/styles"
import { useTheme } from "@mui/material/styles"

// Import contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

// Marketplace components
import ApplianceDetails from "@/components/detail"

// Import icons
import {
  Copy as CopyIcon,
  Download as DownloadIcon,
  Xmark as CloseIcon,
} from "iconoir-react"

/**
 * Render a table with appliances in list format.
 * @param {Array} - List of appliances.
 * @returns {JSX.Element} The rendered TableList component.
 */
const TableList = ({ appliances }) => {
  // Get styles for the component
  const theme = useTheme()
  const listStyles = styles(theme)

  // State for selected appliance
  const [selected, setSelected] = useState(null)

  // Hook to display messages
  const { showMessage } = useSnackbar()

  // Handle the copy template action
  const handleCopyTemplate = (appliance) => {
    // Copy to clipboard
    navigator.clipboard.writeText(
      parseToOpenNebulaFormat(JSON.parse(appliance?.opennebula_template)),
    )

    // Show copy message
    showMessage("Template copied to clipboard!")
  }

  // Handle the download action
  const handleDownload = (appliance) => {
    // Get the download link for the appliance
    const downloadLink =
      typeof appliance?.links?.download.href === "string"
        ? appliance?.links?.download.href
        : undefined

    // Open new tab and download
    window.open(downloadLink, "_blank")
  }

  return (
    <>
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{ tableLayout: "fixed", width: "100%" }}
        >
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
            {appliances?.map((appliance) => (
              <TableRow
                key={appliance.name}
                onClick={() => setSelected(appliance)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ width: "14%" }}>{appliance.name}</TableCell>
                <TableCell sx={{ width: "14%" }}>
                  {appliance.hypervisor}
                </TableCell>
                <TableCell sx={{ width: "30%" }}>
                  {appliance.short_description}
                </TableCell>
                <TableCell sx={{ width: "14%" }}>
                  {appliance["os-id"]}
                </TableCell>
                <TableCell sx={{ width: "14%" }}>{appliance.version}</TableCell>
                <TableCell
                  sx={{ width: "14%" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Stack
                    direction="row"
                    className={listStyles.containerActions}
                  >
                    <Tooltip title={"Copy template"}>
                      <IconButton
                        className={listStyles.actionIcon}
                        sx={{ padding: 0 }}
                        onClick={() => handleCopyTemplate(appliance)}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Download">
                      <IconButton
                        className={listStyles.actionIcon}
                        sx={{ padding: 0 }}
                        onClick={() => handleDownload(appliance)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className={listStyles.dialogTitle}>
          <IconButton
            onClick={() => setSelected(null)}
            className={listStyles.dialogIcon}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={listStyles.dialogContent}>
          {selected && (
            <ApplianceDetails
              appliance={selected}
              handleDownload={() => handleDownload(selected)}
              handleCopyTemplate={() => handleCopyTemplate(selected)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableList
