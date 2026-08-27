const isEnabled = (value: string | undefined): boolean => value?.trim().toLowerCase() === 'true';

export const featureFlags = Object.freeze({
  googleAuth: isEnabled(import.meta.env.VITE_GOOGLE_AUTH_ENABLED),
});
