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
  CERT_TYPES,
  PHASE_DUE_DAYS,
  PHASE_TITLES,
  electiveModulesFor,
  requiredModulesFor,
  type Role,
  type Location,
  type TrainingModule,
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

export type CertRecord = {
  issuedAt: string; // ISO
  expiresAt: string; // ISO
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
  /** Compliance certifications keyed by cert type id (see CERT_TYPES). */
  certs?: Record<string, CertRecord>;
  /** Set when the employee signs the standards acknowledgment. */
  acknowledgedAt?: string | null;
  /** The full name the employee typed as their signature. */
  signatureName?: string | null;
};

// ---------------------------------------------------------------------------
// Compliance helpers
// ---------------------------------------------------------------------------
export type CertStatus = "valid" | "expiring" | "expired" | "missing" | "n/a";

const EXPIRING_SOON_DAYS = 60;

export function certStatus(emp: EmployeeRecord, certTypeId: string): CertStatus {
  const type = CERT_TYPES.find((t) => t.id === certTypeId);
  if (!type || !type.appliesTo.includes(emp.role)) return "n/a";
  const cert = emp.certs?.[certTypeId];
  if (!cert) return "missing";
  const msLeft = new Date(cert.expiresAt).getTime() - Date.now();
  if (msLeft < 0) return "expired";
  if (msLeft < EXPIRING_SOON_DAYS * 86_400_000) return "expiring";
  return "valid";
}

/** Cert types that need attention (missing/expiring/expired) for this employee. */
export function certIssues(emp: EmployeeRecord): { typeId: string; status: CertStatus }[] {
  return CERT_TYPES.map((t) => ({ typeId: t.id, status: certStatus(emp, t.id) })).filter(
    (c) => c.status === "missing" || c.status === "expiring" || c.status === "expired",
  );
}

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
// Onboarding plan — phased due dates derived from the hire (first sign-in) date
// ---------------------------------------------------------------------------
export type PlanPhase = {
  phase: 1 | 2 | 3;
  title: string;
  dueDate: Date;
  complete: boolean;
  overdue: boolean;
  modules: TrainingModule[];
};

/** The employee's phased onboarding plan (only phases that apply to their role). */
export function onboardingPlan(emp: EmployeeRecord): PlanPhase[] {
  const required = requiredModulesFor(emp.role, emp.location);
  const hired = new Date(emp.createdAt).getTime();
  return ([1, 2, 3] as const)
    .map((phase) => {
      const modules = required.filter((m) => m.phase === phase);
      const dueDate = new Date(hired + PHASE_DUE_DAYS[phase] * 86_400_000);
      const complete =
        modules.length > 0 && modules.every((m) => emp.modules[m.id]?.passed);
      return {
        phase,
        title: PHASE_TITLES[phase],
        dueDate,
        complete,
        overdue: !complete && Date.now() > dueDate.getTime(),
        modules,
      };
    })
    .filter((p) => p.modules.length > 0);
}

/** Hired long enough ago that due-date chips would be noise rather than help. */
export function isVeteran(emp: EmployeeRecord): boolean {
  return Date.now() - new Date(emp.createdAt).getTime() > 30 * 86_400_000;
}

export type OnboardingStatus = "complete" | "on-track" | "behind";

export function onboardingStatus(emp: EmployeeRecord): OnboardingStatus {
  if (isFullyTrained(emp)) return "complete";
  return onboardingPlan(emp).some((p) => p.overdue) ? "behind" : "on-track";
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
  recordAttempt: (moduleId: string, answers: AttemptAnswer[]) => Promise<Result>;
  recordAcknowledgment: (signatureName: string) => Promise<Result>;
  /** Manager-only: load every employee's progress from the server. */
  refreshTeam: () => Promise<void>;
  /** Manager-only: set a new 4-digit PIN for an employee who forgot theirs. */
  resetEmployeePin: (employeeId: string, newPin: string) => Promise<Result>;
  /** Manager-only: remove an employee and all their progress. */
  removeEmployee: (employeeId: string) => Promise<Result>;
  /** Manager-only: record a compliance certification (issued date, ISO). */
  setCert: (employeeId: string, certTypeId: string, issuedAt: string) => Promise<Result>;
  /** Manager-only: clear a recorded certification. */
  removeCert: (employeeId: string, certTypeId: string) => Promise<Result>;
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

  // Persists an attempt. The SCORE shown to the employee is computed locally
  // from their answers — this only reports whether saving succeeded, so a
  // network failure can never masquerade as a failing grade.
  const recordAttempt = useCallback(
    async (moduleId: string, answers: AttemptAnswer[]): Promise<Result> => {
      const res = await api<{ pct: number; module: ModuleProgress }>("attempt", {
        method: "POST",
        body: { moduleId, answers },
      });
      if (!res.ok) return { ok: false, error: res.error };
      // Reflect the saved progress locally without a full refetch.
      setCurrentEmployee((prev) =>
        prev
          ? { ...prev, modules: { ...prev.modules, [moduleId]: res.data.module } }
          : prev,
      );
      return { ok: true };
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

  const resetEmployeePin = useCallback(
    async (employeeId: string, newPin: string): Promise<Result> => {
      const res = await api<{ ok: true }>("reset-pin", {
        method: "POST",
        body: { employeeId, newPin },
      });
      return res.ok ? { ok: true } : { ok: false, error: res.error };
    },
    [],
  );

  const removeEmployee = useCallback(
    async (employeeId: string): Promise<Result> => {
      const res = await api<{ ok: true }>("remove-employee", {
        method: "POST",
        body: { employeeId },
      });
      if (!res.ok) return { ok: false, error: res.error };
      setAllEmployees((prev) => prev.filter((e) => e.id !== employeeId));
      return { ok: true };
    },
    [],
  );

  const setCert = useCallback(
    async (employeeId: string, certTypeId: string, issuedAt: string): Promise<Result> => {
      const res = await api<{ employee: EmployeeRecord }>("set-cert", {
        method: "POST",
        body: { employeeId, certType: certTypeId, issuedAt },
      });
      if (!res.ok) return { ok: false, error: res.error };
      setAllEmployees((prev) =>
        prev.map((e) => (e.id === employeeId ? res.data.employee : e)),
      );
      return { ok: true };
    },
    [],
  );

  const removeCert = useCallback(
    async (employeeId: string, certTypeId: string): Promise<Result> => {
      const res = await api<{ ok: true }>("remove-cert", {
        method: "POST",
        body: { employeeId, certType: certTypeId },
      });
      if (!res.ok) return { ok: false, error: res.error };
      setAllEmployees((prev) =>
        prev.map((e) =>
          e.id === employeeId
            ? { ...e, certs: Object.fromEntries(Object.entries(e.certs ?? {}).filter(([k]) => k !== certTypeId)) }
            : e,
        ),
      );
      return { ok: true };
    },
    [],
  );

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
      resetEmployeePin,
      removeEmployee,
      setCert,
      removeCert,
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
      resetEmployeePin,
      removeEmployee,
      setCert,
      removeCert,
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
