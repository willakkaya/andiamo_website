import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTraining } from "@/contexts/TrainingContext";

export default function TrainingShell({ children }: { children: ReactNode }) {
  const { currentEmployee, signOut } = useTraining();

  useEffect(() => {
    document.title = "Team Training · Akkaya Hospitality Group";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/training" className="flex items-center gap-3 min-w-0 shrink">
            <span className="monogram !w-9 !h-9 !text-base">A</span>
            <span className="min-w-0 leading-tight">
              <span className="block font-body text-[11px] tracking-[0.26em] uppercase font-medium truncate">
                Akkaya Hospitality Group
              </span>
              <span className="block font-accent italic text-sm text-gold leading-none mt-0.5">
                Team Training
              </span>
            </span>
          </Link>

          {currentEmployee && (
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-sm font-medium">{currentEmployee.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currentEmployee.role} · {currentEmployee.location}
                </span>
              </div>
              {currentEmployee.role === "Manager" && (
                <Link
                  href="/training/admin"
                  className="link-line inline-flex items-center gap-1.5 text-gold font-body text-[11px] tracking-[0.18em] uppercase px-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-1 px-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-xs tracking-wide">Sign out</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {children}
      </main>

      <footer className="max-w-5xl w-full mx-auto px-4 pb-8 pt-4">
        <div className="divider-diamond mb-4">
          <i />
        </div>
        <p className="text-center font-body text-[10px] tracking-[0.24em] uppercase text-muted-foreground/70">
          Akkaya Hospitality Group · Confidential — For Team Use Only
        </p>
      </footer>
    </div>
  );
}
