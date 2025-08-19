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
    imageContainer: css({
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      display: 'block',
      borderRadius: '8px',
      border: `1px solid ${baseTokens.border.primary}`,
    }),
    textContainer: css ({
      marginBottom: scale[100],
    }),
    titleApp: css ({
      color: baseTokens.text.headings,      
      fontSize: fontSize.body.lg.desktop,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: lineHeight.body.lg,
    }),
    descriptionApp: css ({
      color: baseTokens.text.body,
      fontSize: fontSize.body.sm.desktop,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: lineHeight.body.sm,
    }),
    attributesTitle: css({
      color: baseTokens.text.body,
      textAlign: 'center',      
      fontSize: fontSize.body.caption.desktop,
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: lineHeight.body.caption.desktop,      
    }),
    attributesValue: css({
      color: baseTokens.text.headings,
      textAlign: 'center',            
      fontSize: fontSize.body.md.desktop,
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: lineHeight.body.md.desktop,
    }),
    menuIcon: css({
      color: baseTokens.icon.primary,
      marginTop: '-15px',
      '& svg': {
        width: '24px',
        height: '24px',
      },
    }),
    menuOption: css({
      display: 'flex',
      gap: scale[200],
    }),
    menuOptionText: css({
      color: baseTokens.text.body,      
      fontSize: fontSize.body.sm.desktop,
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: lineHeight.body.sm.desktop,
    }),
  };
};

export default styles