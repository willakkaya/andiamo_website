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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TrainingShell from "@/components/training/TrainingShell";
import { useTraining } from "@/contexts/TrainingContext";
import {
  getModule,
  PASS_THRESHOLD,
  QUIZ_DRAW,
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

// Each attempt draws a random subset of the question bank (QUIZ_DRAW) and gets
// a fresh shuffle of question order and answer options, so staff learn the
// content rather than memorizing answers or positions.
function buildRun(quiz: QuizQuestion[]): RunQuestion[] {
  return shuffle(quiz).slice(0, QUIZ_DRAW).map((q) => {
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
  const { status, currentEmployee, recordAttempt } = useTraining();
  const moduleId = params?.id ?? "";
  const module = getModule(moduleId);

  const [mode, setMode] = useState<Mode>("learn");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finalPct, setFinalPct] = useState(0);
  const [run, setRun] = useState<RunQuestion[]>([]);

  // Must be signed in (wait for the session to finish restoring first).
  useEffect(() => {
    if (status === "ready" && !currentEmployee) navigate("/training");
  }, [status, currentEmployee, navigate]);

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
          <Button variant="outline" className="mt-4 gap-1 rounded-none">
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

  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const pct = await recordAttempt(
      module.id,
      run.map((rq) => ({ questionId: rq.id, correct: answers[rq.id] === rq.correctIndex })),
    );
    setFinalPct(pct);
    setMode("results");
    setSubmitting(false);
  };

  const drawCount = Math.min(QUIZ_DRAW, module.quiz.length);

  // ---- LEARN ----
  if (mode === "learn") {
    return (
      <TrainingShell>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/training"
            className="link-line inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-[11px] tracking-[0.18em] uppercase mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All modules
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span className="chapter">{String(module.order).padStart(2, "0")}</span>
            <p className="eyebrow !text-muted-foreground">
              {module.section}
              {module.location ? ` · ${module.location}` : ""}
              {isElective ? " · Elective for your role" : ""}
            </p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-3">
            {module.title}
          </h1>
          <p className="font-accent italic text-lg text-muted-foreground tracking-wide mb-10">
            {module.summary}
          </p>

          <div>
            {module.lessons.map((lesson, i) => (
              <section key={i} className="border-t border-border/70 py-7">
                <div className="grid sm:grid-cols-[3.5rem_1fr] gap-x-4">
                  <span className="hidden sm:block font-display text-2xl text-gold/40 leading-none pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl leading-snug mb-1">
                      {lesson.heading}
                    </h2>
                    {lesson.intro && (
                      <p className="font-accent italic text-base text-muted-foreground tracking-wide mb-3">
                        {lesson.intro}
                      </p>
                    )}
                    <ul className="space-y-2.5 mt-3">
                      {lesson.points.map((pt, j) => (
                        <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                          <span className="text-gold select-none">—</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="border-t border-border/70 pt-8 mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {drawCount} questions, drawn at random from {module.quiz.length} ·
              pass at {Math.round(PASS_THRESHOLD * 100)}%
            </p>
            <Button
              onClick={startQuiz}
              className="gap-2 h-12 px-8 rounded-none font-body text-[12px] tracking-[0.2em] uppercase font-semibold"
            >
              Start the quiz <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
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
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-accent italic text-base text-muted-foreground tracking-wide truncate pr-4">
              {module.title}
            </span>
            <span className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground whitespace-nowrap">
              {current + 1} / {run.length}
            </span>
          </div>
          <div className="h-px bg-border mb-8 relative">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-300"
              style={{ width: `${((current + 1) / run.length) * 100}%` }}
            />
          </div>

          <h1 className="font-display text-2xl sm:text-[1.7rem] leading-snug mb-6">
            {q.question}
          </h1>

          <RadioGroup
            value={selected !== undefined ? String(selected) : undefined}
            onValueChange={(v) =>
              setAnswers((prev) => ({ ...prev, [q.id]: parseInt(v, 10) }))
            }
            className="space-y-2.5"
          >
            {q.options.map((opt, i) => (
              <Label
                key={i}
                htmlFor={`${q.id}-${i}`}
                className="flex items-center gap-3 border border-border p-4 min-h-[3.25rem] cursor-pointer transition-colors hover:bg-accent/50 has-[:checked]:border-gold has-[:checked]:bg-gold/5"
              >
                <RadioGroupItem id={`${q.id}-${i}`} value={String(i)} />
                <span className="text-[15px] font-normal leading-snug">{opt}</span>
              </Label>
            ))}
          </RadioGroup>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className="gap-1 rounded-none text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {isLast ? (
              <Button
                disabled={selected === undefined || submitting}
                onClick={submit}
                className="h-11 px-8 rounded-none font-body text-[12px] tracking-[0.2em] uppercase font-semibold"
              >
                {submitting ? "Submitting…" : "Submit quiz"}
              </Button>
            ) : (
              <Button
                disabled={selected === undefined}
                onClick={() => setCurrent((c) => c + 1)}
                className="gap-1 h-11 px-8 rounded-none font-body text-[12px] tracking-[0.2em] uppercase font-semibold"
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
        <div
          className={`border text-center px-6 py-10 ${
            passed ? "border-gold/50 bg-gold/[0.04]" : "border-border bg-card"
          }`}
        >
          {passed ? (
            <Trophy className="w-10 h-10 text-gold mx-auto mb-4" />
          ) : (
            <RotateCcw className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          )}
          <p className="eyebrow mb-2">{module.title}</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-none mb-3">
            {passed ? "Module passed" : "Almost there"}
          </h1>
          <p className="text-muted-foreground mb-1">
            You scored {correctCount} of {run.length} ({Math.round(finalPct * 100)}%).
          </p>
          <p className="font-accent italic text-base text-muted-foreground tracking-wide mb-7">
            {passed
              ? "Great work — it shows on the floor."
              : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass. Review below and try again — the next draw will mix in fresh questions.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={startQuiz}
              variant={passed ? "outline" : "default"}
              className="gap-2 h-11 px-7 rounded-none font-body text-[11px] tracking-[0.18em] uppercase font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> Retake quiz
            </Button>
            <Link href="/training">
              <Button
                variant={passed ? "default" : "outline"}
                className="w-full sm:w-auto h-11 px-7 rounded-none font-body text-[11px] tracking-[0.18em] uppercase font-semibold"
              >
                Back to modules
              </Button>
            </Link>
          </div>
        </div>

        <h2 className="font-display text-2xl mt-10 mb-2">Review</h2>
        <div>
          {scored.map(({ rq, selected, correct }) => (
            <div key={rq.id} className="border-t border-border/70 py-5">
              <div className="flex gap-3">
                {correct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5">
                  <p className="font-medium text-[15px] leading-snug">{rq.question}</p>
                  {!correct && selected !== undefined && (
                    <p className="text-sm text-destructive">
                      Your answer: {rq.options[selected]}
                    </p>
                  )}
                  <p className="text-sm text-green-700">
                    Correct: {rq.options[rq.correctIndex]}
                  </p>
                  <p className="font-accent italic text-[15px] text-muted-foreground tracking-wide">
                    {rq.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TrainingShell>
  );
}
