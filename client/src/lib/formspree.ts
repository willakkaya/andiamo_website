// Formspree form submission helper
// To set up: Go to https://formspree.io, create a free account,
// create a form, and paste your form ID below.
// Free tier: 50 submissions/month — plenty for inquiries.

const FORMSPREE_FORM_ID = "mvzvwbdz";

export async function submitForm(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
