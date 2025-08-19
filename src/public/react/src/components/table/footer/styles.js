// Import emotion to create css classes
import { css } from '@emotion/css'

// Import not colors variables
import { fontSize, lineHeight } from '@/theme/responsive'
import { scale } from '@/theme/brand'

import { light } from '@/theme/colors/themes/light';
import { dark } from '@/theme/colors/themes/dark';

const styles = (theme) => {
  const baseTokens = theme.palette.mode === 'light' ? light : dark;

  return {
    footerContainer: css({
      paddingTop: scale[600],
      paddingBottom: scale[600],
      gap: scale[200],
      flexGrow: 1,
    }),
    footerIcons: css({
      '& svg': {
        width: '24px',
        height: '24px',
      }      
    }),
    pagesText: css({
      color: baseTokens.text.body,
      fontSize: fontSize.body.md.desktop,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.md,
    }),
    resultsText: css({
      color: baseTokens.text.action,
      textAlign: 'center',
      fontSize: fontSize.body.sm.desktop,
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: lineHeight.body.sm,
    }),
    sizePageText: css({
      '& .MuiSelect-select': {
        color: baseTokens.text.disabled,
        fontSize: fontSize.body.md.desktop,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: lineHeight.body.md,
      }
    })
  };
};

export default styles