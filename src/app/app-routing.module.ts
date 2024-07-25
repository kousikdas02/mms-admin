import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./modules/auth/authentication.module').then((m) => m.AuthenticationModule)
      },
      {
        path: '',
        redirectTo: 'auth/signin',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [      
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/dashboard/dashboard.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/user/user.component')
      },
      {
        path: 'bookings',
        loadComponent: () => import('./modules/admin/bookings/bookings.component')
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/admin/settings/settings.component')
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
