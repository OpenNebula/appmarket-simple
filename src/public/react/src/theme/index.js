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
import { light } from "@/theme/colors/themes/light"
import { dark } from "@/theme/colors/themes/dark"

// Import not colors variables
import { fontSize, lineHeight, border } from "@/theme/responsive"
import { scale, type } from "@/theme/brand"

/**
 * Define theme.
 *
 * @param {string} mode - Dark or light
 * @returns {object} - Theme
 */
const theme = (mode) => {
  // Get colors depending of the mode
  const baseTokens = mode === "light" ? light : dark

  return {
    palette: {
      mode,
      background: {
        default: baseTokens.surface.page,
      },
    },

    typography: {
      fontFamily: [type.fontFamily.primary],
      h3: {
        fontSize: fontSize.heading.h3.desktop,
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: lineHeight.heading.h3.desktop,
        color: baseTokens.text.headings,
      },
      h4: {
        color: baseTokens.text.headings,
        fontSize: fontSize.body.lg.desktop,
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: lineHeight.body.lg.desktop,
      },
      h5: {
        color: baseTokens.text.headings,
        fontSize: fontSize.heading.h5.desktop,
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: lineHeight.heading.h5.desktop,
      },
      h6: {
        color: baseTokens.text.headings,
        fontSize: fontSize.body.sm.desktop,
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: lineHeight.body.sm.desktop,
      },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            border: `1px solid ${baseTokens.border.primary}`,
            background: baseTokens.surface.primary,
            boxShadow: "none",
            padding: "24px 24px 12px 24px",
            cursor: "pointer",
            "&.Mui-selected": {
              border: `1px solid ${baseTokens.border.actionHover}`,
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: 0,
            "& svg": {
              width: "24px",
              height: "24px",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            padding: `${scale[50]} ${scale[200]}`,
            borderRadius: border.radius["2xl"],
            border: `1px solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,
            color: baseTokens.text.body,
            fontSize: fontSize.body.caption.desktop,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: lineHeight.body.caption.desktop,
          },
          filled: {
            padding: `${scale[50]} ${scale[200]}`,
            borderRadius: border.radius["2xl"],
            border: `${border.radius.xs} solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.action,
            color: baseTokens.text.onAction,
            fontSize: fontSize.body.caption.desktop,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: lineHeight.body.caption.desktop,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: baseTokens.border.primary,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: border.radius.xlg,
            border: `${border.width.sm} solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,
            boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.09)",
            padding: scale[100],
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "& svg": {
              width: "16px",
              height: "16px",
            },
            "&:hover": {
              backgroundColor: baseTokens.surface.actionHover4,
              borderRadius: border.radius.xlg,
            },
            "&:hover .MuiTypography-root": {
              color: baseTokens.text.actionHover2,
            },
            "&:hover svg": {
              color: baseTokens.text.actionHover2,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 0,
            ".MuiMenuItem-root &": {
              minWidth: 0,
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            border: "none",
            color: baseTokens.text.disabled,
            fontSize: fontSize.body.md.desktop,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: lineHeight.body.md.desktop,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: "none",
          },
          root: {
            border: `${border.width.sm} solid ${baseTokens.border.primary}`,
            borderRadius: border.radius.xlg,
            background: baseTokens.surface.primary,
            padding: `${scale[200]} ${scale[400]}}`,
          },
          input: {
            padding: 0,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: border.radius.xlg,
            border: `${border.width.sm} solid ${baseTokens.border.primary}`,
            padding: `${scale[200]} ${scale[400]}`,
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& svg": {
              width: "24px",
              height: "24px",
            },
            "& .MuiChip-root svg": {
              width: "16px",
              height: "16px",
              color: `${baseTokens.icon.onAction}`,
            },
          },
          inputRoot: {
            padding: `${scale[200]} ${scale[400]}`,
            fontSize: fontSize.body.md.desktop,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: lineHeight.body.md.desktop,
            "& .MuiInputBase-input": {
              padding: "0px",
              color: baseTokens.text.disabled,
              fontSize: fontSize.body.md.desktop,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: lineHeight.body.md.desktop,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            padding: `${scale[300]} ${scale[500]}`,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: `${border.radius.xlg}`,
            border: `${border.width.sm} solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,
            "& .MuiTypography-root": {
              color: baseTokens.text.body,
              textAlign: "center",
              fontSize: fontSize.body.sm.desktop,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: lineHeight.body.sm.desktop,
              textTransform: "none",
            },
            "& svg": {
              height: "16px",
              width: "16px",
              color: baseTokens.icon.action,
            },
          },
          contained: {
            padding: `${scale[200]} ${scale[500]}`,
            borderRadius: border.radius.xlg,
            border: `${border.width.sm} solid ${baseTokens.border.action}`,
            backgroundColor: baseTokens.surface.action,
            "& svg": {
              width: "16px",
              height: "16px",
            },
            color: baseTokens.text.onAction,
            fontSize: fontSize.body.sm.desktop,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: lineHeight.body.sm.desktop,
            textTransform: "none",
          },
          filled: {
            padding: `${scale[200]} ${scale[500]}`,
            borderRadius: border.radius.xlg,
            "& svg": {
              width: "16px",
              height: "16px",
            },
            fontSize: fontSize.body.sm.desktop,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: lineHeight.body.sm.desktop,
            textTransform: "none",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: baseTokens.surface.primary,
            border: `1px solid ${baseTokens.border.primary}`,
            borderRadius: "16px",
            overflow: "hidden",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td": {
              border: `none`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            padding: `${scale[500]} ${scale[600]} ${scale[500]} ${scale[600]}`,
            color: baseTokens.text.headings,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: fontSize.body.sm.desktop,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: lineHeight.body.sm.desktop,
            borderColor: baseTokens.border.primary,
          },
          root: {
            padding: `${scale[500]} ${scale[600]} ${scale[500]} ${scale[600]}`,
            color: baseTokens.text.body,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: fontSize.body.sm.desktop,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: lineHeight.body.sm.desktop,
            borderColor: baseTokens.border.primary,
          },
        },
      },
    },
  }
}

export { theme }
