// React imports
import { useState } from "react"

// MUI components
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"

// Icons
import { MoreVert, Download, Copy, Xmark as CloseIcon } from "iconoir-react"

// Card styles
import styles from "@/components/card/styles"
import clsx from "clsx"
import { useTheme } from "@mui/material/styles"

// Marketplace components
import Tags from "@/components/tags"
import ApplianceDetails from "@/components/detail"

// Utilities
import { format } from "date-fns"
import { parseToOpenNebulaFormat } from "@/utils/parser"

// Import contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

/**
 * Render the appliance data in a card.
 * @param {object} - Appliance to render.
 * @returns {JSX.Element} The rendered ApplianceCard component.
 */
const ApplianceCard = ({ appliance }) => {
  // Get styles for the component
  const theme = useTheme()
  const cardStyles = styles(theme)

  // Card menu controls
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // State for open appliance details
  const [openDetails, setOpenDetails] = useState(false)

  // Hook to display messages
  const { showMessage } = useSnackbar()

  // Fromat creation date
  const creationDate = appliance?.creation_time
    ? format(new Date(appliance?.creation_time * 1000), "dd MMM yyyy")
    : undefined

  // Get the download link for the appliance
  const downloadLink =
    typeof appliance?.links?.download.href === "string"
      ? appliance?.links?.download.href
      : undefined

  // Get template in OpenNebula format
  const openNebulaTemplate = appliance?.opennebula_template
    ? parseToOpenNebulaFormat(JSON.parse(appliance?.opennebula_template))
    : undefined

  // Handle the download action
  const handleDownload = () => {
    // Open new tab and download
    window.open(downloadLink, "_blank")

    // Close menu
    handleCloseMenu()
  }

  // Handle the copy template action
  const handleCopyTemplate = () => {
    // Copy to clipboard
    navigator.clipboard.writeText(openNebulaTemplate)

    // Show copy message
    showMessage("Template copied to clipboard!")

    // Close menu
    handleCloseMenu()
  }

  return appliance ? (
    <>
      <Card
        onClick={() => !open && setOpenDetails(true)}
        className={clsx(openDetails && "Mui-selected")}
      >
        <CardContent>
          <Stack
            direction="column"
            useFlexGap
            spacing={"32px"}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            <Stack direction="column" useFlexGap spacing={"16px"}>
              <Stack direction="row" useFlexGap spacing={"15px"}>
                <Box
                  component="img"
                  src={
                    appliance.logo
                      ? `/logos/${appliance.logo}`
                      : "/assets/logo-appliance.svg"
                  }
                  className={cardStyles.imageContainer}
                />
                <Stack direction="column">
                  <Typography
                    className={clsx(
                      cardStyles.textContainer,
                      cardStyles.titleApp,
                    )}
                  >
                    {appliance.name}
                  </Typography>
                  <Typography className={cardStyles.descriptionApp}>
                    {appliance.short_description}
                  </Typography>
                </Stack>
                <Box sx={{ marginLeft: "auto" }}>
                  <IconButton
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClickMenu(event)
                    }}
                    className={cardStyles.menuIcon}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    <Tooltip
                      title={downloadLink ? "" : "No download available"}
                      disableInteractive
                    >
                      <span>
                        {" "}
                        {/* Wrapping in span so Tooltip works when MenuItem is disabled */}
                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDownload()
                          }}
                          disabled={!downloadLink}
                          className={cardStyles.menuOption}
                        >
                          <ListItemIcon>
                            <Download />
                          </ListItemIcon>
                          <Typography className={cardStyles.menuOptionText}>
                            Download
                          </Typography>
                        </MenuItem>
                      </span>
                    </Tooltip>
                    <MenuItem
                      onClick={(event) => {
                        event.stopPropagation()
                        handleCopyTemplate()
                      }}
                      className={cardStyles.menuOption}
                    >
                      <ListItemIcon>
                        <Copy />
                      </ListItemIcon>
                      <Typography className={cardStyles.menuOptionText}>
                        Copy Template
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </Stack>
              <Stack>
                <Tags tags={appliance?.tags}></Tags>
              </Stack>
            </Stack>

            <Stack direction="column" useFlexGap spacing={"8px"}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography className={cardStyles.attributesTitle}>
                  HYPERVISOR
                </Typography>
                <Typography className={cardStyles.attributesValue}>
                  {appliance?.hypervisor}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography className={cardStyles.attributesTitle}>
                  VERSION
                </Typography>
                <Typography className={cardStyles.attributesValue}>
                  {appliance?.version}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography className={cardStyles.attributesTitle}>
                  CREATED
                </Typography>
                <Typography className={cardStyles.attributesValue}>
                  {creationDate}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className={cardStyles.dialogTitle}>
          <IconButton
            onClick={() => setOpenDetails(false)}
            className={cardStyles.dialogIcon}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={cardStyles.dialogContent}>
          <ApplianceDetails
            appliance={appliance}
            handleDownload={handleDownload}
            handleCopyTemplate={handleCopyTemplate}
          />
        </DialogContent>
      </Dialog>
    </>
  ) : null
}

export default ApplianceCard
