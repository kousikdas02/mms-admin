import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule,MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent {}
