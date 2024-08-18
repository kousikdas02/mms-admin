import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@services'
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export default class BookingsComponent {
  bookingList:any[] = [];

  constructor(private _apiService:ApiService){
    this.getBookingList();
  }
  getBookingList() {
    this._apiService.get('booking').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          console.log(resp)
          this.bookingList = resp.data;
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