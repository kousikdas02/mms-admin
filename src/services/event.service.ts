import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private storage = inject(StorageService);

  isLoggedIn: WritableSignal<boolean> = signal<boolean>(this.storage.isAuthenticate());
  user: WritableSignal<any> = signal<any>(this.storage.getUser())

}
