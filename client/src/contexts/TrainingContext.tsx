// Training progress store + React context.
//
// PHASE 1: persistence is localStorage on a single device. All read/write goes
// through the functions in the "STORAGE LAYER" block below. In Phase 2, replace
// the bodies of loadData / saveData (and signIn) with API calls — the rest of
// the app (and this context's surface) does not change.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PASS_THRESHOLD,
  ROLES,
  electiveModulesFor,
  requiredModulesFor,
  type Role,
} from "@/lib/training/content";

// Re-exported so UI components keep a single import surface for training state.
export { ROLES };
export type { Role };

export const LOCATIONS = ["Andiamo", "Cafe Figaro", "Don Giovanni"] as const;
export type Location = (typeof LOCATIONS)[number];

export type ModuleProgress = {
  bestPct: number; // 0..1
  passed: boolean;
  attempts: number;
  lastAttemptAt: string; // ISO
  wrongQuestionIds: string[]; // from the best attempt
};

export type EmployeeRecord = {
  name: string;
  role: Role;
  location: Location;
  createdAt: string;
  modules: Record<string, ModuleProgress>;
  /** Set when the employee signs the standards acknowledgment. */
  acknowledgedAt?: string;
  /** The full name the employee typed as their signature. */
  signatureName?: string;
};

type TrainingData = { employees: Record<string, EmployeeRecord> };

export type AttemptAnswer = { questionId: string; correct: boolean };

// ---------------------------------------------------------------------------
// STORAGE LAYER (swap this for an API in Phase 2)
// ---------------------------------------------------------------------------
const DATA_KEY = "andiamo_training_v1";
const USER_KEY = "andiamo_training_user";

function loadData(): TrainingData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw) as TrainingData;
  } catch {
    // ignore corrupt data
  }
  return { employees: {} };
}

function saveData(data: TrainingData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

const normalizeKey = (name: string) => name.trim().toLowerCase();

// ---------------------------------------------------------------------------
// Derived helpers (pure)
// ---------------------------------------------------------------------------
/** Completion against the modules *required for the employee's role*. */
export function overallCompletion(emp: EmployeeRecord | undefined): number {
  if (!emp) return 0;
  const required = requiredModulesFor(emp.role);
  if (required.length === 0) return 0;
  const passed = required.filter((m) => emp.modules[m.id]?.passed).length;
  return passed / required.length;
}

/** Required modules the employee has attempted but not yet passed. */
export function weakAreas(emp: EmployeeRecord | undefined): string[] {
  if (!emp) return [];
  return requiredModulesFor(emp.role)
    .filter((m) => {
      const p = emp.modules[m.id];
      return p && p.attempts > 0 && !p.passed;
    })
    .map((m) => m.title);
}

/** Passed modules beyond the role's requirements (studied voluntarily). */
export function electivePassCount(emp: EmployeeRecord | undefined): number {
  if (!emp) return 0;
  return electiveModulesFor(emp.role).filter((m) => emp.modules[m.id]?.passed)
    .length;
}

/** True once every module required for the employee's role is passed. */
export function isFullyTrained(emp: EmployeeRecord | undefined): boolean {
  if (!emp) return false;
  const required = requiredModulesFor(emp.role);
  return required.length > 0 && required.every((m) => emp.modules[m.id]?.passed);
}

/** Fully trained AND has signed the standards acknowledgment. */
export function isCertified(emp: EmployeeRecord | undefined): boolean {
  return isFullyTrained(emp) && !!emp?.acknowledgedAt;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
type TrainingContextValue = {
  currentEmployee: EmployeeRecord | undefined;
  allEmployees: EmployeeRecord[];
  signIn: (name: string, role: Role, location: Location) => void;
  signOut: () => void;
  recordAttempt: (moduleId: string, answers: AttemptAnswer[]) => number;
  recordAcknowledgment: (signatureName: string) => void;
  resetAllData: () => void;
};

const TrainingContext = createContext<TrainingContextValue | null>(null);

export function TrainingProvider({ children }: { children: ReactNode }) {
  // Initialize synchronously from localStorage so currentEmployee is correct on
  // the first render — otherwise pages that redirect when signed-out (module,
  // admin) bounce the user on refresh/deep-link before hydration completes.
  const [data, setData] = useState<TrainingData>(() => loadData());
  const [currentKey, setCurrentKey] = useState<string | null>(() =>
    localStorage.getItem(USER_KEY),
  );

  // Persist data whenever it changes.
  useEffect(() => {
    saveData(data);
  }, [data]);

  const signIn = useCallback(
    (name: string, role: Role, location: Location) => {
      const key = normalizeKey(name);
      setData((prev) => {
        if (prev.employees[key]) {
          // Update role/location in case they changed; keep progress.
          return {
            employees: {
              ...prev.employees,
              [key]: { ...prev.employees[key], role, location, name: name.trim() },
            },
          };
        }
        const record: EmployeeRecord = {
          name: name.trim(),
          role,
          location,
          createdAt: new Date().toISOString(),
          modules: {},
        };
        return { employees: { ...prev.employees, [key]: record } };
      });
      localStorage.setItem(USER_KEY, key);
      setCurrentKey(key);
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setCurrentKey(null);
  }, []);

  const recordAttempt = useCallback(
    (moduleId: string, answers: AttemptAnswer[]): number => {
      const correct = answers.filter((a) => a.correct).length;
      const pct = answers.length ? correct / answers.length : 0;
      const passed = pct >= PASS_THRESHOLD;
      const wrong = answers.filter((a) => !a.correct).map((a) => a.questionId);

      setData((prev) => {
        if (!currentKey || !prev.employees[currentKey]) return prev;
        const emp = prev.employees[currentKey];
        const existing = emp.modules[moduleId];
        const isBest = !existing || pct >= existing.bestPct;
        const nextModule: ModuleProgress = {
          bestPct: existing ? Math.max(existing.bestPct, pct) : pct,
          passed: existing ? existing.passed || passed : passed,
          attempts: (existing?.attempts ?? 0) + 1,
          lastAttemptAt: new Date().toISOString(),
          wrongQuestionIds: isBest ? wrong : existing.wrongQuestionIds,
        };
        return {
          employees: {
            ...prev.employees,
            [currentKey]: {
              ...emp,
              modules: { ...emp.modules, [moduleId]: nextModule },
            },
          },
        };
      });

      return pct;
    },
    [currentKey],
  );

  const recordAcknowledgment = useCallback(
    (signatureName: string) => {
      setData((prev) => {
        if (!currentKey || !prev.employees[currentKey]) return prev;
        const emp = prev.employees[currentKey];
        return {
          employees: {
            ...prev.employees,
            [currentKey]: {
              ...emp,
              acknowledgedAt: new Date().toISOString(),
              signatureName: signatureName.trim(),
            },
          },
        };
      });
    },
    [currentKey],
  );

  const resetAllData = useCallback(() => {
    setData({ employees: {} });
    localStorage.removeItem(USER_KEY);
    setCurrentKey(null);
  }, []);

  const value = useMemo<TrainingContextValue>(
    () => ({
      currentEmployee: currentKey ? data.employees[currentKey] : undefined,
      allEmployees: Object.values(data.employees),
      signIn,
      signOut,
      recordAttempt,
      recordAcknowledgment,
      resetAllData,
    }),
    [currentKey, data, signIn, signOut, recordAttempt, recordAcknowledgment, resetAllData],
  );

  return (
    <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>
  );
}

export function useTraining(): TrainingContextValue {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error("useTraining must be used within a TrainingProvider");
  return ctx;
}
