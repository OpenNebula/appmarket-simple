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
    containerActions: css({
      gap: scale[200],
      justifyContent: 'flex-end',
    }),
    actionIcon: css({
      '& svg': {
        width: '16px',
        height: '16px',
      }      
    })
  };
};

export default styles