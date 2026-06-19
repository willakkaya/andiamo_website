import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTraining,
  isCertified,
} from "@/contexts/TrainingContext";
import { requiredModulesFor } from "@/lib/training/content";

export default function TrainingCertificate() {
  const { currentEmployee } = useTraining();
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Certificate · Akkaya Hospitality Group";
    if (!currentEmployee) navigate("/training");
  }, [currentEmployee, navigate]);

  if (!currentEmployee) return null;

  if (!isCertified(currentEmployee)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Award className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <h1 className="font-display text-2xl mb-2">Not yet available</h1>
          <p className="text-muted-foreground mb-4">
            Your certificate unlocks once you've passed every required module and
            signed the standards acknowledgment.
          </p>
          <Link href="/training">
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to training
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const required = requiredModulesFor(currentEmployee.role, currentEmployee.location);
  const signedDate = new Date(
    currentEmployee.acknowledgedAt as string,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      {/* Controls — hidden when printing */}
      <div className="print:hidden max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/training">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to training
          </Button>
        </Link>
        <Button size="sm" onClick={() => window.print()} className="gap-1">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </Button>
      </div>

      {/* Certificate */}
      <div className="max-w-3xl mx-auto px-4 pb-12 print:p-0 print:max-w-none">
        <div className="bg-warm-white border-4 border-double border-gold/60 rounded-sm p-10 sm:p-14 text-center shadow-sm print:shadow-none print:border-gold">
          <div className="mb-6">
            <div className="font-display text-2xl tracking-[0.15em] text-foreground">
              AKKAYA HOSPITALITY GROUP
            </div>
            <div className="text-xs tracking-wide text-muted-foreground mt-1">
              Café Figaro · Andiamo in Banca · Don Giovanni
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="rounded-full border-2 border-gold/50 p-3">
              <Award className="w-8 h-8 text-gold" />
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl mb-2">
            Certificate of Completion
          </h1>
          <p className="text-muted-foreground mb-8">
            Front of House Operations &amp; Hospitality Training
          </p>

          <p className="text-sm text-muted-foreground">This certifies that</p>
          <p className="font-display text-3xl sm:text-4xl text-gold my-3">
            {currentEmployee.name}
          </p>
          <p className="max-w-lg mx-auto text-foreground/90">
            has successfully completed all {required.length} modules required for
            the role of <strong>{currentEmployee.role}</strong> at{" "}
            <strong>{currentEmployee.location}</strong>, demonstrating mastery of
            the standards of warmth, precision, passion, and pride.
          </p>

          <div className="flex justify-between items-end gap-6 mt-12 max-w-md mx-auto">
            <div className="flex-1 text-center">
              <div className="border-b border-foreground/40 pb-1 font-display text-lg italic">
                {currentEmployee.signatureName}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Signed</div>
            </div>
            <div className="flex-1 text-center">
              <div className="border-b border-foreground/40 pb-1 text-sm">
                {signedDate}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Date</div>
            </div>
          </div>

          <p className="text-[10px] tracking-wide text-muted-foreground mt-10">
            Akkaya Hospitality Group · Confidential — For Team Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
