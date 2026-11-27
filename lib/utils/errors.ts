/**
 * Maps backend error messages to i18n translation keys
 */
export function mapAuthError(backendError: string | undefined): string {
  if (!backendError) return 'unexpectedError';

  const errorMap: Record<string, string> = {
    'email already registered': 'emailAlreadyRegistered',
    'invalid credentials': 'invalidCredentials',
    'Unauthorized': 'unauthorized',
  };

  return errorMap[backendError] || 'unexpectedError';
}

/**
 * Maps validation error messages to i18n translation keys
 */
export function mapValidationError(field: string, rule: string): string {
  const validationMap: Record<string, Record<string, string>> = {
    email: {
      invalid: 'emailInvalid',
      required: 'emailRequired',
    },
    password: {
      required: 'passwordRequired',
      minLength: 'passwordMinLength',
    },
    name: {
      minLength: 'nameMinLength',
    },
    terms: {
      refine: 'termsRequired',
    },
  };

  return validationMap[field]?.[rule] || 'unexpectedError';
}
