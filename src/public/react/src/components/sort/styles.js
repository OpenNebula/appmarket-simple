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
import { fontSize, lineHeight, border } from '@/theme/responsive'
import { scale } from '@/theme/brand'

// Color definition of modes
import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

/**
 * @param theme
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === 'light' ? light : dark

  return {
    placeholderText: css({
      color: baseTokens.text.disabled,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: fontSize.body.md.desktop,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.md.desktop,
    }),
    switchToggleGroup: css({
      width: '100%',
    }),
    switchToggleButton: css({
      '&&': {
        color: baseTokens.icon.primary,
        padding: `${scale[300]} ${scale[400]} ${scale[300]} ${scale[300]}`,
        borderRadius: border.radius.xlg,
        border: `1px solid ${baseTokens.border.primary}`,
        '& svg': {
          width: '16px',
          height: '16px',
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      '&&.Mui-selected': {
        backgroundColor: 'transparent',
        color: baseTokens.icon.action,
        '&:hover': {
          backgroundColor: baseTokens.surface.focus,
        },
        '& .MuiTypography-root': {
          color: baseTokens.text.action,
        },
      },
      '&& .MuiTypography-root': {
        color: baseTokens.text.body,
        fontSize: fontSize.body.sm.desktop,
        fontWeight: 500,
        fontStyle: 'normal',
        lineHeight: lineHeight.body.sm.desktop,
        textTransform: 'none',
      },
    }),
    switchToggleButtonFirst: css({
      borderRight: 'none !important',
    }),
  }
}

export default styles
