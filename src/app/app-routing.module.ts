import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { authGuard,authDeGuard } from '@authGuard';

const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    canActivate: [authDeGuard],
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
    canActivate: [authGuard],
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
      {
        path: 'services',
        loadComponent: () => import('./modules/admin/services/services.component')
      },
      {
        path: 'services/add',
        loadComponent: () => import('./modules/admin/services/add-service/add-service.component').then((m) => m.AddServiceComponent)
      },
      {
        path: 'services/:serviceId',
        loadComponent: () => import('./modules/admin/services/edit-service/edit-service.component').then((m) => m.EditServiceComponent)
      },
      {
        path: 'manufacturers',
        loadComponent: () => import('./modules/admin/manufacturer/manufacturer.component').then((m)=>m.ManufacturerComponent)
      },
      {
        path: 'manufacturers/add',
        loadComponent: () => import('./modules/admin/manufacturer/add-manufacturer/add-manufacturer.component').then((m) => m.AddManufacturerComponent)
      },
      {
        path: 'manufacturers/:manufacturerId',
        loadComponent: () => import('./modules/admin/manufacturer/edit-manufacturer/edit-manufacturer.component').then((m) => m.EditManufacturerComponent)
      },
      {
        path: 'models',
        loadComponent: () => import('./modules/admin/model/model.component').then((m)=>m.ModelComponent)
      },
      {
        path: 'models/add',
        loadComponent: () => import('./modules/admin/model/add-model/add-model.component').then((m) => m.AddModelComponent)
      },
      {
        path: 'models/:modelId',
        loadComponent: () => import('./modules/admin/model/edit-model/edit-model.component').then((m) => m.EditModelComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
