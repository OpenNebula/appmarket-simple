// React
import { useMemo } from 'react'

// Import light and dark themes
import { light } from '@/theme/colors/themes/light'
import { dark } from '@/theme/colors/themes/dark'

/**
 * Define theme.
 * @param {string} mode - Dark or light
 * @returns {object} - Theme
 */
const theme = (mode: "light" | "dark") => {
  
  // Get colors depending of the mode
  const baseTokens = useMemo(() => { return mode === 'light' ? light : dark }, [mode])
  
  return {
    typography: {
      fontFamily: ['Inter'],      
      h1: {
        fontSize: '40px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '48px',
        color: baseTokens.text.headings,
      },
    },

    components: {
    },
  };
};

export { theme }