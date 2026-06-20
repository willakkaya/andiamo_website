import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TrainingShell from "@/components/training/TrainingShell";
import { useTraining } from "@/contexts/TrainingContext";
import {
  getModule,
  PASS_THRESHOLD,
  type QuizQuestion,
} from "@/lib/training/content";

type Mode = "learn" | "quiz" | "results";

type RunQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Each attempt gets a fresh shuffle of question order and answer options, so
// staff learn the content rather than memorizing answer positions.
function buildRun(quiz: QuizQuestion[]): RunQuestion[] {
  return shuffle(quiz).map((q) => {
    const correctText = q.options[q.answer];
    const options = shuffle(q.options);
    return {
      id: q.id,
      question: q.question,
      options,
      correctIndex: options.indexOf(correctText),
      explanation: q.explanation,
    };
  });
}

export default function TrainingModuleView() {
  const [, params] = useRoute("/training/module/:id");
  const [, navigate] = useLocation();
  const { currentEmployee, recordAttempt } = useTraining();
  const moduleId = params?.id ?? "";
  const module = getModule(moduleId);

  const [mode, setMode] = useState<Mode>("learn");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finalPct, setFinalPct] = useState(0);
  const [run, setRun] = useState<RunQuestion[]>([]);

  // Must be signed in.
  useEffect(() => {
    if (!currentEmployee) navigate("/training");
  }, [currentEmployee, navigate]);

  const scored = useMemo(
    () =>
      run.map((rq) => ({
        rq,
        selected: answers[rq.id],
        correct: answers[rq.id] === rq.correctIndex,
      })),
    [run, answers],
  );

  if (!module) {
    return (
      <TrainingShell>
        <p className="text-muted-foreground">Module not found.</p>
        <Link href="/training">
          <Button variant="outline" className="mt-4 gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to modules
          </Button>
        </Link>
      </TrainingShell>
    );
  }

  const isElective =
    !!currentEmployee && !module.requiredFor.includes(currentEmployee.role);

  const startQuiz = () => {
    setRun(buildRun(module.quiz));
    setAnswers({});
    setCurrent(0);
    setMode("quiz");
  };

  const submit = () => {
    const pct = recordAttempt(
      module.id,
      run.map((rq) => ({ questionId: rq.id, correct: answers[rq.id] === rq.correctIndex })),
    );
    setFinalPct(pct);
    setMode("results");
  };

  // ---- LEARN ----
  if (mode === "learn") {
    return (
      <TrainingShell>
        <Link href="/training">
          <Button variant="ghost" size="sm" className="mb-4 gap-1 -ml-2">
            <ArrowLeft className="w-4 h-4" /> All modules
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-gold border-gold/40">
            {module.section}
          </Badge>
          {isElective && (
            <Badge variant="secondary" className="text-xs">
              Elective for your role
            </Badge>
          )}
        </div>
        <h1 className="font-display text-3xl mb-2">{module.title}</h1>
        <p className="text-muted-foreground mb-8">{module.summary}</p>

        <div className="space-y-5">
          {module.lessons.map((lesson, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="font-display text-xl">{lesson.heading}</CardTitle>
                {lesson.intro && (
                  <p className="text-sm italic text-muted-foreground mt-1">
                    {lesson.intro}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.points.map((pt, j) => (
                    <li key={j} className="flex gap-2 text-sm">
                      <span className="text-gold mt-1">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={startQuiz} className="gap-1">
            Start the quiz ({module.quiz.length} questions){" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </TrainingShell>
    );
  }

  // ---- QUIZ ----
  if (mode === "quiz") {
    const q = run[current];
    const selected = answers[q.id];
    const isLast = current === run.length - 1;
    return (
      <TrainingShell>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>{module.title}</span>
            <span>
              Question {current + 1} of {run.length}
            </span>
          </div>
          <Progress value={((current + 1) / run.length) * 100} className="mb-6" />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-snug">{q.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selected !== undefined ? String(selected) : undefined}
                onValueChange={(v) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: parseInt(v, 10) }))
                }
                className="space-y-2"
              >
                {q.options.map((opt, i) => (
                  <Label
                    key={i}
                    htmlFor={`${q.id}-${i}`}
                    className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 has-[:checked]:border-gold has-[:checked]:bg-accent/60"
                  >
                    <RadioGroupItem id={`${q.id}-${i}`} value={String(i)} />
                    <span className="text-sm font-normal">{opt}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {isLast ? (
              <Button disabled={selected === undefined} onClick={submit}>
                Submit quiz
              </Button>
            ) : (
              <Button
                disabled={selected === undefined}
                onClick={() => setCurrent((c) => c + 1)}
                className="gap-1"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </TrainingShell>
    );
  }

  // ---- RESULTS ----
  const passed = finalPct >= PASS_THRESHOLD;
  const correctCount = scored.filter((s) => s.correct).length;
  return (
    <TrainingShell>
      <div className="max-w-2xl mx-auto">
        <Card className={passed ? "border-green-600/40" : "border-destructive/40"}>
          <CardContent className="pt-6 text-center">
            {passed ? (
              <Trophy className="w-12 h-12 text-gold mx-auto mb-3" />
            ) : (
              <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            )}
            <h1 className="font-display text-3xl mb-1">
              {passed ? "Module passed!" : "Almost there"}
            </h1>
            <p className="text-muted-foreground mb-4">
              You scored {correctCount} of {run.length} (
              {Math.round(finalPct * 100)}%).{" "}
              {passed
                ? "Great work."
                : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass — review and try again.`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startQuiz} variant={passed ? "outline" : "default"} className="gap-1">
                <RotateCcw className="w-4 h-4" /> Retake quiz
              </Button>
              <Link href="/training">
                <Button variant={passed ? "default" : "outline"}>Back to modules</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <h2 className="font-display text-xl mt-8 mb-3">Review</h2>
        <div className="space-y-3">
          {scored.map(({ rq, selected, correct }) => (
            <Card key={rq.id}>
              <CardContent className="pt-5">
                <div className="flex gap-2">
                  {correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{rq.question}</p>
                    {!correct && selected !== undefined && (
                      <p className="text-sm text-destructive">
                        Your answer: {rq.options[selected]}
                      </p>
                    )}
                    <p className="text-sm text-green-700">
                      Correct: {rq.options[rq.correctIndex]}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {rq.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TrainingShell>
  );
}
