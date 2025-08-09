import { ChangeDetectionStrategy, Component, inject, signal, computed, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Login</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="on" novalidate>
        <label for="username">Usuario</label>
        <input id="username" name="username" autocomplete="username" type="email"
               formControlName="username"
               [class.invalid]="submitted() && form.controls.username.invalid" />

        <label for="password">Contraseña</label>
        <input id="password" name="password" autocomplete="current-password" type="password"
               formControlName="password"
               [class.invalid]="submitted() && form.controls.password.invalid" />

        <button type="submit" [disabled]="disableSubmit()">Entrar</button>

        @if (auth.error()) {
          <div class="error" role="alert">{{ auth.error() }}</div>
        }
      </form>

      <p style="margin-top:8px; color:#555">Demo: <b>demo / demo</b></p>
    </div>
  `,
  styles: [`
    .container { width: min(95vw, 520px); margin: 48px auto; background: #fff; padding: 24px;
                 border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.06); }
    label { display:block; margin: 10px 0 6px; }
    input { width:100%; max-width:100%; box-sizing:border-box; padding:10px 12px;
            border:1px solid #ddd; border-radius:8px; overflow:hidden; text-overflow:ellipsis; }
    input.invalid { border-color:#ef4444; }
    button { margin-top:12px; padding:10px 16px; border:0; background:#2563eb; color:#fff; border-radius:8px; }
    button[disabled] { background:#93c5fd; }
    .error { color:#b91c1c; margin-top:8px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements AfterViewInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  protected readonly auth = inject<AuthService>(AuthService);

  protected readonly form = this.fb.group({
    username: this.fb.control('', { validators: [Validators.required] }),
    password: this.fb.control('', { validators: [Validators.required] }),
  });

  protected readonly submitted = signal(false);

  private readonly formValid = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(() => this.form.valid)
    ),
    { initialValue: this.form.valid }
  );

  protected readonly disableSubmit = computed(() => this.auth.loading() || !this.formValid());

  private readonly _autoRedirect = computed(() => {
    if (this.auth.isAuthenticated()) this.router.navigateByUrl('/home');
    return null;
  });

  private syncAutofillOnce(): void {
    const u = (document.getElementById('username') as HTMLInputElement | null)?.value?.trim();
    const p = (document.getElementById('password') as HTMLInputElement | null)?.value?.trim();
    const patch: Partial<{ username: string; password: string }> = {};
    if (u && !this.form.controls.username.value) patch.username = u;
    if (p && !this.form.controls.password.value) patch.password = p;
    if (Object.keys(patch).length) this.form.patchValue(patch, { emitEvent: true });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.syncAutofillOnce());
    setTimeout(() => this.syncAutofillOnce(), 300);
    setTimeout(() => this.syncAutofillOnce(), 1200);
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    const ok = await this.auth.login(this.form.getRawValue());
    if (ok) this.router.navigateByUrl('/home');
  }
}
