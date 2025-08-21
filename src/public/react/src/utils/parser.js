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
/**
 * @param obj
 */
const parseToOpenNebulaFormat = (obj) => {
  const parseValue = (value) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return `[
      ${Object.entries(value)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',\n  ')}
    ]`
    }

    return `"${value}"`
  }

  const result = Object.entries(obj)
    .map(([key, value]) => `${key}=${parseValue(value)}`)
    .join('\n')

  return result.replace(/""/g, '')
}

export { parseToOpenNebulaFormat }
