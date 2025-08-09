import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../app/core/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <h2>Bienvenido</h2>
      <p>Estás autenticado en modo demo.</p>
      <button (click)="logout()">Cerrar sesión</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly auth = inject(AuthService);
  logout(): void { this.auth.logout(); location.assign('/login'); }
}
