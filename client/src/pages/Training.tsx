import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, PenLine } from "lucide-react";
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

/* ----------------------------------------------------------------------------
   Shared editorial atoms
---------------------------------------------------------------------------- */

const FIELD_LABEL =
  "block font-body text-[10px] tracking-[0.26em] uppercase text-muted-foreground mb-1";
const FIELD_INPUT =
  "w-full bg-transparent border-0 border-b border-foreground/25 rounded-none px-0 py-2.5 text-base focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-muted-foreground/50";
const FIELD_SELECT =
  "!border-0 !border-b !border-foreground/25 !rounded-none !px-0 !shadow-none !h-12 w-full !bg-transparent font-body text-base focus-visible:!ring-0 data-[state=open]:!border-gold";
const BLOCK_BTN =
  "inline-flex items-center justify-center gap-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-500 font-body text-[11px] tracking-[0.28em] uppercase disabled:opacity-40 disabled:pointer-events-none";

/** Rotated passport-style stamp. */
function Stamp({ children, light }: { children: string; light?: boolean }) {
  return (
    <span
      className={`inline-block -rotate-6 border px-2.5 py-1 font-body text-[9px] tracking-[0.3em] uppercase select-none ${
        light ? "border-gold-light/80 text-gold-light" : "border-gold text-gold"
      }`}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------
   Sign in — split screen: dark house panel / cream form
---------------------------------------------------------------------------- */

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

  const numerals = ["i.", "ii.", "iii."];

  return (
    <div className="lg:grid lg:grid-cols-[11fr_9fr] lg:min-h-[calc(100vh-8.5rem)]">
      {/* House panel */}
      <div className="bg-charcoal text-cream grain relative overflow-hidden">
        <div className="relative z-[2] px-6 py-12 sm:px-12 lg:px-14 lg:py-16 flex flex-col justify-between h-full gap-10">
          <div>
            <p className="eyebrow !text-gold-light mb-6 lg:mb-10">
              Team Training — est. every shift
            </p>
            <h1 className="font-display text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] tracking-[0.01em]">
              Benvenuti
              <br />
              <span className="text-cream/60">alla famiglia.</span>
            </h1>
            <p className="font-accent italic text-lg sm:text-xl text-cream/55 mt-6 max-w-md leading-relaxed">
              Everything we expect on the floor, in one place — learn it, pass
              it, and wear it like it's your name on the door.
            </p>
          </div>

          <ul className="hidden lg:block space-y-4">
            {LOCATIONS.map((l, i) => (
              <li key={l} className="flex items-baseline gap-4">
                <span className="font-accent italic text-gold-light/70 w-6">
                  {numerals[i]}
                </span>
                <span className="font-display text-2xl text-cream/85">{l}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* oversized clipped monogram */}
        <span
          aria-hidden
          className="absolute -right-10 -bottom-24 font-display text-[24rem] leading-none text-cream/[0.05] select-none pointer-events-none"
        >
          A
        </span>
      </div>

      {/* Form */}
      <div className="flex items-start lg:items-center">
        <div className="w-full max-w-md mx-auto px-6 py-12 sm:px-10 lg:py-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8">
            Sign in — or start your record
          </p>

          <div className="space-y-7">
            <div>
              <label htmlFor="name" className={FIELD_LABEL}>
                01 — Your name
              </label>
              <input
                id="name"
                placeholder="Maria Rossi"
                className={FIELD_INPUT}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className={FIELD_LABEL}>02 — Role</span>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className={FIELD_SELECT}>
                    <SelectValue placeholder="Select" />
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
              <div>
                <span className={FIELD_LABEL}>03 — Restaurant</span>
                <Select
                  value={location}
                  onValueChange={(v) => setLocation(v as Location)}
                >
                  <SelectTrigger className={FIELD_SELECT}>
                    <SelectValue placeholder="Select" />
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
            </div>

            <div>
              <label htmlFor="pin" className={FIELD_LABEL}>
                04 — Four-digit PIN
              </label>
              <input
                id="pin"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                placeholder="0 0 0 0"
                className={`${FIELD_INPUT} font-display text-2xl tracking-[0.6em]`}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
              <p className="text-xs text-muted-foreground mt-2">
                First time? Choose any four digits — that PIN is yours from now on.
              </p>
            </div>

            {role === "Manager" && (
              <div>
                <label htmlFor="managerCode" className={FIELD_LABEL}>
                  05 — Manager access code
                </label>
                <input
                  id="managerCode"
                  type="password"
                  autoComplete="off"
                  placeholder="••••"
                  className={FIELD_INPUT}
                  value={managerCode}
                  onChange={(e) => setManagerCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              className={`${BLOCK_BTN} w-full h-14`}
              disabled={!canStart || submitting}
              onClick={handleSignIn}
            >
              {submitting ? "Signing in…" : "Enter the house"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Module row — table-of-contents entry with ghost numeral
---------------------------------------------------------------------------- */

function ModuleRow({
  module: m,
  progress: p,
  elective,
  showAudience,
}: {
  module: TrainingModule;
  progress: ModuleProgress | undefined;
  elective?: boolean;
  showAudience?: boolean;
}) {
  const passed = !!p?.passed;
  const started = !!p && p.attempts > 0;

  return (
    <Link
      href={`/training/module/${m.id}`}
      className="group grid grid-cols-[3.4rem_1fr_auto] sm:grid-cols-[5.5rem_1fr_auto] items-center gap-x-3 sm:gap-x-6 border-t border-foreground/15 py-6 sm:py-7 transition-colors duration-300 hover:bg-foreground/[0.03]"
    >
      <span
        className={`font-display text-[2.6rem] sm:text-[3.4rem] leading-none text-center transition-colors duration-300 ${
          passed
            ? "text-gold/35"
            : "text-foreground/[0.14] group-hover:text-gold/60"
        }`}
      >
        {String(m.order).padStart(2, "0")}
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`font-display text-xl sm:text-2xl leading-tight ${
              passed ? "text-muted-foreground" : ""
            }`}
          >
            {m.title}
          </span>
          {elective && (
            <span className="font-body text-[9px] tracking-[0.24em] uppercase text-muted-foreground border border-foreground/20 px-1.5 py-0.5">
              Elective
            </span>
          )}
        </span>
        <span className="block font-body text-[10px] tracking-[0.18em] uppercase text-muted-foreground/75 mt-2">
          {m.minutes} min — {m.quiz.length} questions
          {started && !passed ? ` — best ${Math.round((p?.bestPct ?? 0) * 100)}%` : ""}
          {showAudience && (
            <>
              {" — "}
              {m.location ?? "All restaurants"} ·{" "}
              {m.requiredFor.length === ROLES.length ? "Everyone" : m.requiredFor.join(", ")}
            </>
          )}
        </span>
      </span>

      <span className="justify-self-end pr-1 sm:pr-2">
        {passed ? (
          <Stamp>Passed</Stamp>
        ) : (
          <span className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.24em] uppercase text-foreground/60 group-hover:text-gold transition-colors duration-300">
            <span className="hidden sm:inline">
              {showAudience ? "Review" : started ? "Continue" : "Begin"}
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
      </span>
    </Link>
  );
}

function ChapterHeading({
  numeral,
  title,
  note,
}: {
  numeral: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mt-16 mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="chapter">{numeral}</span>
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      {note && (
        <span className="font-accent italic text-sm text-muted-foreground">{note}</span>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Sign-off + certificate
---------------------------------------------------------------------------- */

function SignOffCard() {
  const { currentEmployee, recordAcknowledgment } = useTraining();
  const [signature, setSignature] = useState("");
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState("");
  if (!currentEmployee) return null;

  if (isCertified(currentEmployee)) {
    return (
      <div className="bg-charcoal text-cream grain mb-14">
        <div className="relative z-[2] px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <Stamp light>Certified</Stamp>
            <h2 className="font-display text-3xl mt-3">
              The standards are yours now.
            </h2>
            <p className="font-accent italic text-cream/55 mt-1">
              All {currentEmployee.role} training complete, signed{" "}
              {currentEmployee.signatureName ?? currentEmployee.name}. Grazie.
            </p>
          </div>
          <Link
            href="/training/certificate"
            className="link-line inline-flex items-center gap-2 text-gold-light font-body text-[11px] tracking-[0.26em] uppercase shrink-0"
          >
            View certificate <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="bg-charcoal text-cream grain mb-14">
      <div className="relative z-[2] px-6 py-9 sm:px-10">
        <p className="eyebrow !text-gold-light mb-3">One last step</p>
        <h2 className="font-display text-3xl mb-3">Sign the standards.</h2>
        <p className="text-cream/65 text-sm max-w-2xl leading-relaxed">
          You've passed every module required for your role. By signing, you
          acknowledge that you've read, understand, and agree to uphold the
          expectations of the Akkaya Hospitality Group handbook.
        </p>
        <p className="font-accent italic text-cream/45 mt-4 mb-6">
          "Hospitality is a choice we make — moment by moment — to lift the
          experience of another human being."
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end max-w-xl">
          <div className="flex-1">
            <label
              htmlFor="signature"
              className="block font-body text-[10px] tracking-[0.26em] uppercase text-cream/50 mb-1"
            >
              Type your full name to sign
            </label>
            <input
              id="signature"
              placeholder={currentEmployee.name}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-cream/30 rounded-none px-0 py-2 font-display text-2xl text-cream focus:outline-none focus:border-gold-light transition-colors placeholder:text-cream/25"
            />
          </div>
          <button
            disabled={!canSign || signing}
            onClick={handleSign}
            className="inline-flex items-center justify-center gap-2 border border-gold-light/70 text-gold-light hover:bg-gold-light hover:text-charcoal transition-colors duration-500 font-body text-[10px] tracking-[0.26em] uppercase px-6 h-12 disabled:opacity-40 disabled:pointer-events-none shrink-0"
          >
            <PenLine className="w-3.5 h-3.5" />
            {signing ? "Signing…" : "Sign & agree"}
          </button>
        </div>
        {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Employee dashboard
---------------------------------------------------------------------------- */

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
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-4">
      {/* Hero: greeting vs. giant progress numeral */}
      <div className="grid sm:grid-cols-[1fr_auto] items-end gap-x-10 gap-y-8">
        <div>
          <p className="eyebrow mb-4">
            {currentEmployee.role} — {currentEmployee.location}
          </p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95]">
            Ciao, {currentEmployee.name.split(" ")[0]}.
          </h1>
          <p className="font-accent italic text-lg text-muted-foreground mt-4 max-w-md leading-relaxed">
            {passedCount === required.length
              ? "Everything required for your role is complete. Bravo."
              : "Every module you pass shows up on the floor. Pick up where you left off."}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="font-display text-[clamp(5rem,11vw,8.5rem)] leading-[0.8]">
            {Math.round(completion * 100)}
            <span className="text-gold text-[0.45em]">%</span>
          </span>
          <p className="font-body text-[10px] tracking-[0.24em] uppercase text-muted-foreground mt-3">
            {passedCount} of {required.length} required passed
            {electivesPassed > 0 ? ` — +${electivesPassed} elective` : ""}
          </p>
        </div>
      </div>

      {/* Progress rule */}
      <div className="h-[2px] bg-foreground/10 mt-8 mb-2 relative">
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-all duration-700"
          style={{ width: `${completion * 100}%` }}
        />
      </div>

      <div className="mt-10">
        <SignOffCard />
      </div>

      <ChapterHeading numeral="I" title={`Required for ${currentEmployee.role}`} />
      <div className="border-b border-foreground/15">
        {required.map((m) => (
          <ModuleRow key={m.id} module={m} progress={currentEmployee.modules[m.id]} />
        ))}
      </div>

      {electives.length > 0 && (
        <>
          <ChapterHeading
            numeral="II"
            title="Electives"
            note="beyond your role — never counted against you"
          />
          <div className="border-b border-foreground/15">
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

/* ----------------------------------------------------------------------------
   Manager home
---------------------------------------------------------------------------- */

function ManagerHome() {
  const { currentEmployee, allEmployees, refreshTeam } = useTraining();
  useEffect(() => {
    refreshTeam();
  }, [refreshTeam]);
  const trainees = allEmployees.filter((e) => e.role !== "Manager");
  const needsAttention = trainees.filter((e) => weakAreas(e).length > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-4">
      <div className="grid sm:grid-cols-[1fr_auto] items-end gap-x-10 gap-y-8">
        <div>
          <p className="eyebrow mb-4">Manager — {currentEmployee?.location}</p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.95]">
            Ciao, {currentEmployee?.name.split(" ")[0]}.
          </h1>
          <p className="font-accent italic text-lg text-muted-foreground mt-4 max-w-md leading-relaxed">
            {trainees.length === 0
              ? "Your team's progress will appear the moment they start training."
              : needsAttention > 0
                ? `${needsAttention} of your ${trainees.length} trainees need${needsAttention === 1 ? "s" : ""} attention.`
                : `All ${trainees.length} trainees on track.`}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="font-display text-[clamp(5rem,11vw,8.5rem)] leading-[0.8]">
            {trainees.length}
          </span>
          <p className="font-body text-[10px] tracking-[0.24em] uppercase text-muted-foreground mt-3">
            team members training
          </p>
        </div>
      </div>

      {/* Dashboard CTA band */}
      <Link href="/training/admin" className="block group mt-10">
        <div className="bg-charcoal text-cream grain">
          <div className="relative z-[2] px-6 py-7 sm:px-10 flex items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">Team Dashboard</h2>
              <p className="font-accent italic text-cream/50 text-sm mt-1">
                Who's trained, who's stuck, and what to coach next.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-gold-light font-body text-[11px] tracking-[0.26em] uppercase shrink-0">
              <span className="hidden sm:inline link-line">Open</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </div>
      </Link>

      <ChapterHeading
        numeral="I"
        title="The curriculum"
        note={`${MODULES.length} modules your staff complete`}
      />
      <div className="border-b border-foreground/15">
        {MODULES.map((m) => (
          <ModuleRow key={m.id} module={m} progress={undefined} showAudience />
        ))}
      </div>
    </div>
  );
}

export default function Training() {
  const { status, currentEmployee } = useTraining();
  return (
    <TrainingShell>
      {status === "loading" ? (
        <p className="text-center text-muted-foreground py-24">Loading…</p>
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
