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
import { css } from '@emotion/css'

// Import not colors variables
import { fontSize, lineHeight } from '@/theme/responsive'
import { scale } from '@/theme/brand'

import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

/**
 * @param theme
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === 'light' ? light : dark

  return {
    toolbarContainer: css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${scale[400]} ${scale[800]} ${scale[400]} ${scale[600]}`,
      backgroundColor: '#015675',
    }),
    selectMode: css({
      '& svg': {
        width: '16px',
        height: '16px',
      },
      '& .MuiSelect-select': {
        color: baseTokens.text.body,
        fontSize: fontSize.body.sm.desktop,
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: lineHeight.body.sm.desktop,
        minHeight: '0 !important', // Override minHeight that MUI has by default
        width: '64px',
      },
      padding: `${scale[150]} ${scale[200]} ${scale[150]} ${scale[200]} !important`, // Important to override general styles of the app in theme/index.js
    }),
    docButton: css({
      padding: `${scale[200]} ${scale[500]} ${scale[200]} ${scale[500]} !important`, // Important to override general styles of the app in theme/index.js
    }),
  }
}

export default styles
