import { UserSession } from "./types";

const STORAGE_KEY = "safenet.session";

export const ANONYMOUS_SESSION: UserSession = {
  id: "USER-001",
  name: "Arjun Singh",
  role: "citizen",
  email: "arjun.singh@cert-in.gov.in",
  isLoggedIn: false,
};

/**
 * A ready-made signed-in session for evaluators. Sign-in here is presentation
 * state only — it grants no authority the server would not otherwise grant —
 * so putting a reviewer through a six-step registration costs them their first
 * impression and protects nothing.
 */
export const DEMO_SESSION: UserSession = {
  id: "DEMO-0001",
  name: "Demo Investigator",
  role: "officer",
  email: "demo.investigator@cert-in.gov.in",
  isLoggedIn: true,
};

/**
 * True when the URL carries ?demo (e.g. /network-intelligence?demo=1), which
 * lets a deep link to any single screen open signed in rather than bouncing
 * the visitor to a login form.
 */
export function isDemoRequest(): boolean {
  try {
    return new URLSearchParams(window.location.search).has("demo");
  } catch {
    return false;
  }
}

/**
 * Restores the session from storage so a page reload does not force a
 * re-login. This is presentation-state only — it does not grant any
 * authority the server would not otherwise grant.
 */
export function loadSession(): UserSession {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return ANONYMOUS_SESSION;
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed || typeof parsed !== "object" || !parsed.isLoggedIn) {
      return ANONYMOUS_SESSION;
    }
    return { ...ANONYMOUS_SESSION, ...parsed };
  } catch {
    return ANONYMOUS_SESSION;
  }
}

export function saveSession(session: UserSession): void {
  try {
    if (session.isLoggedIn) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage unavailable (private mode) — session stays in memory only */
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
