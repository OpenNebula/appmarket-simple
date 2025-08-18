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
    placeholderText: css({
      color: baseTokens.text.disabled,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: `${fontSize.body.md.desktop}px`,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.md.desktop,
    }),
    switchToggleGroup: css ({      
      width: '100%',
    }),
    switchToggleButton: css({
      '&&': {
        color: baseTokens.icon.primary,
        padding: `${scale[300]}px ${scale[400]}px ${scale[300]}px ${scale[300]}px`,
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
        lineHeight: `${lineHeight.body.sm.desktop}px`,
        textTransform: 'none',
      }
    }),
    switchToggleButtonFirst: css({
      borderRight: 'none !important',
    })    
  };
};

export default styles