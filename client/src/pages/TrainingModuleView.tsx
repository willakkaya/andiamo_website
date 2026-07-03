import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
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

const LETTERS = ["A", "B", "C", "D", "E", "F"];

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
  const [submitting, setSubmitting] = useState(false);

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
        <div className="max-w-3xl mx-auto px-5 py-16">
          <p className="text-muted-foreground">Module not found.</p>
          <Link
            href="/training"
            className="link-line inline-flex items-center gap-2 text-gold font-body text-[11px] tracking-[0.22em] uppercase mt-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to the manual
          </Link>
        </div>
      </TrainingShell>
    );
  }

  const isElective =
    !!currentEmployee && !module.requiredFor.includes(currentEmployee.role);
  const drawCount = Math.min(QUIZ_DRAW, module.quiz.length);

  const startQuiz = () => {
    setRun(buildRun(module.quiz));
    setAnswers({});
    setCurrent(0);
    setMode("quiz");
  };

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

  /* ---- LEARN ---- */
  if (mode === "learn") {
    return (
      <TrainingShell>
        {/* Chapter opening — dark spread with clipped numeral */}
        <div className="bg-charcoal text-cream grain relative overflow-hidden">
          <span
            aria-hidden
            className="absolute -right-6 -top-14 font-display text-[16rem] sm:text-[22rem] leading-none text-cream/[0.06] select-none pointer-events-none"
          >
            {String(module.order).padStart(2, "0")}
          </span>
          <div className="relative z-[2] max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20">
            <Link
              href="/training"
              className="link-line inline-flex items-center gap-2 text-cream/50 hover:text-cream font-body text-[10px] tracking-[0.24em] uppercase mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> The manual
            </Link>
            <p className="eyebrow !text-gold-light mb-4">
              Chapter {String(module.order).padStart(2, "0")} — {module.section}
              {module.location ? ` · ${module.location}` : ""}
              {isElective ? " · Elective" : ""}
            </p>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] max-w-2xl">
              {module.title}
            </h1>
            <p className="font-accent italic text-lg text-cream/55 mt-5 max-w-xl leading-relaxed">
              {module.summary}
            </p>
          </div>
        </div>

        {/* Lessons */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {module.lessons.map((lesson, i) => (
            <section
              key={i}
              className={`py-10 sm:py-12 ${i > 0 ? "border-t border-foreground/12" : ""}`}
            >
              <div className="grid sm:grid-cols-[7rem_1fr] gap-x-8">
                <span className="hidden sm:block font-display text-[3.4rem] leading-[0.8] text-foreground/[0.14] pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-[1.7rem] sm:text-3xl leading-tight mb-2">
                    {lesson.heading}
                  </h2>
                  {lesson.intro && (
                    <p className="font-accent italic text-lg text-gold-dark mb-5">
                      {lesson.intro}
                    </p>
                  )}
                  <ul className="space-y-3 mt-4">
                    {lesson.points.map((pt, j) => (
                      <li key={j} className="flex gap-4 text-[15px] leading-[1.75]">
                        <span className="text-gold select-none font-display">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}

          {/* Quiz call */}
          <div className="border-t border-foreground/12 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="font-display text-2xl">Ready to prove it?</p>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
                {drawCount} of {module.quiz.length} questions, drawn at random —
                pass at {Math.round(PASS_THRESHOLD * 100)}%
              </p>
            </div>
            <button
              onClick={startQuiz}
              className="inline-flex items-center justify-center gap-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-500 font-body text-[11px] tracking-[0.28em] uppercase h-14 px-10 shrink-0"
            >
              Start the quiz <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </TrainingShell>
    );
  }

  /* ---- QUIZ ---- */
  if (mode === "quiz") {
    const q = run[current];
    const selected = answers[q.id];
    const isLast = current === run.length - 1;
    return (
      <TrainingShell>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
          <div className="flex items-end justify-between mb-3">
            <span className="font-accent italic text-base text-muted-foreground truncate pr-4">
              {module.title}
            </span>
            <span className="font-display text-3xl leading-none whitespace-nowrap">
              {String(current + 1).padStart(2, "0")}
              <span className="text-muted-foreground/50 text-lg">
                {" "}
                / {String(run.length).padStart(2, "0")}
              </span>
            </span>
          </div>
          <div className="h-[2px] bg-foreground/10 mb-10 relative">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-500"
              style={{ width: `${((current + 1) / run.length) * 100}%` }}
            />
          </div>

          <h1 className="font-display text-[1.65rem] sm:text-3xl leading-snug mb-8">
            {q.question}
          </h1>

          <div className="space-y-3" role="radiogroup" aria-label="Answers">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                  className={`w-full flex items-stretch text-left transition-colors duration-300 border ${
                    isSelected
                      ? "border-charcoal bg-charcoal text-cream"
                      : "border-foreground/20 hover:border-gold/70 hover:bg-foreground/[0.03]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-12 sm:w-14 shrink-0 font-display text-xl border-r ${
                      isSelected
                        ? "border-cream/20 text-gold-light"
                        : "border-foreground/15 text-gold-dark"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="px-4 py-4 text-[15px] leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              disabled={selected === undefined || submitting}
              onClick={isLast ? submit : () => setCurrent((c) => c + 1)}
              className="inline-flex items-center justify-center gap-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-500 font-body text-[11px] tracking-[0.28em] uppercase h-12 px-8 disabled:opacity-40 disabled:pointer-events-none"
            >
              {isLast ? (submitting ? "Submitting…" : "Submit") : "Next"}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </TrainingShell>
    );
  }

  /* ---- RESULTS ---- */
  const passed = finalPct >= PASS_THRESHOLD;
  const correctCount = scored.filter((s) => s.correct).length;
  return (
    <TrainingShell>
      {/* Verdict spread */}
      <div className="bg-charcoal text-cream grain relative overflow-hidden">
        <span
          aria-hidden
          className="absolute -right-6 -bottom-20 font-display text-[18rem] leading-none text-cream/[0.05] select-none pointer-events-none"
        >
          {Math.round(finalPct * 100)}
        </span>
        <div className="relative z-[2] max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <p className="eyebrow !text-gold-light mb-6">{module.title}</p>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <span className="font-display text-[clamp(5.5rem,14vw,10rem)] leading-[0.8]">
              {correctCount}
              <span className="text-cream/40 text-[0.5em]"> / {run.length}</span>
            </span>
            {passed ? (
              <span className="inline-block -rotate-6 border-2 border-gold-light text-gold-light px-4 py-2 font-body text-sm tracking-[0.34em] uppercase mb-3">
                Passed
              </span>
            ) : (
              <span className="font-accent italic text-xl text-cream/60 mb-3">
                almost — {Math.round(PASS_THRESHOLD * 100)}% to pass
              </span>
            )}
          </div>
          <p className="font-accent italic text-lg text-cream/55 mt-6 max-w-lg">
            {passed
              ? "Great work — now let it show on the floor."
              : "Review below, then go again. The next draw mixes in fresh questions."}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={startQuiz}
              className={`inline-flex items-center justify-center gap-2 font-body text-[10px] tracking-[0.26em] uppercase h-12 px-7 transition-colors duration-500 ${
                passed
                  ? "border border-cream/30 text-cream/80 hover:border-cream hover:text-cream"
                  : "bg-gold text-charcoal hover:bg-gold-light"
              }`}
            >
              Retake quiz
            </button>
            <Link
              href="/training"
              className={`inline-flex items-center justify-center gap-2 font-body text-[10px] tracking-[0.26em] uppercase h-12 px-7 transition-colors duration-500 ${
                passed
                  ? "bg-gold text-charcoal hover:bg-gold-light"
                  : "border border-cream/30 text-cream/80 hover:border-cream hover:text-cream"
              }`}
            >
              Back to the manual
            </Link>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="chapter">R</span>
          <h2 className="font-display text-2xl sm:text-3xl">The review</h2>
        </div>
        <div>
          {scored.map(({ rq, selected, correct }) => (
            <div key={rq.id} className="border-t border-foreground/12 py-6">
              <div className="flex gap-4">
                {correct ? (
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5">
                  <p className="font-display text-lg leading-snug">{rq.question}</p>
                  {!correct && selected !== undefined && (
                    <p className="text-sm text-destructive">
                      Your answer — {rq.options[selected]}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-gold-dark mr-2">
                      Correct
                    </span>
                    {rq.options[rq.correctIndex]}
                  </p>
                  <p className="font-accent italic text-[15px] text-muted-foreground leading-relaxed">
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
