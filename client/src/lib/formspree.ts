// Formspree form submission helper
// To set up: Go to https://formspree.io, create a free account,
// create a form, and paste your form ID below.
// Free tier: 50 submissions/month — plenty for inquiries.

const FORMSPREE_FORM_ID = "mvzvwbdz";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

/**
 * Spread onto every inquiry <form>. The pages are prerendered, so a form is on
 * screen and usable before the script has loaded, and stays that way if the
 * script never arrives. Without these two attributes, pressing the button in
 * that state made the browser GET the page itself: the inquiry was lost and
 * the guest's name, email and phone ended up in the address bar. With them the
 * browser posts the fields straight to Formspree, so the inquiry is delivered
 * (Formspree shows its own thank-you page). Once React is running, each
 * onSubmit handler calls preventDefault and sends the request itself, so
 * visitors with a working script never see this path.
 */
export const NO_SCRIPT_POST = { method: "post", action: FORMSPREE_ENDPOINT } as const;

export async function submitForm(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * The values that are actually in the form when it is submitted, keyed by each
 * field's `name`.
 *
 * The forms keep their values in React state, which only updates on real input
 * events. Software that fills a form without typing (AI agents, some autofill
 * and accessibility tools) sets the fields directly, so the state stayed empty
 * and the form sent a blank inquiry while showing the visitor a completed one.
 * Every submit handler therefore merges these values over its state: for a
 * person typing the two are identical, and for anything else the form sends
 * what is on screen.
 */
export function formValues(form: HTMLFormElement): Record<string, string> {
  const values: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") values[key] = value;
  });
  return values;
}
