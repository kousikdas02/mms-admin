import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { EventService } from '@services';

export const authGuard: CanActivateFn = (route, state) => {
  const event = inject(EventService);
  const router = inject(Router);
  if (event.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth/signin']);
    return false;
  }
};


export const authDeGuard: CanActivateFn = (route, state) => {
  const event = inject(EventService);
  const router = inject(Router);
  if (!event.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};

// export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate) => {
//   return component.canDeactivate ? component.canDeactivate() : true;
// };

