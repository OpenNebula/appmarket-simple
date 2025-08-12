// Import light and dark themes
import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

// Import not colors variables
import { fontSize, lineHeight, border } from '@/theme/responsive'
import { scale, type } from '@/theme/brand'

/**
 * Define theme.
 * @param {string} mode - Dark or light
 * @returns {object} - Theme
 */
const theme = (mode: "light" | "dark") => {
  
  // Get colors depending of the mode
  const baseTokens = mode === 'light' ? light : dark;
  
  return {
    typography: {
      fontFamily: [type.fontFamily.primary],      
      h3: {
        fontSize: fontSize.heading.h3.desktop,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: lineHeight.heading.h3,
        color: baseTokens.text.headings,
      },
    },

    components: {
      MuiToggleButton: {
        styleOverrides: {
          root: {
            color: baseTokens.icon.action,
            padding: `${scale[200]}px ${scale[500]}px`,
            '&.Mui-selected': {
              backgroundColor: baseTokens.surface.focus,
              color: baseTokens.icon.focus,
              '&:hover': {
                backgroundColor: baseTokens.surface.focus,
              },
            },
            '& svg': {
              width: '16px',
              height: '16px',
            },
            '&:hover': {
              backgroundColor: 'transparent',
            },
            borderRadius: border.radius.xlg,
            border: `${border.width.sm}px solid ${baseTokens.border.action2}`,
          }
        }
      }
    },
  };
};

export { theme }