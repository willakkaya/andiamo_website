import { useState } from "react";
import { tierShareUrl, TIER_BY_KEY, type MenuTier } from "@/data/eventMenus";
import { trackTierLinkCopy } from "@/lib/analytics";

/* A real link to the tier's anchor that also copies the shareable URL.
   Without clipboard access it simply behaves as the link it is. */
export default function CopyLinkButton({ tier, className = "" }: { tier: MenuTier; className?: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard?.writeText) return; // native hash navigation takes over
    e.preventDefault();
    navigator.clipboard.writeText(tierShareUrl(tier)).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        trackTierLinkCopy(tier);
      },
      () => {
        window.location.hash = TIER_BY_KEY[tier].anchor;
      },
    );
  };

  return (
    <span className={className}>
      <a
        href={`#${TIER_BY_KEY[tier].anchor}`}
        onClick={onClick}
        className="link-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
      >
        Copy link to this menu
      </a>
      <span aria-live="polite" className="ml-3 normal-case tracking-normal font-accent italic text-sm text-charcoal/70">
        {copied ? "Link copied" : ""}
      </span>
    </span>
  );
}
