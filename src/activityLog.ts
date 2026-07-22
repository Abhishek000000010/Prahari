import { useEffect, useState } from "react";

/**
 * A record of what this deployment has ACTUALLY processed.
 *
 * The dashboard previously showed invented national totals ("48,931 threats
 * neutralized") next to a threat feed whose timestamps were literal strings —
 * "2 mins ago" still read "2 mins ago" ten minutes later. Both are obvious to
 * anyone who looks for more than a moment, and they undermine the modules that
 * genuinely do work.
 *
 * Every entry here comes from a real analysis the user ran: a note scanned, a
 * call transcript classified, an identifier checked. The counts start at zero
 * and only move when the system does something, which is the entire point —
 * a number that grows while you watch is worth more than a large invented one.
 *
 * Storage is per-browser rather than server-side because the API runs on
 * serverless functions with no durable disk; a shared counter there would
 * reset unpredictably and be less honest, not more.
 */

export type ActivityModule = "netra" | "scam" | "citizen";

export type ActivitySeverity = "critical" | "high" | "medium" | "safe";

export interface ActivityEntry {
  id: string;
  module: ActivityModule;
  /** What happened, in the operator's language. */
  title: string;
  /** Supporting evidence — a serial number, a classification, a handle. */
  detail: string;
  severity: ActivitySeverity;
  /** Real epoch milliseconds, so elapsed time is computed, never written. */
  at: number;
}

const STORAGE_KEY = "safenet.activity";
const CHANGE_EVENT = "safenet:activity-changed";
const MAX_ENTRIES = 60;

export const MODULE_LABELS: Record<ActivityModule, string> = {
  netra: "NETRA — Currency",
  scam: "Call Analyser",
  citizen: "Citizen Shield",
};

export function readActivity(): ActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

/** Append a real event. Newest first, capped so storage cannot grow forever. */
export function recordActivity(
  entry: Omit<ActivityEntry, "id" | "at">
): void {
  try {
    const next: ActivityEntry[] = [
      {
        ...entry,
        id: `EVT-${Date.now().toString(36).toUpperCase()}`,
        at: Date.now(),
      },
      ...readActivity(),
    ].slice(0, MAX_ENTRIES);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Same-tab listeners: the native "storage" event only fires in OTHER tabs,
    // so the dashboard would not update from a scan run beside it.
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* storage unavailable (private mode) — the feature is additive, so skip */
  }
}

export function clearActivity(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* no-op */
  }
}

/**
 * Live view of the ledger. Re-renders when an entry is added anywhere in the
 * app, and ticks on a timer so relative timestamps stay honest while a judge
 * is looking at the screen.
 */
export function useActivityLog(tickMs = 10_000) {
  const [entries, setEntries] = useState<ActivityEntry[]>(readActivity);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => setEntries(readActivity());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(timer);
  }, [tickMs]);

  return { entries, now };
}

/** "just now" / "3 min ago" / "2 hr ago" — derived, never stored. */
export function formatAgo(at: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)}d ago`;
}
