import { useEffect, type RefObject } from "react";
import { formValues } from "@/lib/formspree";

/**
 * The pages are prerendered, so a form's fields are on screen and usable before
 * React is running. Whatever a visitor typed in that gap, or the browser put
 * back after a reload, is in the fields but not in React state, and the next
 * re-render would wipe it. Call this once per form: at the moment React takes
 * over, `adopt` receives the fields that already hold something so the
 * component can copy them into its state.
 */
export function useAdoptFormValues(
  formRef: RefObject<HTMLFormElement | null>,
  adopt: (found: Record<string, string>) => void,
): void {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const found = Object.fromEntries(
      Object.entries(formValues(form)).filter(([key, value]) => value !== "" && key !== "_subject" && key !== "source"),
    );
    if (Object.keys(found).length > 0) adopt(found);
    // Runs once, when React takes over the prerendered form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** `state` with every key it already has replaced by the value found in the form, if any. */
export function withFound<T extends Record<string, string>>(state: T, found: Record<string, string>): T {
  const next = { ...state };
  for (const key of Object.keys(state)) {
    if (found[key] !== undefined) (next as Record<string, string>)[key] = found[key];
  }
  return next;
}
