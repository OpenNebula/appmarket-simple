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
import { css } from "@emotion/css"

// Import not colors variables
import { scale } from "@/theme/brand"
import { border } from "@/theme/responsive"

// Import colors
import { light } from "@/theme/colors/themes/light"
import { dark } from "@/theme/colors/themes/dark"

/**
 * Define styles for the List component.
 *
 * @param {object} theme - Current theme
 * @returns {object} Styles for the component
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === "light" ? light : dark

  return {
    containerActions: css({
      gap: scale[200],
      justifyContent: "flex-end",
    }),
    actionIcon: css({
      "& svg": {
        width: "16px",
        height: "16px",
      },
    }),
    dialogTitle: css({
      borderRadius: border.radius["3xl"],
      borderTop: border.width.sm,
      borderRight: `${border.width.sm} solid ${baseTokens.border.primary}`,
      borderBottom: `${border.width.none} solid ${baseTokens.border.primary}`,
      borderLeft: `${border.width.sm} solid ${baseTokens.border.primary}`,
      background: baseTokens.surface.primary,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: `${scale[100]} !important`,
    }),
    dialogContent: css({
      borderRadius: `${border.radius.none} ${border.radius.none} ${border.radius["3xl"]} ${border.radius["3xl"]}`,
      border: `${border.width.sm} solid ${baseTokens.border.primary}`,
      padding: `18px !important`,
    }),
    dialogIcon: css({
      padding: `${scale[150]} !important`,
      "& svg": {
        height: "16px",
        width: "16px",
      },
    }),
  }
}

export default styles
