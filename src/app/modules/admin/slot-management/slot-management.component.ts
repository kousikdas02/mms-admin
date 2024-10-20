import { Component, model } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

import { ApiService } from '@services'
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-slot-management',
  standalone: true,
  imports: [SharedModule, MatCardModule, MatDatepickerModule,ReactiveFormsModule, FormsModule, MatInputModule, MatIcon, NgIf],
  providers: [provideNativeDateAdapter()],
  templateUrl: './slot-management.component.html',
  styleUrl: './slot-management.component.scss'
})
export class SlotManagementComponent {
  selected = model<Date | null>(null);
  slotForm: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
  }
  private formInit(): void {
    this.slotForm = this._formBuilder.group({
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
    });
  }

  getSlots(event:any){
    console.log(event)
  }
}
