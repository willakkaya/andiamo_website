// Training progress store + React context.
//
// PHASE 2: persistence is a shared Postgres database, reached through the
// /api/training/* serverless functions. Auth is name + 4-digit PIN; a session
// token (returned by sign-in) is kept in localStorage and sent as a bearer
// token on every request. All network access goes through the API LAYER block
// below, so the rest of the app only depends on this context's surface and the
// pure derived helpers.

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
  ROLES,
  LOCATIONS,
  electiveModulesFor,
  requiredModulesFor,
  type Role,
  type Location,
} from "@/lib/training/content";

// Re-exported so UI components keep a single import surface for training state.
export { ROLES, LOCATIONS };
export type { Role, Location };

export type ModuleProgress = {
  bestPct: number; // 0..1
  passed: boolean;
  attempts: number;
  lastAttemptAt: string; // ISO
  wrongQuestionIds: string[]; // from the best attempt
};

// Mirrors the server's EmployeeDTO.
export type EmployeeRecord = {
  id: string;
  name: string;
  role: Role;
  location: Location;
  isManager: boolean;
  createdAt: string;
  modules: Record<string, ModuleProgress>;
  /** Set when the employee signs the standards acknowledgment. */
  acknowledgedAt?: string | null;
  /** The full name the employee typed as their signature. */
  signatureName?: string | null;
};

export type AttemptAnswer = { questionId: string; correct: boolean };

// ---------------------------------------------------------------------------
// API LAYER (the only place that talks to the network)
// ---------------------------------------------------------------------------
const TOKEN_KEY = "andiamo_training_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (options.auth !== false) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(`/api/training?action=${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: json.error ?? "Something went wrong", status: res.status };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Network error — please try again", status: 0 };
  }
}

// ---------------------------------------------------------------------------
// Derived helpers (pure) — unchanged surface from Phase 1
// ---------------------------------------------------------------------------
/** Completion against the modules *required for the employee's role*. */
export function overallCompletion(emp: EmployeeRecord | undefined): number {
  if (!emp) return 0;
  const required = requiredModulesFor(emp.role, emp.location);
  if (required.length === 0) return 0;
  const passed = required.filter((m) => emp.modules[m.id]?.passed).length;
  return passed / required.length;
}

/** Required modules the employee has attempted but not yet passed. */
export function weakAreas(emp: EmployeeRecord | undefined): string[] {
  if (!emp) return [];
  return requiredModulesFor(emp.role, emp.location)
    .filter((m) => {
      const p = emp.modules[m.id];
      return p && p.attempts > 0 && !p.passed;
    })
    .map((m) => m.title);
}

/** Passed modules beyond the role's requirements (studied voluntarily). */
export function electivePassCount(emp: EmployeeRecord | undefined): number {
  if (!emp) return 0;
  return electiveModulesFor(emp.role, emp.location).filter(
    (m) => emp.modules[m.id]?.passed,
  ).length;
}

/** True once every module required for the employee's role is passed. */
export function isFullyTrained(emp: EmployeeRecord | undefined): boolean {
  if (!emp) return false;
  const required = requiredModulesFor(emp.role, emp.location);
  return required.length > 0 && required.every((m) => emp.modules[m.id]?.passed);
}

/** Fully trained AND has signed the standards acknowledgment. */
export function isCertified(emp: EmployeeRecord | undefined): boolean {
  return isFullyTrained(emp) && !!emp?.acknowledgedAt;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
export type SignInArgs = {
  name: string;
  role: Role;
  location: Location;
  pin: string;
  managerCode?: string;
};

export type Result = { ok: boolean; error?: string };

type TrainingContextValue = {
  /** "loading" until the saved session (if any) is restored. */
  status: "loading" | "ready";
  currentEmployee: EmployeeRecord | undefined;
  allEmployees: EmployeeRecord[];
  signIn: (args: SignInArgs) => Promise<Result>;
  signOut: () => void;
  recordAttempt: (moduleId: string, answers: AttemptAnswer[]) => Promise<number>;
  recordAcknowledgment: (signatureName: string) => Promise<Result>;
  /** Manager-only: load every employee's progress from the server. */
  refreshTeam: () => Promise<void>;
};

const TrainingContext = createContext<TrainingContextValue | null>(null);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeRecord | undefined>();
  const [allEmployees, setAllEmployees] = useState<EmployeeRecord[]>([]);

  // Restore the session on load: if a token exists, fetch the employee.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setStatus("ready");
        return;
      }
      const res = await api<{ employee: EmployeeRecord }>("me");
      if (cancelled) return;
      if (res.ok) {
        setCurrentEmployee(res.data.employee);
      } else if (res.status === 401 || res.status === 404) {
        clearToken();
      }
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (args: SignInArgs): Promise<Result> => {
    const res = await api<{ employee: EmployeeRecord; token: string }>("signin", {
      method: "POST",
      body: args,
      auth: false,
    });
    if (!res.ok) return { ok: false, error: res.error };
    setToken(res.data.token);
    setCurrentEmployee(res.data.employee);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setCurrentEmployee(undefined);
    setAllEmployees([]);
  }, []);

  const recordAttempt = useCallback(
    async (moduleId: string, answers: AttemptAnswer[]): Promise<number> => {
      const res = await api<{ pct: number; module: ModuleProgress }>("attempt", {
        method: "POST",
        body: { moduleId, answers },
      });
      if (!res.ok) return 0;
      // Reflect the saved progress locally without a full refetch.
      setCurrentEmployee((prev) =>
        prev
          ? { ...prev, modules: { ...prev.modules, [moduleId]: res.data.module } }
          : prev,
      );
      return res.data.pct;
    },
    [],
  );

  const recordAcknowledgment = useCallback(
    async (signatureName: string): Promise<Result> => {
      const res = await api<{ employee: EmployeeRecord }>("acknowledge", {
        method: "POST",
        body: { signatureName },
      });
      if (!res.ok) return { ok: false, error: res.error };
      setCurrentEmployee(res.data.employee);
      return { ok: true };
    },
    [],
  );

  const refreshTeam = useCallback(async () => {
    const res = await api<{ employees: EmployeeRecord[] }>("employees");
    if (res.ok) setAllEmployees(res.data.employees);
  }, []);

  const value = useMemo<TrainingContextValue>(
    () => ({
      status,
      currentEmployee,
      allEmployees,
      signIn,
      signOut,
      recordAttempt,
      recordAcknowledgment,
      refreshTeam,
    }),
    [
      status,
      currentEmployee,
      allEmployees,
      signIn,
      signOut,
      recordAttempt,
      recordAcknowledgment,
      refreshTeam,
    ],
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
