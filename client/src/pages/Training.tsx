import { useState } from "react";
import { Link } from "wouter";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  ArrowRight,
  LayoutDashboard,
  BookOpen,
  Award,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl mb-2">Welcome to the Team</h1>
        <p className="text-muted-foreground">
          Sign in to start your training and track your progress.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              placeholder="e.g. Maria Rossi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
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
            <Label>Restaurant</Label>
            <Select
              value={location}
              onValueChange={(v) => setLocation(v as Location)}
            >
              <SelectTrigger>
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
            <Label htmlFor="pin">4-digit PIN</Label>
            <Input
              id="pin"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="••••"
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
              <Label htmlFor="managerCode">Manager access code</Label>
              <Input
                id="managerCode"
                type="password"
                autoComplete="off"
                placeholder="Required for the team dashboard"
                value={managerCode}
                onChange={(e) => setManagerCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            className="w-full"
            disabled={!canStart || submitting}
            onClick={handleSignIn}
          >
            {submitting ? "Signing in…" : "Start Training"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Managers: choose the "Manager" role and enter your access code to see
            the team dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagerHome() {
  const { currentEmployee, allEmployees } = useTraining();
  const trainees = allEmployees.filter((e) => e.role !== "Manager");
  const needsAttention = trainees.filter(
    (e) => weakAreas(e).length > 0,
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-1">
          Ciao, {currentEmployee?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your team's training and review the curriculum below.
        </p>
      </div>

      {/* Primary manager CTA */}
      <Card className="mb-8 border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gold/10 p-2.5 shrink-0">
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
            <Button className="gap-1 shrink-0">
              Open dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Curriculum as reference */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-display text-xl">The curriculum</h2>
        <span className="text-sm text-muted-foreground">
          · {MODULES.length} modules your staff complete
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Card key={m.id} className="flex flex-col">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-gold border-gold/40 w-fit">
                  {m.section}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {m.location ?? "All restaurants"}
                </Badge>
              </div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {String(m.order).padStart(2, "0")}
                </span>
                {m.title}
              </CardTitle>
              <CardDescription className="mt-1">{m.summary}</CardDescription>
              <p className="text-xs text-muted-foreground mt-2">
                Required for:{" "}
                {m.requiredFor.length === ROLES.length
                  ? "Everyone"
                  : m.requiredFor.join(", ")}
              </p>
            </CardHeader>
            <CardContent className="mt-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {m.minutes} min · {m.quiz.length} questions
              </span>
              <Link href={`/training/module/${m.id}`}>
                <Button size="sm" variant="outline" className="gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Review
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ModuleCard({
  module: m,
  progress: p,
  elective,
}: {
  module: TrainingModule;
  progress: ModuleProgress | undefined;
  elective?: boolean;
}) {
  const status = p?.passed
    ? "passed"
    : p && p.attempts > 0
      ? "in-progress"
      : "not-started";
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-gold border-gold/40">
                {m.section}
              </Badge>
              {elective && (
                <Badge variant="secondary" className="text-xs">
                  Elective
                </Badge>
              )}
            </div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {String(m.order).padStart(2, "0")}
              </span>
              {m.title}
            </CardTitle>
          </div>
          {status === "passed" ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground/40 shrink-0" />
          )}
        </div>
        <CardDescription className="mt-1">{m.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {m.minutes} min · {m.quiz.length} questions
          {p?.attempts ? ` · best ${Math.round(p.bestPct * 100)}%` : ""}
        </span>
        <Link href={`/training/module/${m.id}`}>
          <Button size="sm" variant={status === "passed" ? "outline" : "default"} className="gap-1">
            {status === "passed" ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" /> Review
              </>
            ) : status === "in-progress" ? (
              "Continue"
            ) : (
              "Start"
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
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
      <Card className="mb-8 border-green-600/40 bg-gradient-to-br from-green-600/5 to-transparent">
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-green-600/10 p-2.5 shrink-0">
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
            <Button className="gap-1 shrink-0">
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
    <Card className="mb-8 border-gold/50 bg-gradient-to-br from-gold/5 to-transparent">
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
        <p className="text-sm italic text-muted-foreground">
          "Hospitality is a choice we make — moment by moment — to lift the
          experience of another human being."
        </p>
        <div className="space-y-2">
          <Label htmlFor="signature">Type your full name to sign</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="signature"
              placeholder={currentEmployee.name}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="font-display text-lg"
            />
            <Button
              disabled={!canSign || signing}
              onClick={handleSign}
              className="gap-1 shrink-0"
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
        <h1 className="font-display text-3xl mb-1">
          Ciao, {currentEmployee.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          {passedCount === required.length
            ? "You've completed everything required for your role. Bravo!"
            : `Work through each module required for your role (${currentEmployee.role}) and pass the quiz to complete it.`}
        </p>
      </div>

      <SignOffCard />

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall progress</span>
            <span className="text-sm text-muted-foreground">
              {passedCount} of {required.length} required modules
            </span>
          </div>
          <Progress value={completion * 100} />
          {electivesPassed > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              +{electivesPassed} elective{electivesPassed > 1 ? "s" : ""} passed
              beyond your role
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className="font-display text-xl mb-3">
        Required for {currentEmployee.role}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {required.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            progress={currentEmployee.modules[m.id]}
          />
        ))}
      </div>

      {electives.length > 0 && (
        <>
          <h2 className="font-display text-xl mt-10 mb-1">Electives</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Beyond your role — open to anyone who wants to grow. These don't
            count toward your required progress.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {electives.map((m) => (
              <ModuleCard
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
