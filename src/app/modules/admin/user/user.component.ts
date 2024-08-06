import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ApiService } from '@services'
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule,MatMenuModule, MatIconModule, MatButtonModule,DatePipe],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent {
  userList: any[] = [];
  constructor(private _apiService: ApiService,
  ) {
    this.getUserList();
  }
  getUserList() {
    this._apiService.get('user').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.userList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
}
