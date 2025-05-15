import {inject, NgModule} from '@angular/core';
import {CanActivateFn, PreloadAllModules, Router, RouterModule, Routes} from '@angular/router';
import {AuthService} from "./services/auth/auth.service";
import {AuthGuard} from "./shared/guards/auth.guard";

const authGuardFunc: CanActivateFn = (activeRoute, activeRouter) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isAuthenticated) {
    router.navigate(['auth']);
  }
  return true;
}


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.module').then(m => m.TicketsModule),
    canActivate: [AuthGuard],  // TODO попробоавть изменить на canLoad
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
