// React imports
import { useState, useRef } from "react"

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

// Card styles
import styles from "@/components/table/list/styles"
import { useTheme } from "@mui/material/styles"

// Import contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

// Marketplace components
import ApplianceDetails from "@/components/detail"

// Utilities
import {
  handleCopyTemplate,
  handleDownload,
  handleCopyLink,
} from "@/utils/cardActions"

// Import icons
import {
  Copy as CopyIcon,
  Download as DownloadIcon,
  Xmark as CloseIcon,
  Link as LinkIcon,
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

  // Set ref to the dialog
  const dialogRef = useRef(null)

  // State for selected appliance
  const [selected, setSelected] = useState(null)

  // Hook to display messages
  const { showMessage } = useSnackbar()

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
                <TableCell sx={{ width: "14%" }}>{appliance?.name}</TableCell>
                <TableCell sx={{ width: "14%" }}>
                  {appliance?.hypervisor}
                </TableCell>
                <TableCell sx={{ width: "30%" }}>
                  {appliance?.short_description}
                </TableCell>
                <TableCell sx={{ width: "14%" }}>
                  {appliance?.["os-id"]}
                </TableCell>
                <TableCell sx={{ width: "14%" }}>
                  {appliance?.version}
                </TableCell>
                <TableCell
                  sx={{ width: "14%" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Stack
                    direction="row"
                    className={listStyles.containerActions}
                  >
                    {appliance?.files?.length === 1 && (
                      <Tooltip title="Download">
                        <IconButton
                          className={listStyles.actionIcon}
                          sx={{ padding: 0 }}
                          onClick={() => handleDownload(appliance)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title={"Copy template"}>
                      <IconButton
                        className={listStyles.actionIcon}
                        sx={{ padding: 0 }}
                        onClick={() =>
                          handleCopyTemplate(appliance, showMessage)
                        }
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={"Copy URL link"}>
                      <IconButton
                        className={listStyles.actionIcon}
                        sx={{ padding: 0 }}
                        onClick={() => handleCopyLink(appliance, showMessage)}
                      >
                        <LinkIcon />
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
        <DialogContent ref={dialogRef} className={listStyles.dialogContent}>
          {selected && (
            <ApplianceDetails
              appliance={selected}
              handleDownload={() => handleDownload(selected)}
              handleCopyTemplate={() =>
                handleCopyTemplate(selected, showMessage)
              }
              dialogRef={dialogRef}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableList
