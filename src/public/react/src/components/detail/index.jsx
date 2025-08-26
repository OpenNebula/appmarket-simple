// React imports
import { useMemo } from "react"

// MUI components
import { Stack, Typography, Box, Button } from "@mui/material"

// Card styles
import { useTheme } from "@mui/material/styles"
import { split } from "lodash"
import styles from "@/components/detail/styles"

// Marketplace components
import Tags from "@/components/tags"

// Marketplace contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

// Import icons
import { Xmark as CopyIcon, Download as DownloadIcon } from "iconoir-react"

// Utilities
import Markdown from "react-markdown"
import { parseToOpenNebulaFormat } from "@/utils/parser"

/**
 * Render the appliance details.
 * @param {object} - Appliance to render.
 * @returns {JSX.Element} The rendered ApplianceDetails component.
 */
const ApplianceDetails = ({ appliance }) => {
  // Get styles for the component
  const theme = useTheme()
  const detailsStyles = styles(theme)

  // Hook to display messages
  const { showMessage } = useSnackbar()

  // Transform opennebula_version string into array
  const opennebulaVersions = useMemo(
    () => split(appliance?.opennebula_version || "", ",").filter(Boolean),
    [appliance?.opennebula_version],
  )

  // Transform hypervisors string into array
  const hypervisor = useMemo(
    () => split(appliance?.hypervisor || "", ",").filter(Boolean),
    [appliance?.hypervisor],
  )

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
  }

  // Handle the copy template action
  const handleCopyTemplate = () => {
    // Copy to clipboard
    navigator.clipboard.writeText(openNebulaTemplate)

    // Show copy message
    showMessage("Template copied to clipboard!")
  }

  return (
    <Stack direction="column" sx={{ gap: "16px", width: "50%" }}>
      <Stack direction="row" sx={{ gap: "16px" }}>
        <Stack
          direction="column"
          sx={{ gap: "7px", flexGrow: 1 }}
          className={detailsStyles.containerDetails1}
        >
          <Stack direction="row" sx={{ gap: "15px" }}>
            <Box
              component="img"
              src={
                appliance.logo
                  ? `/logos/${appliance.logo}`
                  : "/assets/logo-appliance.svg"
              }
              className={detailsStyles.logoAppliance}
            />
            <Stack direction="column" sx={{ gap: "4px" }}>
              <Typography variant="h5" className={detailsStyles.applianceTitle}>
                {appliance.name}
              </Typography>
              <Markdown
                components={{
                  p: ({ _, ...props }) => (
                    <Typography
                      className={detailsStyles.applianceDescription}
                      {...props}
                    />
                  ),
                  a: ({ _, ...props }) => (
                    <a className={detailsStyles.applianceRef} {...props} />
                  ),
                }}
              >
                {appliance.description}
              </Markdown>
            </Stack>
          </Stack>
          <Stack direction="column" sx={{ gap: "4px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              className={detailsStyles.applianceAttributes}
            >
              <Typography className={detailsStyles.applianceAttributesTitle}>
                Tags
              </Typography>
              <Tags tags={appliance?.tags} hideOverflow={false}></Tags>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              className={detailsStyles.applianceAttributes}
            >
              <Typography className={detailsStyles.applianceAttributesTitle}>
                Hypervisors
              </Typography>
              <Tags tags={hypervisor} hideOverflow={false}></Tags>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              className={detailsStyles.applianceAttributes}
            >
              <Typography className={detailsStyles.applianceAttributesTitle}>
                Publisher
              </Typography>
              <Typography className={detailsStyles.applianceAttributesText}>
                {appliance?.publisher}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              className={detailsStyles.applianceAttributes}
            >
              <Typography className={detailsStyles.applianceAttributesTitle}>
                Appliance Version
              </Typography>
              <Typography className={detailsStyles.applianceAttributesText}>
                {appliance?.version}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              className={detailsStyles.applianceAttributes}
            >
              <Typography className={detailsStyles.applianceAttributesTitle}>
                Compatible Releases
              </Typography>
              <Tags tags={opennebulaVersions} hideOverflow={false}></Tags>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction="column"
          justifyContent="space-between"
          className={detailsStyles.containerDetails2}
        >
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ gap: "11px" }}
          >
            <Typography className={detailsStyles.otherAttributeTitle}>
              FORMAT
            </Typography>
            <Typography className={detailsStyles.otherAttributeText}>
              {appliance?.format ? appliance.format : "-"}
            </Typography>
          </Stack>
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ gap: "11px" }}
          >
            <Typography className={detailsStyles.otherAttributeTitle}>
              OS
            </Typography>
            <Typography className={detailsStyles.otherAttributeText}>
              {appliance?.["os-id"]}
            </Typography>
          </Stack>
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ gap: "11px" }}
          >
            <Typography className={detailsStyles.otherAttributeTitle}>
              OS Release
            </Typography>
            <Typography className={detailsStyles.otherAttributeText}>
              {appliance?.["os-release"]}
            </Typography>
          </Stack>
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ gap: "11px" }}
          >
            <Typography className={detailsStyles.otherAttributeTitle}>
              OS arch
            </Typography>
            <Typography className={detailsStyles.otherAttributeText}>
              {appliance?.["os-arch"]}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="flex-end" sx={{ gap: "16px" }}>
        <Button
          variant="contained"
          endIcon={<DownloadIcon />}
          className={detailsStyles.filterButton}
          onClick={handleDownload}
        >
          Download
        </Button>
        <Button
          variant="contained"
          endIcon={<CopyIcon />}
          className={detailsStyles.filterButton}
          onClick={handleCopyTemplate}
        >
          Copy Template
        </Button>
      </Stack>
    </Stack>
  )
}

export default ApplianceDetails
