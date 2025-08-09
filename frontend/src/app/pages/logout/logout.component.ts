import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';

@Component({ selector: 'app-logout', template: '' })
export class LogoutComponent {
  private readonly auth = inject<AuthService>(AuthService);
  private readonly router = inject(Router);
  constructor() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
