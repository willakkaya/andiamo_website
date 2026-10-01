import { LINKS } from "@/lib/images";
import { trackTextClick } from "@/lib/analytics";

/* The restaurant's text line. One link so the number, the sms: target and the
   tracking stay in one place. `location` is the analytics label. */
export default function TextLink({
  location,
  className = "",
  label = "Text",
}: {
  location: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={LINKS.textHref}
      onClick={() => trackTextClick(location)}
      aria-label={`Text the restaurant at ${LINKS.text}`}
      className={`lining-nums whitespace-nowrap ${className}`}
    >
      {label} {LINKS.text}
    </a>
  );
}
