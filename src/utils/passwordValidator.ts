export interface PasswordValidationRequirements {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  requirements: PasswordValidationRequirements;
  strength: 'Weak' | 'Fair' | 'Good' | 'Strong';
  error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements: PasswordValidationRequirements = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password)
  };

  const isValid = 
    requirements.hasMinLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar;

  let score = 0;
  if (requirements.hasMinLength) score += 1;
  if (password.length >= 10) score += 1;
  if (requirements.hasUppercase && requirements.hasLowercase) score += 1;
  if (requirements.hasNumber) score += 1;
  if (requirements.hasSpecialChar) score += 1;

  let strength: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (!password || password.length < 8) {
    strength = 'Weak';
  } else if (score >= 4 && isValid) {
    strength = 'Strong';
  } else if (score >= 3) {
    strength = 'Good';
  } else if (score >= 2) {
    strength = 'Fair';
  } else {
    strength = 'Weak';
  }

  let error: string | undefined;
  if (!password) {
    error = 'Password is required.';
  } else if (!requirements.hasMinLength) {
    error = 'Password must be at least 8 characters long.';
  } else if (!isValid) {
    error = 'Password must include uppercase, lowercase, number, and special character.';
  }

  return {
    isValid,
    requirements,
    strength,
    error
  };
}
