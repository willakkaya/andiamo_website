import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Circle, RotateCcw, ArrowRight } from "lucide-react";
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
  type Role,
  type Location,
} from "@/contexts/TrainingContext";
import { MODULES } from "@/lib/training/content";
import TrainingShell from "@/components/training/TrainingShell";

function SignIn() {
  const { signIn } = useTraining();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [location, setLocation] = useState<Location | "">("");

  const canStart = name.trim().length > 1 && role && location;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl mb-2">Welcome to the Team</h1>
        <p className="text-muted-foreground">
          Sign in to start your Andiamo training and track your progress.
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
          <Button
            className="w-full"
            disabled={!canStart}
            onClick={() => canStart && signIn(name, role as Role, location as Location)}
          >
            Start Training <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Managers: sign in with the role "Manager" to see the team dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard() {
  const { currentEmployee } = useTraining();
  const completion = overallCompletion(currentEmployee);
  const passedCount = MODULES.filter(
    (m) => currentEmployee?.modules[m.id]?.passed,
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-1">
          Ciao, {currentEmployee?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          {passedCount === MODULES.length
            ? "You've completed every module. Bravo!"
            : "Work through each module and pass the quiz to complete it."}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall progress</span>
            <span className="text-sm text-muted-foreground">
              {passedCount} of {MODULES.length} modules
            </span>
          </div>
          <Progress value={completion * 100} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => {
          const p = currentEmployee?.modules[m.id];
          const status = p?.passed
            ? "passed"
            : p && p.attempts > 0
              ? "in-progress"
              : "not-started";
          return (
            <Card key={m.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="mb-2 text-gold border-gold/40">
                      {m.section}
                    </Badge>
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
        })}
      </div>
    </div>
  );
}

export default function Training() {
  const { currentEmployee } = useTraining();
  return <TrainingShell>{currentEmployee ? <Dashboard /> : <SignIn />}</TrainingShell>;
}
