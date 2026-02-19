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
import { useMemo } from "react"

// MUI components
import { Stack, Typography, Box } from "@mui/material"

// Card styles
import { useTheme } from "@mui/material/styles"
import { split } from "lodash"
import styles from "@/components/detail/overview/styles"

// Marketplace components
import Tags from "@/components/tags"

// Utilities
import Markdown from "react-markdown"
import markdownComponents from "@/utils/markdown"

/**
 * Render the appliance details.
 * @param {object} props - Appliance details component props.
 * @param {object} props.appliance - Appliance to render.
 * @returns {JSX.Element} The rendered ApplianceDetails component.
 */
const ApplianceOverview = ({ appliance }) => {
  // Get styles for the component
  const theme = useTheme()
  const overviewStyles = styles(theme)

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
    <Stack direction="row" sx={{ gap: "16px" }}>
      <Stack
        direction="column"
        sx={{ gap: "7px", flexGrow: 1 }}
        className={overviewStyles.containerDetails1}
      >
        <Stack direction="row" sx={{ gap: "15px" }}>
          <Box
            component="img"
            src={
              appliance.logo
                ? `/logos/${appliance.logo}`
                : "/assets/logo-appliance.svg"
            }
            className={overviewStyles.logoAppliance}
          />
          <Stack direction="column" sx={{ gap: "4px" }}>
            <Typography variant="h5" className={overviewStyles.applianceTitle}>
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
            className={overviewStyles.applianceAttributes}
          >
            <Typography className={overviewStyles.applianceAttributesTitle}>
              Tags
            </Typography>
            <Tags tags={appliance?.tags} hideOverflow={false}></Tags>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            className={overviewStyles.applianceAttributes}
          >
            <Typography className={overviewStyles.applianceAttributesTitle}>
              Hypervisors
            </Typography>
            <Tags tags={hypervisor} hideOverflow={false}></Tags>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            className={overviewStyles.applianceAttributes}
          >
            <Typography className={overviewStyles.applianceAttributesTitle}>
              Publisher
            </Typography>
            <Typography className={overviewStyles.applianceAttributesText}>
              {appliance?.publisher}
            </Typography>
          </Stack>
          {appliance?.publisher_email && (
            <Stack
              direction="row"
              justifyContent="space-between"
              className={overviewStyles.applianceAttributes}
            >
              <Typography className={overviewStyles.applianceAttributesTitle}>
                Publisher Email
              </Typography>
              <Typography className={overviewStyles.applianceAttributesText}>
                {appliance?.publisher_email}
              </Typography>
            </Stack>
          )}
          <Stack
            direction="row"
            justifyContent="space-between"
            className={overviewStyles.applianceAttributes}
          >
            <Typography className={overviewStyles.applianceAttributesTitle}>
              Appliance Version
            </Typography>
            <Typography className={overviewStyles.applianceAttributesText}>
              {appliance?.version}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            className={overviewStyles.applianceAttributes}
          >
            <Typography className={overviewStyles.applianceAttributesTitle}>
              Compatible Releases
            </Typography>
            <Tags tags={opennebulaVersions} hideOverflow={false}></Tags>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="column"
        justifyContent="flex-start"
        className={overviewStyles.containerDetails2}
        sx={{ gap: "24px" }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ gap: "11px" }}
        >
          <Typography className={overviewStyles.otherAttributeTitle}>
            FORMAT
          </Typography>
          <Typography className={overviewStyles.otherAttributeText}>
            {appliance?.format ? appliance.format : "-"}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ gap: "11px" }}
        >
          <Typography className={overviewStyles.otherAttributeTitle}>
            OS
          </Typography>
          <Typography className={overviewStyles.otherAttributeText}>
            {appliance?.["os-id"]}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ gap: "11px" }}
        >
          <Typography className={overviewStyles.otherAttributeTitle}>
            OS RELEASE
          </Typography>
          <Typography className={overviewStyles.otherAttributeText}>
            {appliance?.["os-release"]}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ gap: "11px" }}
        >
          <Typography className={overviewStyles.otherAttributeTitle}>
            OS ARCH
          </Typography>
          <Typography className={overviewStyles.otherAttributeText}>
            {appliance?.["os-arch"]}
          </Typography>
        </Stack>
        {appliance?.["one-apps_version"] && (
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ gap: "11px" }}
          >
            <Typography className={overviewStyles.otherAttributeTitle}>
              OneApps Version
            </Typography>
            <Typography className={overviewStyles.otherAttributeText}>
              {appliance?.["one-apps_version"]}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default ApplianceOverview
