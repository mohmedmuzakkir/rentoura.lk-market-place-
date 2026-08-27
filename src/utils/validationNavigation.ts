export interface ValidationFieldRegistration {
  key: string;
  step: number;
  id: string;
}

function focusRegisteredField(id: string): void {
  const root = document.getElementById(id);
  if (!root) return;
  const target = root.matches('input,select,textarea,button,[tabindex]')
    ? root as HTMLElement
    : root.querySelector<HTMLElement>('input,select,textarea,button,[tabindex]') || root;
  const top = root.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  target.focus({ preventScroll: true });
}

export function focusFirstInvalidField(
  errors: Record<string, string>,
  registry: ValidationFieldRegistration[],
  activeStep: number,
  activateStep: (step: number) => void,
): ValidationFieldRegistration | null {
  const field = registry.find(item => Boolean(errors[item.key]));
  if (!field) return null;
  if (field.step !== activeStep) activateStep(field.step);
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => focusRegisteredField(field.id)));
  return field;
}
