import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  Award,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTraining,
  ROLES,
  LOCATIONS,
  overallCompletion,
  weakAreas,
  electivePassCount,
  isFullyTrained,
  isCertified,
  type ModuleProgress,
  type Role,
  type Location,
} from "@/contexts/TrainingContext";
import {
  MODULES,
  electiveModulesFor,
  requiredModulesFor,
  type TrainingModule,
} from "@/lib/training/content";
import TrainingShell from "@/components/training/TrainingShell";

function SignIn() {
  const { signIn } = useTraining();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [location, setLocation] = useState<Location | "">("");
  const [pin, setPin] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pinValid = /^\d{4}$/.test(pin);
  const canStart =
    name.trim().length > 1 &&
    role &&
    location &&
    pinValid &&
    (role !== "Manager" || managerCode.length > 0);

  const handleSignIn = async () => {
    if (!canStart || submitting) return;
    setSubmitting(true);
    setError("");
    const res = await signIn({
      name,
      role: role as Role,
      location: location as Location,
      pin,
      managerCode: role === "Manager" ? managerCode : undefined,
    });
    if (!res.ok) setError(res.error ?? "Could not sign in");
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto pt-4 sm:pt-10">
      <div className="text-center mb-10">
        <p className="eyebrow mb-4">Akkaya Hospitality Group</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-3">
          Welcome to
          <br />
          the team.
        </h1>
        <p className="font-accent italic text-lg text-muted-foreground tracking-wide">
          Café Figaro · Andiamo in Banca · Don Giovanni
        </p>
      </div>

      <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            Your name
          </Label>
          <Input
            id="name"
            placeholder="e.g. Maria Rossi"
            className="h-11 rounded-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            Role
          </Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="!h-11 rounded-none w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            Restaurant
          </Label>
          <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
            <SelectTrigger className="!h-11 rounded-none w-full">
              <SelectValue placeholder="Select your restaurant" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin" className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            4-digit PIN
          </Label>
          <Input
            id="pin"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            placeholder="••••"
            className="h-11 rounded-none tracking-[0.5em]"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
          <p className="text-xs text-muted-foreground">
            New here? Pick any 4-digit PIN — it'll be yours from now on.
          </p>
        </div>
        {role === "Manager" && (
          <div className="space-y-2">
            <Label htmlFor="managerCode" className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
              Manager access code
            </Label>
            <Input
              id="managerCode"
              type="password"
              autoComplete="off"
              placeholder="Required for the team dashboard"
              className="h-11 rounded-none"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          className="w-full h-12 rounded-none font-body text-[12px] tracking-[0.2em] uppercase font-semibold"
          disabled={!canStart || submitting}
          onClick={handleSignIn}
        >
          {submitting ? "Signing in…" : "Start Training"}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Managers: choose the "Manager" role and enter your access code to see
          the team dashboard.
        </p>
      </div>
    </div>
  );
}

/** Editorial numbered row — the module list reads like a table of contents. */
function ModuleRow({
  module: m,
  progress: p,
  elective,
  showAudience,
}: {
  module: TrainingModule;
  progress: ModuleProgress | undefined;
  elective?: boolean;
  /** Manager view: show location + who the module is required for. */
  showAudience?: boolean;
}) {
  const status = p?.passed
    ? "passed"
    : p && p.attempts > 0
      ? "in-progress"
      : "not-started";

  return (
    <Link
      href={`/training/module/${m.id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 sm:gap-x-6 border-t border-border/70 py-5 sm:py-6 transition-colors hover:bg-accent/40 -mx-2 px-2"
    >
      <span className="font-display text-2xl sm:text-3xl leading-none text-gold/45 group-hover:text-gold transition-colors w-9 text-right">
        {String(m.order).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-lg sm:text-xl leading-snug">
            {m.title}
          </span>
          {elective && (
            <span className="font-body text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              Elective
            </span>
          )}
        </span>
        <span className="block text-sm text-muted-foreground mt-1 leading-relaxed">
          {m.summary}
        </span>
        <span className="block font-body text-[10px] tracking-[0.16em] uppercase text-muted-foreground/80 mt-2">
          {m.minutes} min · {m.quiz.length} questions
          {p?.attempts ? ` · best ${Math.round(p.bestPct * 100)}%` : ""}
          {showAudience && (
            <>
              {" · "}
              {m.location ?? "All restaurants"}
              {" · "}
              {m.requiredFor.length === ROLES.length
                ? "Everyone"
                : m.requiredFor.join(", ")}
            </>
          )}
        </span>
      </span>
      <span className="self-center text-right">
        {status === "passed" ? (
          <span className="inline-flex items-center gap-1.5 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline font-body text-[10px] tracking-[0.18em] uppercase">
              Passed
            </span>
          </span>
        ) : (
          <span className="link-line inline-flex items-center gap-1.5 text-gold font-body text-[11px] tracking-[0.18em] uppercase">
            <span className="hidden sm:inline">
              {showAudience ? "Review" : status === "in-progress" ? "Continue" : "Begin"}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </span>
    </Link>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker?: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mt-12 mb-2">
      {kicker && <p className="eyebrow mb-2">{kicker}</p>}
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="font-display text-2xl">{title}</h2>
        {note && <span className="text-sm text-muted-foreground">{note}</span>}
      </div>
    </div>
  );
}

function ManagerHome() {
  const { currentEmployee, allEmployees, refreshTeam } = useTraining();
  // Load the roster so the dashboard card shows live counts.
  useEffect(() => {
    refreshTeam();
  }, [refreshTeam]);
  const trainees = allEmployees.filter((e) => e.role !== "Manager");
  const needsAttention = trainees.filter((e) => weakAreas(e).length > 0).length;

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-3">Team Training</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-none mb-2">
          Ciao, {currentEmployee?.name.split(" ")[0]}.
        </h1>
        <p className="font-accent italic text-lg text-muted-foreground tracking-wide">
          Manage your team's training and review the curriculum below.
        </p>
      </div>

      {/* Primary manager CTA */}
      <Card className="mb-4 rounded-none border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-gold/10 p-2.5 shrink-0">
              <LayoutDashboard className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl leading-tight">Team Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {trainees.length === 0
                  ? "Track each employee's progress once staff start training."
                  : `${trainees.length} team ${trainees.length === 1 ? "member" : "members"}` +
                    (needsAttention > 0
                      ? ` · ${needsAttention} need${needsAttention === 1 ? "s" : ""} attention`
                      : " · everyone on track")}
              </p>
            </div>
          </div>
          <Link href="/training/admin">
            <Button className="gap-1 shrink-0 rounded-none font-body text-[11px] tracking-[0.18em] uppercase font-semibold">
              Open dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <SectionHeading
        kicker="Reference"
        title="The curriculum"
        note={`${MODULES.length} modules your staff complete`}
      />
      <div className="border-b border-border/70">
        {MODULES.map((m) => (
          <ModuleRow key={m.id} module={m} progress={undefined} showAudience />
        ))}
      </div>
    </div>
  );
}

function SignOffCard() {
  const { currentEmployee, recordAcknowledgment } = useTraining();
  const [signature, setSignature] = useState("");
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState("");
  if (!currentEmployee) return null;

  // Certified — show the certificate link.
  if (isCertified(currentEmployee)) {
    return (
      <Card className="mb-8 rounded-none border-green-600/40 bg-gradient-to-br from-green-600/5 to-transparent">
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-600/10 p-2.5 shrink-0">
              <Award className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h2 className="font-display text-xl leading-tight">You're certified!</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                You've completed all training for {currentEmployee.role} and signed
                the standards. Grazie.
              </p>
            </div>
          </div>
          <Link href="/training/certificate">
            <Button className="gap-1 shrink-0 rounded-none font-body text-[11px] tracking-[0.18em] uppercase font-semibold">
              <Award className="w-4 h-4" /> View certificate
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Fully trained but not yet signed — show the acknowledgment.
  if (!isFullyTrained(currentEmployee)) return null;

  const canSign = signature.trim().length > 1;
  const handleSign = async () => {
    if (!canSign || signing) return;
    setSigning(true);
    setError("");
    const res = await recordAcknowledgment(signature);
    if (!res.ok) setError(res.error ?? "Could not save your signature");
    setSigning(false);
  };
  return (
    <Card className="mb-8 rounded-none border-gold/50 bg-gradient-to-br from-gold/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-gold" />
          <CardTitle className="font-display text-xl">
            One last step — sign the standards
          </CardTitle>
        </div>
        <CardDescription className="mt-2">
          You've passed every module required for your role. By signing below, you
          acknowledge that you have read, understand, and agree to follow all
          expectations and standards set forth in the Akkaya Hospitality Group
          handbook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-accent italic text-base text-muted-foreground tracking-wide">
          "Hospitality is a choice we make — moment by moment — to lift the
          experience of another human being."
        </p>
        <div className="space-y-2">
          <Label htmlFor="signature" className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            Type your full name to sign
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="signature"
              placeholder={currentEmployee.name}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="font-display text-lg h-11 rounded-none"
            />
            <Button
              disabled={!canSign || signing}
              onClick={handleSign}
              className="gap-1 shrink-0 h-11 rounded-none font-body text-[11px] tracking-[0.18em] uppercase font-semibold"
            >
              <PenLine className="w-4 h-4" /> {signing ? "Signing…" : "Sign & agree"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { currentEmployee } = useTraining();
  if (!currentEmployee) return null;

  const required = requiredModulesFor(currentEmployee.role, currentEmployee.location);
  const electives = electiveModulesFor(currentEmployee.role, currentEmployee.location);
  const passedCount = required.filter(
    (m) => currentEmployee.modules[m.id]?.passed,
  ).length;
  const electivesPassed = electivePassCount(currentEmployee);
  const completion = overallCompletion(currentEmployee);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-3">Team Training</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-none mb-2">
          Ciao, {currentEmployee.name.split(" ")[0]}.
        </h1>
        <p className="font-accent italic text-lg text-muted-foreground tracking-wide">
          {passedCount === required.length
            ? "You've completed everything required for your role. Bravo!"
            : `${currentEmployee.role} at ${currentEmployee.location} — pass each required module below.`}
        </p>
      </div>

      <SignOffCard />

      {/* Progress, stated like an editorial stat */}
      <div className="flex items-end justify-between gap-6 border border-border/80 bg-card px-6 py-5 mb-2">
        <div>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            Overall progress
          </p>
          <p className="font-display text-4xl leading-none">
            {Math.round(completion * 100)}
            <span className="text-xl text-gold">%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {passedCount} of {required.length} required modules
          </p>
          {electivesPassed > 0 && (
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              +{electivesPassed} elective{electivesPassed > 1 ? "s" : ""} passed
            </p>
          )}
          <div className="w-36 sm:w-52 h-px bg-border mt-3 ml-auto relative">
            <div
              className="absolute inset-y-0 left-0 bg-gold"
              style={{ width: `${completion * 100}%` }}
            />
          </div>
        </div>
      </div>

      <SectionHeading
        kicker="Your path"
        title={`Required for ${currentEmployee.role}`}
      />
      <div className="border-b border-border/70">
        {required.map((m) => (
          <ModuleRow key={m.id} module={m} progress={currentEmployee.modules[m.id]} />
        ))}
      </div>

      {electives.length > 0 && (
        <>
          <SectionHeading
            kicker="Keep growing"
            title="Electives"
            note="open to anyone — not counted toward your progress"
          />
          <div className="border-b border-border/70">
            {electives.map((m) => (
              <ModuleRow
                key={m.id}
                module={m}
                progress={currentEmployee.modules[m.id]}
                elective
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Training() {
  const { status, currentEmployee } = useTraining();
  return (
    <TrainingShell>
      {status === "loading" ? (
        <p className="text-center text-muted-foreground py-12">Loading…</p>
      ) : !currentEmployee ? (
        <SignIn />
      ) : currentEmployee.role === "Manager" ? (
        <ManagerHome />
      ) : (
        <Dashboard />
      )}
    </TrainingShell>
  );
}
