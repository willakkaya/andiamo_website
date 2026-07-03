import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  AlertTriangle,
  Users,
  RefreshCw,
  CheckCircle2,
  MoreVertical,
  KeyRound,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TrainingShell from "@/components/training/TrainingShell";
import {
  useTraining,
  overallCompletion,
  weakAreas,
  electivePassCount,
  isFullyTrained,
  isCertified,
  LOCATIONS,
  type EmployeeRecord,
  type Location,
} from "@/contexts/TrainingContext";
import { MODULES, requiredModulesFor } from "@/lib/training/content";

function lastActivity(emp: EmployeeRecord): string {
  const times = Object.values(emp.modules)
    .map((m) => m.lastAttemptAt)
    .filter(Boolean)
    .sort();
  const latest = times[times.length - 1];
  return latest ? new Date(latest).toLocaleDateString() : "—";
}

const hasStarted = (emp: EmployeeRecord) => Object.keys(emp.modules).length > 0;

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------
function csvEscape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportTeamCsv(trainees: EmployeeRecord[]) {
  const header = [
    "Name",
    "Role",
    "Restaurant",
    "Required passed",
    "Required total",
    "Completion %",
    "Electives passed",
    "Signed off",
    "Last active",
    "Needs work",
  ];
  const rows = trainees.map((emp) => {
    const required = requiredModulesFor(emp.role, emp.location);
    const passed = required.filter((m) => emp.modules[m.id]?.passed).length;
    return [
      emp.name,
      emp.role,
      emp.location,
      passed,
      required.length,
      Math.round(overallCompletion(emp) * 100),
      electivePassCount(emp),
      isCertified(emp) ? `Yes (${emp.signatureName ?? emp.name})` : "No",
      lastActivity(emp),
      weakAreas(emp).join("; "),
    ];
  });
  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `training-progress-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Per-employee manager actions (reset PIN / remove)
// ---------------------------------------------------------------------------
function EmployeeActions({ emp }: { emp: EmployeeRecord }) {
  const { resetEmployeePin, removeEmployee, refreshTeam } = useTraining();
  const [dialog, setDialog] = useState<"pin" | "remove" | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setDialog(null);
    setPin("");
    setError(null);
  };

  const submitPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }
    setBusy(true);
    const res = await resetEmployeePin(emp.id, pin);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong");
      return;
    }
    close();
  };

  const submitRemove = async () => {
    setBusy(true);
    const res = await removeEmployee(emp.id);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong");
      return;
    }
    close();
    refreshTeam();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            aria-label={`Actions for ${emp.name}`}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDialog("pin")}>
            <KeyRound className="w-4 h-4" /> Reset PIN
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDialog("remove")}>
            <Trash2 className="w-4 h-4" /> Remove employee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset PIN */}
      <Dialog open={dialog === "pin"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset PIN — {emp.name}</DialogTitle>
            <DialogDescription>
              Set a new 4-digit PIN and share it with {emp.name}. They'll use it the
              next time they sign in.
            </DialogDescription>
          </DialogHeader>
          <Input
            inputMode="numeric"
            maxLength={4}
            placeholder="New 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && submitPin()}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submitPin} disabled={busy}>
              {busy ? "Saving…" : "Set new PIN"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove employee */}
      <Dialog open={dialog === "remove"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove {emp.name}?</DialogTitle>
            <DialogDescription>
              This deletes their account and all training progress. It can't be
              undone — use it for departed staff or test accounts.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitRemove} disabled={busy}>
              {busy ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TrainingAdmin() {
  const { status, currentEmployee, allEmployees, refreshTeam } = useTraining();
  const [, navigate] = useLocation();
  const [locationFilter, setLocationFilter] = useState<"All" | Location>("All");

  useEffect(() => {
    if (status === "ready" && !currentEmployee) navigate("/training");
  }, [status, currentEmployee, navigate]);

  // Load the whole team's progress from the server (managers only).
  useEffect(() => {
    if (currentEmployee?.isManager) refreshTeam();
  }, [currentEmployee?.isManager, refreshTeam]);

  if (currentEmployee && currentEmployee.role !== "Manager") {
    return (
      <TrainingShell>
        <div className="text-center py-12">
          <AlertTriangle className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="font-display text-2xl mb-2">Managers only</h1>
          <p className="text-muted-foreground mb-4">
            The team dashboard is available to managers. Sign in with the Manager
            role to view it.
          </p>
          <Link href="/training">
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to training
            </Button>
          </Link>
        </div>
      </TrainingShell>
    );
  }

  const allTrainees = allEmployees.filter((e) => e.role !== "Manager");
  const trainees =
    locationFilter === "All"
      ? allTrainees
      : allTrainees.filter((e) => e.location === locationFilter);
  const avgCompletion =
    trainees.length > 0
      ? trainees.reduce((sum, e) => sum + overallCompletion(e), 0) / trainees.length
      : 0;

  // Org-wide weak spots: pass rate per module among the staff who require it.
  const moduleStats = MODULES.map((m) => {
    const needed = trainees.filter(
      (e) =>
        (m.location === undefined || m.location === e.location) &&
        m.requiredFor.includes(e.role),
    );
    const passed = needed.filter((e) => e.modules[m.id]?.passed).length;
    return { module: m, passed, total: needed.length };
  })
    .filter((s) => s.total > 0)
    .sort((a, b) => a.passed / a.total - b.passed / b.total);

  return (
    <TrainingShell>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl mb-1">Team Dashboard</h1>
          <p className="text-muted-foreground">
            Track each employee's progress and pinpoint what they need to work on.
          </p>
        </div>
        <Link href="/training">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Training
          </Button>
        </Link>
      </div>

      {allTrainees.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {(["All", ...LOCATIONS] as const).map((loc) => {
            const count =
              loc === "All"
                ? allTrainees.length
                : allTrainees.filter((e) => e.location === loc).length;
            return (
              <Button
                key={loc}
                size="sm"
                variant={locationFilter === loc ? "default" : "outline"}
                onClick={() => setLocationFilter(loc)}
                className="gap-1"
              >
                {loc}
                <span className="opacity-70">({count})</span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm mb-1">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Team
            </div>
            <div className="text-2xl sm:text-3xl font-display">{trainees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-muted-foreground text-xs sm:text-sm mb-1">Avg. done</div>
            <div className="text-2xl sm:text-3xl font-display">
              {Math.round(avgCompletion * 100)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-muted-foreground text-xs sm:text-sm mb-1">Modules</div>
            <div className="text-2xl sm:text-3xl font-display">{MODULES.length}</div>
          </CardContent>
        </Card>
      </div>

      {trainees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {allTrainees.length === 0
              ? "No team members have signed in yet. Once staff start training, their progress appears here."
              : `No team members at ${locationFilter} yet.`}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Per-employee */}
          <h2 className="font-display text-xl mb-3">By employee</h2>
          <div className="space-y-3 mb-10">
            {trainees.map((emp) => {
              const completion = overallCompletion(emp);
              const weak = weakAreas(emp);
              const required = requiredModulesFor(emp.role, emp.location);
              const passedCount = required.filter((m) => emp.modules[m.id]?.passed).length;
              const electives = electivePassCount(emp);
              return (
                <Card key={emp.id}>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          · {emp.role} · {emp.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCertified(emp) ? (
                          <Badge className="bg-green-600/15 text-green-700 border-green-600/30 gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Signed off
                          </Badge>
                        ) : isFullyTrained(emp) ? (
                          <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 gap-1">
                            <AlertTriangle className="w-3 h-3" /> Awaiting sign-off
                          </Badge>
                        ) : !hasStarted(emp) ? (
                          <Badge variant="secondary">Not started</Badge>
                        ) : null}
                        <span className="text-xs text-muted-foreground">
                          Last active: {lastActivity(emp)}
                        </span>
                        <EmployeeActions emp={emp} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Progress value={completion * 100} className="flex-1" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {passedCount}/{required.length} required
                        {electives > 0 ? ` · +${electives} elective` : ""}
                      </span>
                    </div>
                    {weak.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Needs work:
                        </span>
                        {weak.map((w) => (
                          <Badge key={w} variant="secondary" className="text-xs">
                            {w}
                          </Badge>
                        ))}
                      </div>
                    ) : passedCount === required.length ? (
                      <p className="text-xs text-green-700">
                        All required modules complete ✓
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No failed quizzes yet — still in progress.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Org-wide weak spots */}
          <h2 className="font-display text-xl mb-3">Where the team needs the most work</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Ranked by pass rate among the staff who require each module
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moduleStats.map(({ module, passed, total }) => (
                <div
                  key={module.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="text-sm sm:flex-1 sm:truncate">{module.title}</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Progress
                      value={total ? (passed / total) * 100 : 0}
                      className="flex-1 sm:w-32 sm:flex-none"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap sm:w-16 sm:text-right">
                      {passed}/{total} passed
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-10 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={() => exportTeamCsv(trainees)}
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={() => refreshTeam()}
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </>
      )}
    </TrainingShell>
  );
}
