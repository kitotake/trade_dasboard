// ── Auth Storage ──────────────────────────────────────────────────────────────
// Gère la persistance des comptes utilisateurs et de la session active.

const USERS_KEY = "trade-dashboard_users_v1";
const SESSION_KEY = "trade-dashboard_session_v1";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // simple hash, pas de crypto réel côté client
  name?: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name?: string;
}

// Très simple "hash" côté client (ne pas utiliser en prod — utilisez un backend)
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

// ── Users ──────────────────────────────────────────────────────────────────────

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

// Seed les comptes de test s'ils n'existent pas encore
function ensureTestUsers(): void {
  const users = loadUsers();
  const testAccounts = [
    { email: "dev@test.com",       password: "Dev123!",     name: "Dev" },
    { email: "alice@example.com",  password: "password123", name: "Alice" },
    { email: "bob@example.com",    password: "password123", name: "Bob" },
  ];
  let changed = false;
  for (const t of testAccounts) {
    if (!users.find(u => u.email === t.email)) {
      users.push({
        id: Math.random().toString(36).slice(2, 9),
        email: t.email,
        passwordHash: simpleHash(t.password),
        name: t.name,
        createdAt: new Date().toISOString(),
      });
      changed = true;
    }
  }
  if (changed) saveUsers(users);
}

// ── API publique ────────────────────────────────────────────────────────────────

export type RegisterResult =
  | { ok: true;  user: StoredUser }
  | { ok: false; error: string };

export function register(email: string, password: string, name?: string): RegisterResult {
  ensureTestUsers();
  const users = loadUsers();
  const trimEmail = email.trim().toLowerCase();

  if (users.find(u => u.email === trimEmail)) {
    return { ok: false, error: "Un compte avec cet email existe déjà." };
  }

  const user: StoredUser = {
    id: Math.random().toString(36).slice(2, 9),
    email: trimEmail,
    passwordHash: simpleHash(password),
    name: name?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

export type LoginResult =
  | { ok: true;  user: StoredUser }
  | { ok: false; error: string };

export function login(email: string, password: string): LoginResult {
  ensureTestUsers();
  const users = loadUsers();
  const trimEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email === trimEmail);

  if (!user) {
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }
  if (user.passwordHash !== simpleHash(password)) {
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }
  return { ok: true, user };
}

// ── Session ────────────────────────────────────────────────────────────────────

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
