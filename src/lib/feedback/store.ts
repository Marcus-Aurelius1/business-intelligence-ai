'use client';

// Lightweight, local-only feedback loop (no backend).
//
// Feedback on an insight/recommendation is persisted to localStorage and exposed as a
// live list via useSyncExternalStore, so submitting feedback visibly updates a local
// history that survives reloads and syncs across tabs — demonstrable end to end.

import { useSyncExternalStore, useCallback } from 'react';

export type FeedbackVerdict = 'helpful' | 'not_helpful';

export interface FeedbackEntry {
  id: string;
  targetId: string;      // what the feedback is about (e.g. a recommendation id)
  targetLabel: string;   // human-readable label for the target
  verdict: FeedbackVerdict;
  comment: string;       // optional correction / comment
  scenario: string;      // scenario active when feedback was given (for context)
  createdAt: number;     // epoch ms — set in an event handler, never during render
}

const FEEDBACK_KEY = 'bi.feedback';
const MAX_ENTRIES = 50; // keep the local history bounded

// --- external store ---
const listeners = new Set<() => void>();

// getSnapshot must be referentially stable while the underlying string is unchanged,
// otherwise useSyncExternalStore re-renders forever. Cache the parsed array by raw string.
let cache: { raw: string | null; parsed: FeedbackEntry[] } = { raw: null, parsed: [] };
const EMPTY: FeedbackEntry[] = [];

function readRaw(): string | null {
  try {
    return localStorage.getItem(FEEDBACK_KEY);
  } catch {
    return null;
  }
}

function isEntry(v: unknown): v is FeedbackEntry {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.targetId === 'string' &&
    (e.verdict === 'helpful' || e.verdict === 'not_helpful') &&
    typeof e.createdAt === 'number'
  );
}

function getSnapshot(): FeedbackEntry[] {
  const raw = readRaw();
  if (raw === cache.raw) return cache.parsed;
  let parsed: FeedbackEntry[] = [];
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) parsed = data.filter(isEntry);
    } catch {
      parsed = [];
    }
  }
  cache = { raw, parsed };
  return parsed;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === FEEDBACK_KEY) callback();
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

function writeAll(entries: FeedbackEntry[]) {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore persistence failures
  }
  emit();
}

export interface FeedbackStats {
  total: number;
  helpful: number;
  notHelpful: number;
}

export interface UseFeedbackResult {
  items: FeedbackEntry[];
  stats: FeedbackStats;
  submit: (input: { targetId: string; targetLabel: string; verdict: FeedbackVerdict; comment?: string; scenario: string }) => void;
  clearAll: () => void;
}

export function useFeedback(): UseFeedbackResult {
  // Server + first-client render see an empty list (no hydration mismatch); real history
  // is read from localStorage immediately after.
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const submit = useCallback(
    (input: { targetId: string; targetLabel: string; verdict: FeedbackVerdict; comment?: string; scenario: string }) => {
      const entry: FeedbackEntry = {
        id: `fb_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`,
        targetId: input.targetId,
        targetLabel: input.targetLabel,
        verdict: input.verdict,
        comment: (input.comment ?? '').trim(),
        scenario: input.scenario,
        createdAt: Date.now(),
      };
      writeAll([entry, ...getSnapshot()]);
    },
    []
  );

  const clearAll = useCallback(() => writeAll([]), []);

  const stats: FeedbackStats = {
    total: items.length,
    helpful: items.filter((i) => i.verdict === 'helpful').length,
    notHelpful: items.filter((i) => i.verdict === 'not_helpful').length,
  };

  return { items, stats, submit, clearAll };
}
