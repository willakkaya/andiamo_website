/**
 * The two fields every inquiry carries besides what the guest types: the email
 * subject line and which form it came from. The submit handlers add these
 * themselves; these hidden inputs carry them when the form is posted without
 * the script (see NO_SCRIPT_POST in lib/formspree.ts).
 */
export default function InquiryFormMeta({ subject, source }: { subject: string; source: string }) {
  return (
    <>
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="source" value={source} />
    </>
  );
}
