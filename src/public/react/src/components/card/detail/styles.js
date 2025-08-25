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

import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

/**
 * Define styles for the Card component.
 *
 * @param {object} theme - Current theme
 * @returns {object} Styles for the component
 */
const styles = (theme) => {
  const baseTokens = theme.palette.mode === 'light' ? light : dark

  return {
    containerDetails1: css({
      padding: '12px 16px 49px 12px',
      borderRadius: border.radius['3xl'],
      border: `1px solid ${baseTokens.border.primary}`,
    }),
    containerDetails2: css({
      padding: '16px 60px 10px 16px',
      borderRadius: border.radius.lg,
      border: `1px solid ${baseTokens.border.primary}`,
    }),
    logoAppliance: css({
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      display: 'block',
      borderRadius: '8px',
      border: `1px solid ${baseTokens.border.primary}`,
    }),
    applianceTitle: css({
      color: baseTokens.text.heading,
      fontSize: fontSize.heading.h5.desktop,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: lineHeight.heading.h5.desktop,
    }),
    applianceDescription: css({
      color: baseTokens.text.body,
      fontSize: `${fontSize.body.sm.desktop} !important`,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.sm.desktop,
    }),
    applianceRef: css({
      color: baseTokens.text.action,
      fontSize: `${fontSize.body.sm.desktop} !important`,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.sm.desktop,
      textDecorationLine: 'underline',
      textDecorationStyle: 'solid',
      textDecorationSkipInk: 'auto',
      textDecorationThickness: 'auto',
      textUnderlineOffset: 'auto',
      textUnderlinePosition: 'from-font',
    }),
    applianceAttributes: css({
      padding: '18px 0',
    }),
    applianceAttributesTitle: css({
      color: `${baseTokens.text.headings} !important`,
      fontSize: `${fontSize.body.md.desktop} !important`,
      fontStyle: 'normal !important',
      fontWeight: '600 !important',
      lineHeight: `${lineHeight.body.md.desktop} !important`,
    }),
    applianceAttributesText: css({
      color: `${baseTokens.text.body} !important`,
      fontSize: `${fontSize.body.md.desktop} !important`,
      fontStyle: 'normal !important',
      fontWeight: '500 !important',
      lineHeight: `${lineHeight.body.md.desktop} !important`,
    }),
    otherAttributeTitle: css({
      color: `${baseTokens.text.body} !important`,
      fontSize: `${fontSize.body.caption.desktop} !important`,
      fontStyle: 'normal !important',
      fontWeight: '500 !important',
      lineHeight: `${lineHeight.body.caption.desktop} !important`,
    }),
    otherAttributeText: css({
      color: `${baseTokens.text.headings} !important`,
      fontSize: `${fontSize.body.md.desktop} !important`,
      fontStyle: 'normal !important',
      fontWeight: '500 !important',
      lineHeight: `${lineHeight.body.md.desktop} !important`,
    }),
  }
}

export default styles
