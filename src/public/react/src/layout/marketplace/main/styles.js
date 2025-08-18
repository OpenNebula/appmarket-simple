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
    container: css({
      marginLeft: '44px',
      marginRight: '44px',
    }),
    title: css({
      marginTop: '48px',
      marginBottom: '48px',
    }),
    toolbar: css({
      marginBottom: '20px',
    })
  }
}

export default styles