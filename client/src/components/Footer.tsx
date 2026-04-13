import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Instagram, ExternalLink } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/images";

export default function Footer() {
  return (
    <footer>
      {/* Pre-footer CTA — warm cream background */}
      <div className="section-padding bg-background text-center">
        <div className="ornament-line mb-8" />
        <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/60 mb-4">
          Experience the Extraordinary
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-8">
          Reserve Your Table
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={LINKS.opentable}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-12 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
          >
            Book on OpenTable
          </a>
          <a
            href={LINKS.onlineOrdering}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-12 py-4 border border-charcoal/15 text-charcoal font-body text-[12px] tracking-[0.2em] uppercase hover:border-charcoal/30 transition-all duration-500"
          >
            Order Online <ExternalLink size={13} />
          </a>
        </div>
        <p className="text-charcoal/40 text-sm mt-5 font-accent tracking-wide">
          Or call us at{" "}
          <a href="tel:+16507458811" className="text-gold hover:text-gold-light transition-colors">
            {LINKS.phone}
          </a>
        </p>
      </div>

      {/* Footer Grid — espresso background, warmer than charcoal */}
      <div className="bg-espresso">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <img src={IMAGES.logo} alt="Andiamo in Banca" className="h-14 w-auto mb-5 brightness-0 invert opacity-80" />
              <p className="text-cream/50 text-sm leading-relaxed font-accent tracking-wide">
                Upscale Italian dining in a beautifully restored historic bank building.
                South San Francisco's most unique culinary destination.
              </p>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold mb-6 flex items-center gap-2">
                <Clock size={13} />
                Hours
              </h4>
              <div className="space-y-3 text-sm font-accent tracking-wide">
                <div className="flex justify-between gap-4">
                  <span className="text-cream/50">Monday</span>
                  <span className="text-cream/30">Closed</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cream/50">Tue – Fri</span>
                  <span className="text-cream/70">11am – 2pm, 4pm – 9pm</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cream/50">Sat – Sun</span>
                  <span className="text-cream/70">4pm – 9pm</span>
                </div>
                <div className="pt-3 border-t border-cream/10">
                  <span className="text-gold/60 text-xs tracking-wider">Happy Hour &middot; Tue–Fri 4–5pm</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold mb-6">
                Contact
              </h4>
              <div className="space-y-4 text-sm">
                <a
                  href="https://maps.google.com/?q=301+Linden+Avenue+South+San+Francisco+CA+94080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-cream/50 hover:text-cream/80 transition-colors"
                >
                  <MapPin size={15} className="text-gold/50 mt-0.5 shrink-0" />
                  <span className="font-accent tracking-wide">301 Linden Avenue<br />South San Francisco, CA 94080</span>
                </a>
                <a href="tel:+16507458811" className="flex items-center gap-3 text-cream/50 hover:text-cream/80 transition-colors">
                  <Phone size={15} className="text-gold/50 shrink-0" />
                  <span className="font-accent tracking-wide">{LINKS.phone}</span>
                </a>
                <a href={`mailto:${LINKS.email}`} className="flex items-center gap-3 text-cream/50 hover:text-cream/80 transition-colors">
                  <Mail size={15} className="text-gold/50 shrink-0" />
                  <span className="font-accent tracking-wide">{LINKS.email}</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-body text-[11px] tracking-[0.25em] uppercase text-gold mb-6">
                Explore
              </h4>
              <div className="space-y-3 text-sm font-accent tracking-wide">
                <Link href="/menu" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  Dinner Menu
                </Link>
                <Link href="/the-vault" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  The Vault &mdash; Private Dining
                </Link>
                <Link href="/corporate-dining" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  Corporate Events
                </Link>
                <Link href="/banquet-catering" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  Banquet & Catering
                </Link>
                <Link href="/gallery" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  Gallery
                </Link>
                <Link href="/our-story" className="block text-cream/50 hover:text-cream/80 transition-colors">
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/8 py-6">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-cream/30 tracking-wider">
              &copy; {new Date().getFullYear()} Andiamo in Banca. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/40 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={LINKS.yelp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cream/40 hover:text-gold transition-colors tracking-wider"
              >
                <span className="text-gold/60">&#9733;</span> 4.2 on Yelp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
