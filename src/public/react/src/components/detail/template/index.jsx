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

// MUI components
import { Box, Paper } from "@mui/material"

// Card styles
import { useTheme } from "@mui/material/styles"
import styles from "@/components/detail/template/styles"

// Marketplace components

// Utilities
import { parseToOpenNebulaFormat } from "@/utils/parser"

/**
 * Render the appliance details.
 * @param {object} props - Appliance details component props.
 * @param {object} props.appliance - Appliance to render.
 * @returns {JSX.Element} The rendered ApplianceDetails component.
 */
const ApplianceTemplate = ({ appliance }) => {
  // Get styles for the component
  const theme = useTheme()
  const templateStyles = styles(theme)

  return (
    <Paper variant="outlined">
      <Box component="pre" className={templateStyles.templateText}>
        {parseToOpenNebulaFormat(appliance.opennebula_template)}
      </Box>
    </Paper>
  )
}

export default ApplianceTemplate
