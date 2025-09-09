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
import { handleCopyTemplate, handleDownload } from "@/utils/cardActions"
import markdownComponents from "@/utils/markdown"

/**
 * Render the appliance details.
 * @param {object} props - Appliance details component props.
 * @param {object} props.appliance - Appliance to render.
 * @param {object} props.dialogRef - Ref to the dialog content.
 * @returns {JSX.Element} The rendered ApplianceDetails component.
 */
const ApplianceDetails = ({ appliance, dialogRef }) => {
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

  return (
    <Stack direction="column" sx={{ gap: "16px", width: "100%" }}>
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
              <Markdown components={markdownComponents(theme)}>
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
            {appliance?.publisher_email && (
              <Stack
                direction="row"
                justifyContent="space-between"
                className={detailsStyles.applianceAttributes}
              >
                <Typography className={detailsStyles.applianceAttributesTitle}>
                  Publisher Email
                </Typography>
                <Typography className={detailsStyles.applianceAttributesText}>
                  {appliance?.publisher_email}
                </Typography>
              </Stack>
            )}
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
          justifyContent="flex-start"
          className={detailsStyles.containerDetails2}
          sx={{ gap: "24px" }}
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
              OS RELEASE
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
              OS ARCH
            </Typography>
            <Typography className={detailsStyles.otherAttributeText}>
              {appliance?.["os-arch"]}
            </Typography>
          </Stack>
          {appliance?.["one-apps_version"] && (
            <Stack
              direction="column"
              justifyContent="space-between"
              sx={{ gap: "11px" }}
            >
              <Typography className={detailsStyles.otherAttributeTitle}>
                OneApps Version
              </Typography>
              <Typography className={detailsStyles.otherAttributeText}>
                {appliance?.["one-apps_version"]}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="flex-end" sx={{ gap: "16px" }}>
        {appliance?.files?.length === 1 && (
          <Button
            variant="contained"
            endIcon={<DownloadIcon />}
            onClick={() => handleDownload(appliance)}
          >
            Download
          </Button>
        )}
        <Button
          variant="contained"
          endIcon={<CopyIcon />}
          onClick={() => handleCopyTemplate(appliance, showMessage, dialogRef)}
        >
          Copy Template
        </Button>
      </Stack>
    </Stack>
  )
}

export default ApplianceDetails
