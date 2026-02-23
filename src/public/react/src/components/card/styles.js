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

// Import colors
import { light } from "@/theme/colors/themes/light"
import { dark } from "@/theme/colors/themes/dark"

/**
 * Define styles for the Card component.
 *
 * @param {object} theme - Current theme
 * @returns {object} Styles for the component
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === "light" ? light : dark

  return {
    imageContainer: css({
      width: "80px",
      height: "80px",
      objectFit: "contain",
      display: "block",
      borderRadius: "8px",
      border: `1px solid ${baseTokens.border.primary}`,
    }),
    titleApp: css({
      marginBottom: scale[100],
    }),
    descriptionApp: css({
      color: baseTokens.text.body,
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: lineHeight.body.sm,
    }),
    attributesTitle: css({
      color: baseTokens.text.body,
      textAlign: "center",
      fontSize: fontSize.body.caption.desktop,
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: lineHeight.body.caption.desktop,
    }),
    attributesValue: css({
      color: baseTokens.text.headings,
      textAlign: "center",
      fontSize: fontSize.body.md.desktop,
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: lineHeight.body.md.desktop,
    }),
    menuIcon: css({
      color: baseTokens.icon.primary,
      marginTop: "-15px",
      "& svg": {
        width: "24px",
        height: "24px",
      },
    }),
    menuOption: css({
      display: "flex",
      gap: scale[200],
    }),
    menuOptionText: css({
      color: baseTokens.text.body,
      fontSize: fontSize.body.sm.desktop,
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: lineHeight.body.sm.desktop,
    }),
    dialogTitle: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: `${scale[100]} !important`,
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
