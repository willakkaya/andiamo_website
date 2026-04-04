import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Instagram, ExternalLink } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/images";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90">
      {/* Pre-footer CTA */}
      <div className="section-padding text-center">
        <div className="ornament-line !bg-gold/25 mb-8" />
        <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold-light/50 mb-4">
          Experience the Extraordinary
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-cream mb-8">
          Reserve Your Table
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={LINKS.opentable}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-12 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-500"
          >
            Book on OpenTable
          </a>
          <a
            href={LINKS.onlineOrdering}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-12 py-4 border border-cream/15 text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-cream/5 transition-all duration-500"
          >
            Order Online <ExternalLink size={13} />
          </a>
        </div>
        <p className="text-cream/30 text-sm mt-5 font-accent tracking-wide">
          Or call us at{" "}
          <a href="tel:+16507458811" className="text-gold-light/60 hover:text-gold-light transition-colors">
            {LINKS.phone}
          </a>
        </p>
      </div>

      <div className="divider-gold" />

      {/* Footer Grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <img src={IMAGES.logo} alt="Andiamo in Banca" className="h-14 w-auto mb-5 brightness-0 invert opacity-70" />
            <p className="text-cream/35 text-sm leading-relaxed font-accent tracking-wide">
              Upscale Italian dining in a beautifully restored historic bank building.
              South San Francisco's most unique culinary destination.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold-light/50 mb-6 flex items-center gap-2">
              <Clock size={13} />
              Hours
            </h4>
            <div className="space-y-3 text-sm text-cream/40 font-accent tracking-wide">
              <div className="flex justify-between gap-4">
                <span>Monday</span>
                <span className="text-cream/25">Closed</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Tue – Fri</span>
                <span className="text-cream/50">11am – 2pm, 4pm – 9pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Sat – Sun</span>
                <span className="text-cream/50">4pm – 9pm</span>
              </div>
              <div className="pt-3 border-t border-cream/8">
                <span className="text-gold-light/40 text-xs tracking-wider">Happy Hour &middot; Tue–Fri 4–5pm</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold-light/50 mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm text-cream/40">
              <a
                href="https://maps.google.com/?q=301+Linden+Avenue+South+San+Francisco+CA+94080"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-cream/70 transition-colors"
              >
                <MapPin size={15} className="text-gold/30 mt-0.5 shrink-0" />
                <span className="font-accent tracking-wide">301 Linden Avenue<br />South San Francisco, CA 94080</span>
              </a>
              <a href="tel:+16507458811" className="flex items-center gap-3 hover:text-cream/70 transition-colors">
                <Phone size={15} className="text-gold/30 shrink-0" />
                <span className="font-accent tracking-wide">{LINKS.phone}</span>
              </a>
              <a href={`mailto:${LINKS.email}`} className="flex items-center gap-3 hover:text-cream/70 transition-colors">
                <Mail size={15} className="text-gold/30 shrink-0" />
                <span className="font-accent tracking-wide">{LINKS.email}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold-light/50 mb-6">
              Explore
            </h4>
            <div className="space-y-3 text-sm font-accent tracking-wide">
              <Link href="/menu" className="block text-cream/40 hover:text-cream/70 transition-colors">
                Dinner Menu
              </Link>
              <Link href="/the-vault" className="block text-cream/40 hover:text-cream/70 transition-colors">
                The Vault &mdash; Private Dining
              </Link>
              <Link href="/corporate-dining" className="block text-cream/40 hover:text-cream/70 transition-colors">
                Corporate Events
              </Link>
              <Link href="/gallery" className="block text-cream/40 hover:text-cream/70 transition-colors">
                Gallery
              </Link>
              <Link href="/our-story" className="block text-cream/40 hover:text-cream/70 transition-colors">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/6 py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/25 tracking-wider">
            &copy; {new Date().getFullYear()} Andiamo in Banca. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/30 hover:text-gold-light transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href={LINKS.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cream/30 hover:text-gold-light transition-colors tracking-wider"
            >
              <span className="text-gold/50">&#9733;</span> 4.2 on Yelp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
