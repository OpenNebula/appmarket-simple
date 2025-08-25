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
import { scale } from "@/theme/brand"

const width = {
  none: scale[0],
  sm: scale[25],
  md: scale[50],
  lg: scale[100],
  xlg: scale[200],
}

const radius = {
  none: scale[0],
  xs: scale[25],
  md: scale[50],
  lg: scale[100],
  xlg: scale[150],
  "2xl": scale[200],
  "3xl": scale[400],
  "4xl": scale[500],
  "5xl": scale[600],
  round: scale[1500],
}

export const border = {
  width,
  radius,
}
