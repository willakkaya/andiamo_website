import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recordAttempt, verifyToken } from "../_lib/client";
import { configured, getBearer, methodGuard, wrap } from "../_lib/http";

type Answer = { questionId: string; correct: boolean };

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, "POST") || !configured(res)) return;

  const session = verifyToken(getBearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });

  const { moduleId, answers, passThreshold } = (req.body ?? {}) as {
    moduleId?: string;
    answers?: Answer[];
    passThreshold?: number;
  };
  if (!moduleId || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "moduleId and answers are required" });
  }

  const threshold = typeof passThreshold === "number" ? passThreshold : 0.8;
  const correct = answers.filter((a) => a.correct).length;
  const pct = correct / answers.length;
  const passed = pct >= threshold;
  const wrongQuestionIds = answers.filter((a) => !a.correct).map((a) => a.questionId);

  const row = await recordAttempt({
    employeeId: session.employeeId,
    moduleId,
    bestPct: pct,
    passed,
    wrongQuestionIds,
    passThreshold: threshold,
  });

  return res.status(200).json({
    pct,
    module: {
      bestPct: row.bestPct,
      passed: row.passed,
      attempts: row.attempts,
      lastAttemptAt: row.lastAttemptAt,
      wrongQuestionIds: row.wrongQuestionIds,
    },
  });
}

export default wrap(handler);
