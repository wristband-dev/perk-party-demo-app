import { WristbandRestError } from '@/types';

export function isDuplicateNewEmail(error: WristbandRestError) {
  return (
    error.violations &&
    error.violations.newEmail &&
    error.violations.newEmail.map((item) => item.code).includes('not_unique')
  );
}

export function isInvalidNewEmail(error: WristbandRestError) {
  return (
    error.violations &&
    error.violations.newEmail &&
    error.violations.newEmail.map((item) => item.code).includes('invalid_email')
  );
}

export function isPasswordBreached(error: WristbandRestError) {
  return (
    error.violations &&
    error.violations.newPassword &&
    error.violations.newPassword.map((item) => item.code).includes('password_breached')
  );
}
