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
    templateText: css({
      color: baseTokens.text.body,
      fontFamily: "Courier New",
      fontSize: fontSize.body.caption.desktop,
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: lineHeight.body.caption.desktop,
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      overflowWrap: "break-word",
    }),
  }
}

export default styles
