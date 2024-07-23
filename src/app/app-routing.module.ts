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
      // {
      //   path: 'tables',
      //   loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      // },
      // {
      //   path: 'apexchart',
      //   loadComponent: () => import('./demo/chart/apex-chart/apex-chart.component')
      // },
      // {
      //   path: 'sample-page',
      //   loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
