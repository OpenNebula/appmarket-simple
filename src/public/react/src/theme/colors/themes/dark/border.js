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
import {
  error,
  information,
  neutral,
  primary,
  warning,
  success,
} from "@/theme/colors/aliases"

export const border = {
  primary: neutral[900],
  information: information[500],
  error: error[500],
  warning: warning.default,
  success: success.default,
  disabled: neutral[950],
  disabled2: neutral[925],
  action: primary[500],
  action2: neutral[925],
  focus: primary[500],
  focus2: primary[600],
  actionHover: primary[400],
  actionHover2: primary[500],
  actionHover3: primary[600],
}
