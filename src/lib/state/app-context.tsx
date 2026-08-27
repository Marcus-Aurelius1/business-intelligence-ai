'use client';

// Shared app state: the single source of truth for the active scenario and persona.
// Backed by localStorage via useSyncExternalStore so state survives reloads, stays
// consistent across pages, and syncs across tabs — all without a hydration mismatch
// (the server snapshot is the default, applied identically on the first client render).

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from 'react';
import { ScenarioType, isScenarioType } from '@/data/scenarios';
import { Persona, Role } from '@/types';

const PERSONAS: Persona[] = ['business_head', 'finance_controller', 'business_analyst'];

function isPersona(v: unknown): v is Persona {
  return typeof v === 'string' && (PERSONAS as string[]).includes(v);
}

const ROLES: Role[] = ['business_head', 'finance_controller', 'restricted'];

function isRole(v: unknown): v is Role {
  return typeof v === 'string' && (ROLES as string[]).includes(v);
}

const SCENARIO_KEY = 'bi.scenario';
const PERSONA_KEY = 'bi.persona';
const ROLE_KEY = 'bi.role';

const DEFAULT_SCENARIO: ScenarioType = 'primary';
const DEFAULT_PERSONA: Persona = 'business_head';
const DEFAULT_ROLE: Role = 'business_head';

// --- localStorage-backed external store ---
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  // Reflect changes made in other tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === SCENARIO_KEY || e.key === PERSONA_KEY || e.key === ROLE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function readScenario(): ScenarioType {
  try {
    const v = localStorage.getItem(SCENARIO_KEY);
    if (isScenarioType(v)) return v;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_SCENARIO;
}

function readPersona(): Persona {
  try {
    const v = localStorage.getItem(PERSONA_KEY);
    if (isPersona(v)) return v;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_PERSONA;
}

function readRole(): Role {
  try {
    const v = localStorage.getItem(ROLE_KEY);
    if (isRole(v)) return v;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_ROLE;
}

function writeScenario(next: ScenarioType) {
  try {
    localStorage.setItem(SCENARIO_KEY, next);
  } catch {
    // ignore persistence failures
  }
  emit();
}

function writePersona(next: Persona) {
  try {
    localStorage.setItem(PERSONA_KEY, next);
  } catch {
    // ignore persistence failures
  }
  emit();
}

function writeRole(next: Role) {
  try {
    localStorage.setItem(ROLE_KEY, next);
  } catch {
    // ignore persistence failures
  }
  emit();
}

interface AppState {
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
  persona: Persona;
  setPersona: (p: Persona) => void;
  role: Role;
  setRole: (r: Role) => void;
}

const AppStateContext = createContext<AppState>({
  scenario: DEFAULT_SCENARIO,
  setScenario: () => {},
  persona: DEFAULT_PERSONA,
  setPersona: () => {},
  role: DEFAULT_ROLE,
  setRole: () => {},
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  // getServerSnapshot returns the defaults, so SSR and the first client render match.
  const scenario = useSyncExternalStore(subscribe, readScenario, () => DEFAULT_SCENARIO);
  const persona = useSyncExternalStore(subscribe, readPersona, () => DEFAULT_PERSONA);
  const role = useSyncExternalStore(subscribe, readRole, () => DEFAULT_ROLE);

  const setScenario = useCallback((next: ScenarioType) => {
    writeScenario(isScenarioType(next) ? next : DEFAULT_SCENARIO);
  }, []);

  const setPersona = useCallback((next: Persona) => {
    writePersona(isPersona(next) ? next : DEFAULT_PERSONA);
  }, []);

  const setRole = useCallback((next: Role) => {
    writeRole(isRole(next) ? next : DEFAULT_ROLE);
  }, []);

  return (
    <AppStateContext.Provider value={{ scenario, setScenario, persona, setPersona, role, setRole }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  return useContext(AppStateContext);
}
