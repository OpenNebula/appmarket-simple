// Import light and dark themes
import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

// Import not colors variables
import { fontSize, lineHeight, border } from '@/theme/responsive'
import { scale, type } from '@/theme/brand'
import { borderRadius, fontStyle, fontWeight, height, textTransform, width } from '@mui/system';

/**
 * Define theme.
 * @param {string} mode - Dark or light
 * @returns {object} - Theme
 */
const theme = (mode) => {
  
  // Get colors depending of the mode
  const baseTokens = mode === 'light' ? light : dark;
  
  return {
    typography: {
      fontFamily: [type.fontFamily.primary],      
      h3: {
        fontSize: fontSize.heading.h3.desktop,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: `${lineHeight.heading.h3.desktop}px`,
        color: baseTokens.text.headings,
      },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            border: `1px solid ${baseTokens.border.primary}`,
            background: baseTokens.surface.primary,
            boxShadow: 'none',
            padding: '24px 24px 12px 24px',              
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 0,
            '&:last-child': {
              paddingBottom: 0,
            }, 
          }
        }
      },
      MuiCardHeader: {
        styleOverrides: {          
          root: {
            padding: 0,
            '& svg': {
              width: '24px',
              height: '24px',
            }, 
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            padding: `${scale[50]}px ${scale[200]}px`,            
            borderRadius: border.radius['2xl'],
            border: `1px solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,
            color: baseTokens.text.body,            
            fontSize: fontSize.body.caption.desktop,
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: lineHeight.body.caption.desktop,
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: baseTokens.border.primary,
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: border.radius.xlg,
            border: `${border.width.sm} solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,
            boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.09)',
            padding: scale[100],
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '& svg': {
              width: '16px',
              height: '16px',
            },
            '&:hover': {              
              backgroundColor: baseTokens.surface.actionHover4,
              borderRadius: border.radius.xlg,
            },
            '&:hover .MuiTypography-root': {
              color: baseTokens.text.actionHover2,
            },
            '&:hover svg': {
              color: baseTokens.text.actionHover2,
            }
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {          
          root: {        
            minWidth: 0,    
            '.MuiMenuItem-root &': {
              minWidth: 0,
            }            
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: 0,
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            border: 'none',
            color: baseTokens.text.disabled,
            fontSize: fontSize.body.md.desktop,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: `${lineHeight.body.md.desktop}px`,
          },
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: 'none',
          },
          root: {            
            border: `${border.width.sm}px solid ${baseTokens.border.primary}`,
            borderRadius: border.radius.xlg,
            background: baseTokens.surface.primary,
            padding: `${scale[200]}px ${scale[400]}px}`,                    
          },
          input: {
            padding: 0,
          }          
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: border.radius.xlg,
            border: `${border.width.sm}px solid ${baseTokens.border.primary}`,
            padding: `${scale[200]}px ${scale[400]}px`,
          },
        }
      },
      MuiButton: {
        styleOverrides: {
          outlined: {            
            padding: `${scale[300]}px ${scale[500]}px`,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: `${border.radius.xlg}px`,
            border: `${border.width.sm}px solid ${baseTokens.border.primary}`,
            backgroundColor: baseTokens.surface.primary,            
            '& .MuiTypography-root': {
              color: baseTokens.text.body,
              textAlign: 'center',
              fontSize: `${fontSize.body.sm.desktop}px`,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: `${lineHeight.body.sm.desktop}px`,
              textTransform: 'none',
            },
            '& svg': {
              height: '16px',
              width: '16px',
              color: baseTokens.icon.action,
            }
          }
        }
      }
    },
  };
};

export { theme }