// ── src/utils/authStorage.ts ──────────────────────────────────────────────────
// Gère la persistance des comptes utilisateurs et de la session active.
//
// ⚠️  SÉCURITÉ : bcryptjs est utilisé pour hasher les mots de passe côté client.
// C'est mieux que simpleHash(), mais le stockage reste dans localStorage.
// En production, migrez vers un backend avec PostgreSQL / Supabase / Firebase.
//


import bcrypt from "bcryptjs";

const USERS_KEY   = "trade-dashboard_users_v1";
const SESSION_KEY = "trade-dashboard_session_v1";
const SALT_ROUNDS = 10;

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // bcrypt hash
  name?: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name?: string;
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

/** Seed les comptes de test en dev (hash bcrypt généré une seule fois) */
async function ensureTestUsers(): Promise<void> {
  const users = loadUsers();
  const testAccounts = [
    { email: "dev@test.com",      password: "Dev123!",     name: "Dev"   },
    { email: "alice@example.com", password: "password123", name: "Alice" },
    { email: "bob@example.com",   password: "password123", name: "Bob"   },
  ];
  let changed = false;
  for (const t of testAccounts) {
    if (!users.find(u => u.email === t.email)) {
      const passwordHash = await bcrypt.hash(t.password, SALT_ROUNDS);
      users.push({
        id: Math.random().toString(36).slice(2, 9),
        email: t.email,
        passwordHash,
        name: t.name,
        createdAt: new Date().toISOString(),
      });
      changed = true;
    }
  }
  if (changed) saveUsers(users);
}

// ── API publique — async (bcrypt est asynchrone) ────────────────────────────────

export type RegisterResult =
  | { ok: true;  user: StoredUser }
  | { ok: false; error: string };

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<RegisterResult> {
  await ensureTestUsers();
  const users     = loadUsers();
  const trimEmail = email.trim().toLowerCase();

  if (users.find(u => u.email === trimEmail)) {
    return { ok: false, error: "Un compte avec cet email existe déjà." };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user: StoredUser = {
    id: Math.random().toString(36).slice(2, 9),
    email: trimEmail,
    passwordHash,
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

export async function login(email: string, password: string): Promise<LoginResult> {
  await ensureTestUsers();
  const users     = loadUsers();
  const trimEmail = email.trim().toLowerCase();
  const user      = users.find(u => u.email === trimEmail);

  if (!user) {
    // Délai constant pour éviter le timing attack (même si côté client)
    await bcrypt.hash("dummy", SALT_ROUNDS);
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
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