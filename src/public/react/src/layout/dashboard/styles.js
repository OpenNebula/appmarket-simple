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

/**
 * Define styles for the Main component.
 *
 * @returns {object} Styles for the component
 */
const styles = () => ({
  container: css({
    marginLeft: "44px",
    marginRight: "44px",
  }),
  title: css({
    marginTop: "28px",
    marginBottom: "28px",
  }),
  toolbar: css({
    marginBottom: "10px",
    gap: "15px",
  }),
  closePanel: css({
    position: "absolute",
    top: 8,
    right: 8,
    "& svg": {
      height: "16px",
      width: "16px",
    },
  }),
})

export default styles
