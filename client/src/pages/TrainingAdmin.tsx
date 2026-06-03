import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TrainingShell from "@/components/training/TrainingShell";
import {
  useTraining,
  overallCompletion,
  weakAreas,
  type EmployeeRecord,
} from "@/contexts/TrainingContext";
import { MODULES } from "@/lib/training/content";

function lastActivity(emp: EmployeeRecord): string {
  const times = Object.values(emp.modules)
    .map((m) => m.lastAttemptAt)
    .filter(Boolean)
    .sort();
  const latest = times[times.length - 1];
  return latest ? new Date(latest).toLocaleDateString() : "—";
}

export default function TrainingAdmin() {
  const { currentEmployee, allEmployees, resetAllData } = useTraining();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!currentEmployee) navigate("/training");
  }, [currentEmployee, navigate]);

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

  const trainees = allEmployees.filter((e) => e.role !== "Manager");
  const avgCompletion =
    trainees.length > 0
      ? trainees.reduce((sum, e) => sum + overallCompletion(e), 0) / trainees.length
      : 0;

  // Org-wide weak spots: modules with the most trainees not yet passing.
  const moduleStats = MODULES.map((m) => {
    const passed = trainees.filter((e) => e.modules[m.id]?.passed).length;
    return { module: m, passed, total: trainees.length };
  }).sort((a, b) => a.passed / (a.total || 1) - b.passed / (b.total || 1));

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

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Users className="w-4 h-4" /> Team members
            </div>
            <div className="text-3xl font-display">{trainees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm mb-1">Avg. completion</div>
            <div className="text-3xl font-display">
              {Math.round(avgCompletion * 100)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm mb-1">Modules</div>
            <div className="text-3xl font-display">{MODULES.length}</div>
          </CardContent>
        </Card>
      </div>

      {trainees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No team members have signed in yet. Once staff start training, their
            progress appears here.
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
              const passedCount = MODULES.filter((m) => emp.modules[m.id]?.passed).length;
              return (
                <Card key={emp.name}>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          · {emp.role} · {emp.location}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last active: {lastActivity(emp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Progress value={completion * 100} className="flex-1" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {passedCount}/{MODULES.length} passed
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
                    ) : passedCount === MODULES.length ? (
                      <p className="text-xs text-green-700">
                        All modules complete ✓
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
                Modules ranked by how many team members have passed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moduleStats.map(({ module, passed, total }) => (
                <div key={module.id} className="flex items-center gap-3">
                  <span className="text-sm flex-1 truncate">{module.title}</span>
                  <Progress value={total ? (passed / total) * 100 : 0} className="w-32" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap w-16 text-right">
                    {passed}/{total} passed
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-10 text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={() => {
                if (confirm("Clear all local training data on this device?")) resetAllData();
              }}
            >
              <Trash2 className="w-4 h-4" /> Reset demo data
            </Button>
          </div>
        </>
      )}
    </TrainingShell>
  );
}
