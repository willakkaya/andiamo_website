import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTraining } from "@/contexts/TrainingContext";

export default function TrainingShell({ children }: { children: ReactNode }) {
  const { currentEmployee, signOut } = useTraining();

  useEffect(() => {
    document.title = "Team Training · Akkaya Hospitality Group";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/training" className="flex items-center gap-2 min-w-0 shrink">
            <GraduationCap className="w-5 h-5 text-gold shrink-0" />
            <span className="font-display text-lg tracking-wide whitespace-nowrap truncate">
              Akkaya Hospitality Group{" "}
              <span className="text-gold hidden sm:inline">· Team Training</span>
            </span>
          </Link>

          {currentEmployee && (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-medium">{currentEmployee.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currentEmployee.role} · {currentEmployee.location}
                </span>
              </div>
              {currentEmployee.role === "Manager" && (
                <Link href="/training/admin">
                  <Badge variant="secondary" className="cursor-pointer gap-1">
                    <LayoutDashboard className="w-3 h-3" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Badge>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 px-2 sm:px-3">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        Akkaya Hospitality Group · Confidential — For Team Use Only
      </footer>
    </div>
  );
}
