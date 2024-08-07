// angular import
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, EventService } from '@services'

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(private _storage: StorageService,
    private _event: EventService,
    private _router: Router
  ) { }
  logout() {
    this._router.navigateByUrl('auth/signin')
    this._storage.clearUser();
    this._event.user.set(null);
    this._event.isLoggedIn.set(false);
  }
}
