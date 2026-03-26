import { getCurrentUser, login, logout } from '@/lib/api';

export async function requireSession() {
  return getCurrentUser();
}

export async function signIn(email: string, senha: string) {
  return login(email, senha);
}

export async function signOut() {
  return logout();
}
