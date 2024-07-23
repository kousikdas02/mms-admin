import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export default class BookingsComponent {

}