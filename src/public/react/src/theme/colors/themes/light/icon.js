

import {
  error,
  information,
  neutral,
  primary,
  success,
  warning,
} from '@/theme/colors/aliases'

export const icon = {
  primary: neutral.default,
  disabled: neutral[400],
  information: information.default,
  success: success.default,
  onAction: neutral.white,
  onAction2: neutral.white,
  onDisabled: neutral[700],
  warning: warning.default,
  error: error.default,
  action: primary.default,
  actionHover: primary[700],
  focus: primary[700],
}
