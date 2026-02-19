/* ------------------------------------------------------------------------- *
 * Copyright 2002-2025, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
// React imports
import { useState } from "react"

// MUI components
import { Stack, Box, Button, Tabs, Tab } from "@mui/material"

// Card styles
import { useTheme } from "@mui/material/styles"
import styles from "@/components/detail/styles"

// Marketplace components
import ApplianceOverview from "@/components/detail/overview"
import ApplianceTemplate from "@/components/detail/template"

// Marketplace contexts
import { useSnackbar } from "@/context/snackbar/SnackbarContext"

// Import icons
import {
  Xmark as CopyIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
} from "iconoir-react"

// Utilities
import {
  handleCopyTemplate,
  handleDownload,
  handleCopyLink,
} from "@/utils/cardActions"

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

  // Identify tab => Overview = 0, Template = 1
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <Stack direction="column" sx={{ gap: "16px", width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        {/* Tabs */}
        <Box className={detailsStyles.tabHeader}>
          <Tabs
            value={selectedTab}
            onChange={(event, newTab) => setSelectedTab(newTab)}
            aria-label="basic tabs example"
          >
            <Tab label="Overview" className={detailsStyles.tabTitle} />
            <Tab label="Template" className={detailsStyles.tabTitle} />
          </Tabs>
        </Box>

        {/* Content */}
        <Box className={detailsStyles.tabContent}>
          {/* Content for tab Overview */}
          {selectedTab == 0 && <ApplianceOverview appliance={appliance} />}

          {/* Content for tab Template */}
          {selectedTab == 1 && <ApplianceTemplate appliance={appliance} />}

          {/* Buttons */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            className={detailsStyles.tabButtons}
          >
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
              onClick={() =>
                handleCopyTemplate(appliance, showMessage, dialogRef)
              }
            >
              Copy Template
            </Button>
            <Button
              variant="contained"
              endIcon={<LinkIcon />}
              onClick={() => handleCopyLink(appliance, showMessage, dialogRef)}
            >
              Copy URL Link
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

export default ApplianceDetails
