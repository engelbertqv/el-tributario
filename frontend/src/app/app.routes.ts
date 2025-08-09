import { Routes } from '@angular/router';
import { authGuard } from '@core/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('@pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'home',  canActivate: [authGuard], loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'logout', loadComponent: () => import('@pages/logout/logout.component').then(m => m.LogoutComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
