// Import emotion to create css classes
import { css } from '@emotion/css'

// Import not colors variables
import { fontSize, lineHeight, border } from '@/theme/responsive'
import { scale } from '@/theme/brand'

// Color definition of modes
import { light } from '@/theme/colors/themes/light';
import { dark } from '@/theme/colors/themes/dark';

const styles = (theme) => {

  const baseTokens = theme.palette.mode === 'light' ? light : dark;

  return {
    switchView: css({
      alignSelf: 'flex-end',
      marginBottom: '10px',
    }),
    switchToggleButton: css({
      '&&': {
        color: baseTokens.icon.action,
        padding: `${scale[200]}px ${scale[500]}px`,
        borderRadius: border.radius.xlg,
        border: `${border.width.sm}px solid ${baseTokens.border.action2}`,
        '& svg': {
          width: '16px',
          height: '16px',
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      '&&.Mui-selected': {
        backgroundColor: baseTokens.surface.focus2,
        color: baseTokens.icon.focus,
        '&:hover': {
          backgroundColor: baseTokens.surface.focus,
        },
      },
      '&& .MuiTypography-root': {
        color: baseTokens.text.body,
        fontSize: fontSize.body.sm.desktop,
        fontWeight: 500,
        fontStyle: 'normal',
        lineHeight: `${lineHeight.body.sm.desktop}px`,
        textTransform: 'none',
      }
    })
  }
}

export default styles