import { Injectable, signal, computed } from '@angular/core';

type Credentials = { username: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Emits true when a token exists */
  readonly isAuthenticated = computed(() => this.token() !== null);
  /** Loading state for login */
  readonly loading = signal(false);
  /** Last login error (human readable) */
  readonly error = signal<string | null>(null);

  private readonly key = 'auth_token';
  private readonly token = signal<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(this.key) : null
  );

  async login({ username, password }: Credentials): Promise<boolean> {
    this.error.set(null);
    this.loading.set(true);
    try {
      // Mocked check
      const ok = username === 'demo' && password === 'demo';
      if (!ok) {
        this.error.set('Usuario o contraseña inválidos. Usa demo/demo.');
        return false;
      }
      const fake = 'FAKE_TOKEN';
      this.setToken(fake);
      return true;
    } catch (e) {
      this.error.set('Error inesperado. Inténtalo de nuevo.');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.clearToken();
  }

  /** Persist token in both signal and localStorage */
  private setToken(tok: string): void {
    this.token.set(tok);
    try { localStorage.setItem(this.key, tok); } catch {}
  }
  private clearToken(): void {
    this.token.set(null);
    try { localStorage.removeItem(this.key); } catch {}
  }
}
