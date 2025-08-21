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
} from '@/theme/colors/aliases'

export const surface = {
  page: neutral[950],
  primary: neutral[925],
  mute: neutral[900],
  error: error[900],
  warning: warning[950],
  information: information[900],
  success: success[900],
  disabled: neutral[900],
  disabled2: neutral[915],
  disabledSelected: neutral[900],
  action: primary[500],
  focus: primary[400],
  focus2: neutral[950],
  actionHover: neutral[900],
  actionHover2: neutral[925],
  actionHover3: primary[400],
  actionHover4: neutral[915],
}
