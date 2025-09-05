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

/**
 * Define styles for the List component.
 *
 * @returns {object} Styles for the component
 */
const styles = () => {
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
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: `${scale[100]} !important`,
    }),
    dialogContent: css({
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
