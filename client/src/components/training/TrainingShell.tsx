import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useTraining } from "@/contexts/TrainingContext";

export default function TrainingShell({ children }: { children: ReactNode }) {
  const { currentEmployee, signOut } = useTraining();

  useEffect(() => {
    document.title = "Team Training · Akkaya Hospitality Group";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Dark chrome — the app reads as the house manual, not a web page */}
      <header className="bg-charcoal text-cream grain sticky top-0 z-10">
        <div className="relative z-[2] max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <Link href="/training" className="flex items-center gap-3 min-w-0 shrink group">
            <span className="monogram !w-9 !h-9 !text-base !text-gold-light !border-gold-light/50">
              A
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block font-body text-[10px] tracking-[0.32em] uppercase text-cream/85 truncate">
                Akkaya Hospitality Group
              </span>
              <span className="block font-accent italic text-[15px] text-gold-light leading-none mt-1">
                The House Manual
              </span>
            </span>
          </Link>

          {currentEmployee && (
            <div className="flex items-center gap-2 sm:gap-6 shrink-0">
              <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-sm text-cream/90">{currentEmployee.name}</span>
                <span className="font-body text-[10px] tracking-[0.18em] uppercase text-cream/45">
                  {currentEmployee.role} · {currentEmployee.location}
                </span>
              </div>
              {currentEmployee.role === "Manager" && (
                <Link
                  href="/training/admin"
                  className="link-line inline-flex items-center gap-1.5 text-gold-light font-body text-[10px] tracking-[0.22em] uppercase"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors duration-300 font-body text-[10px] tracking-[0.22em] uppercase"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
        {/* gold hairline base */}
        <div className="relative z-[2] h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </header>

      <main className="w-full flex-1">{children}</main>

      <footer className="bg-charcoal text-cream grain mt-16">
        <div className="relative z-[2] max-w-6xl mx-auto px-5 py-7">
          <div className="flex items-center justify-between gap-4">
            <span className="font-accent italic text-sm text-cream/40 tracking-wide">
              Café Figaro · Andiamo in Banca · Don Giovanni
            </span>
            <span className="font-body text-[9px] tracking-[0.28em] uppercase text-cream/35 text-right">
              Confidential — for team use only
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
