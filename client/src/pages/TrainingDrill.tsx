import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import TrainingShell from "@/components/training/TrainingShell";
import { useTraining } from "@/contexts/TrainingContext";
import { MODULES, type QuizQuestion } from "@/lib/training/content";

// Practice mode: re-drills every question the employee got wrong on their best
// attempts, across all modules. Nothing here is recorded — the official score
// only moves when they retake the module quiz itself.

type DrillCard = {
  q: QuizQuestion;
  moduleId: string;
  moduleTitle: string;
  /** Options shuffled per session; index of the right answer after shuffling. */
  options: string[];
  correctIndex: number;
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

/** All questions the employee missed on best attempts, as shuffled drill cards. */
export function buildDrillDeck(
  wrongByModule: Record<string, string[]>,
): DrillCard[] {
  const cards: DrillCard[] = [];
  for (const m of MODULES) {
    const wrongIds = wrongByModule[m.id];
    if (!wrongIds?.length) continue;
    for (const q of m.quiz) {
      if (!wrongIds.includes(q.id)) continue;
      const options = shuffle(q.options);
      cards.push({
        q,
        moduleId: m.id,
        moduleTitle: m.title,
        options,
        correctIndex: options.indexOf(q.options[q.answer]),
      });
    }
  }
  return shuffle(cards);
}

export default function TrainingDrill() {
  const { status, currentEmployee } = useTraining();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (status === "ready" && !currentEmployee) navigate("/training");
  }, [status, currentEmployee, navigate]);

  // Deck is built once per visit so cards don't reshuffle mid-drill.
  const deck = useMemo(() => {
    if (!currentEmployee) return [];
    const wrongByModule: Record<string, string[]> = {};
    for (const [moduleId, p] of Object.entries(currentEmployee.modules)) {
      if (p.wrongQuestionIds.length) wrongByModule[moduleId] = p.wrongQuestionIds;
    }
    return buildDrillDeck(wrongByModule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployee?.id, status]);

  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  if (status === "loading" || !currentEmployee) {
    return (
      <TrainingShell>
        <p className="text-center text-muted-foreground py-24">Loading…</p>
      </TrainingShell>
    );
  }

  /* ---- Nothing to drill ---- */
  if (deck.length === 0) {
    return (
      <TrainingShell>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
          <p className="eyebrow mb-6">The drill</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-4">
            Nothing to sharpen.
          </h1>
          <p className="font-accent italic text-lg text-muted-foreground mb-10">
            No missed questions on record — either you're new here, or you're
            simply that good.
          </p>
          <Link
            href="/training"
            className="link-line inline-flex items-center gap-2 text-gold font-body text-[11px] tracking-[0.26em] uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to the manual
          </Link>
        </div>
      </TrainingShell>
    );
  }

  const done = current >= deck.length;

  /* ---- Wrap-up ---- */
  if (done) {
    const right = results.filter(Boolean).length;
    const moduleIds = Array.from(new Set(deck.map((c) => c.moduleId)));
    const toRetake = moduleIds
      .map((id) => MODULES.find((m) => m.id === id)!)
      .filter((m) => !currentEmployee.modules[m.id]?.passed);
    return (
      <TrainingShell>
        <div className="bg-charcoal text-cream grain relative overflow-hidden">
          <span
            aria-hidden
            className="absolute -right-6 -bottom-20 font-display text-[18rem] leading-none text-cream/[0.05] select-none pointer-events-none"
          >
            {right}
          </span>
          <div className="relative z-[2] max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-18">
            <p className="eyebrow !text-gold-light mb-6">Drill complete</p>
            <span className="font-display text-[clamp(5rem,13vw,9rem)] leading-[0.8]">
              {right}
              <span className="text-cream/40 text-[0.5em]"> / {deck.length}</span>
            </span>
            <p className="font-accent italic text-lg text-cream/55 mt-6 max-w-lg">
              {right === deck.length
                ? "Every one of your old misses, corrected. Now make it official."
                : "Better already. Run it again, or go make it official."}
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10">
          {toRetake.length > 0 && (
            <>
              <p className="font-body text-[10px] tracking-[0.26em] uppercase text-muted-foreground mb-2">
                Drills don't change your record — pass the module quiz to clear it
              </p>
              <div className="border-b border-foreground/15 mb-8">
                {toRetake.map((m) => (
                  <Link
                    key={m.id}
                    href={`/training/module/${m.id}`}
                    className="group flex items-center justify-between gap-4 border-t border-foreground/15 py-5 hover:bg-foreground/[0.03] transition-colors"
                  >
                    <span className="font-display text-xl">{m.title}</span>
                    <span className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.24em] uppercase text-foreground/60 group-hover:text-gold transition-colors">
                      Retake <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-4 pb-4">
            <button
              onClick={() => {
                setCurrent(0);
                setPicked(null);
                setResults([]);
              }}
              className="inline-flex items-center justify-center gap-2 bg-charcoal text-cream hover:bg-gold transition-colors duration-500 font-body text-[10px] tracking-[0.26em] uppercase h-12 px-7"
            >
              Run it again
            </button>
            <Link
              href="/training"
              className="inline-flex items-center justify-center gap-2 border border-foreground/25 text-foreground/70 hover:border-foreground hover:text-foreground transition-colors duration-300 font-body text-[10px] tracking-[0.26em] uppercase h-12 px-7"
            >
              Back to the manual
            </Link>
          </div>
        </div>
      </TrainingShell>
    );
  }

  /* ---- Card ---- */
  const card = deck[current];
  const answered = picked !== null;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    setResults((r) => [...r, i === card.correctIndex]);
  };

  return (
    <TrainingShell>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <div className="flex items-end justify-between mb-3">
          <span className="font-accent italic text-base text-muted-foreground truncate pr-4">
            The drill — {card.moduleTitle}
          </span>
          <span className="font-display text-3xl leading-none whitespace-nowrap">
            {String(current + 1).padStart(2, "0")}
            <span className="text-muted-foreground/50 text-lg">
              {" "}
              / {String(deck.length).padStart(2, "0")}
            </span>
          </span>
        </div>
        <div className="h-[2px] bg-foreground/10 mb-10 relative">
          <div
            className="absolute inset-y-0 left-0 bg-gold transition-all duration-500"
            style={{ width: `${((current + 1) / deck.length) * 100}%` }}
          />
        </div>

        <h1 className="font-display text-[1.65rem] sm:text-3xl leading-snug mb-8">
          {card.q.question}
        </h1>

        <div className="space-y-3">
          {card.options.map((opt, i) => {
            const isCorrect = i === card.correctIndex;
            const isPicked = picked === i;
            let frame = "border-foreground/20 hover:border-gold/70 hover:bg-foreground/[0.03]";
            let letter = "border-foreground/15 text-gold-dark";
            if (answered && isCorrect) {
              frame = "border-gold bg-gold/10";
              letter = "border-gold/40 text-gold-dark";
            } else if (answered && isPicked) {
              frame = "border-destructive/60 bg-destructive/5";
              letter = "border-destructive/30 text-destructive";
            } else if (answered) {
              frame = "border-foreground/10 opacity-50";
            }
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => choose(i)}
                className={`w-full flex items-stretch text-left transition-colors duration-300 border ${frame}`}
              >
                <span
                  className={`flex items-center justify-center w-12 sm:w-14 shrink-0 font-display text-xl border-r ${letter}`}
                >
                  {LETTERS[i]}
                </span>
                <span className="px-4 py-4 text-[15px] leading-snug flex-1">{opt}</span>
                {answered && isCorrect && (
                  <span className="flex items-center pr-4">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                  </span>
                )}
                {answered && isPicked && !isCorrect && (
                  <span className="flex items-center pr-4">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <p className="font-accent italic text-[15px] text-muted-foreground leading-relaxed mt-6 border-l-2 border-gold/50 pl-4">
            {card.q.explanation}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between pb-4">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit drill
          </Link>
          {answered && (
            <button
              onClick={() => {
                setPicked(null);
                setCurrent((c) => c + 1);
              }}
              className="inline-flex items-center justify-center gap-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-500 font-body text-[11px] tracking-[0.28em] uppercase h-12 px-8"
            >
              {current === deck.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </TrainingShell>
  );
}
