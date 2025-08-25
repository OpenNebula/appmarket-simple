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
import { fontSize, lineHeight } from "@/theme/responsive"
import { scale } from "@/theme/brand"

import { light } from "@/theme/colors/themes/light"
import { dark } from "@/theme/colors/themes/dark"

/**
 * Define styles for the Panel component.
 *
 * @param {object} theme - Current theme
 * @returns {object} Styles for the component
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === "light" ? light : dark

  return {
    panelContainer: css({
      height: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      padding: scale[600],
    }),
    filtersContainer: css({
      justifyContent: "flex-start",
      alignItems: "flex-start",
      gap: scale[200],
      alignSelf: "flex-start",
      width: "100%",
    }),
    filterButton: css({
      width: "100% !important", // We need important because button styles are defined in theme/index.js
    }),
    filterContainer: css({
      gap: scale[100],
      width: "100%",
    }),
    placeholderText: css({
      color: baseTokens.text.disabled,
      textOverflow: "ellipsis",
      overflow: "hidden",
      fontSize: fontSize.body.md.desktop,
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: lineHeight.body.md.desktop,
    }),
  }
}

export default styles
