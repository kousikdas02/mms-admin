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
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-slot-management',
  standalone: true,
  imports: [SharedModule, MatCardModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatInputModule, MatIcon, NgIf, NgxMatTimepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './slot-management.component.html',
  styleUrl: './slot-management.component.scss'
})
export class SlotManagementComponent {
  selectedDate: Date | null = null;
  slotForm: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
  }
  private formInit(): void {
    this.slotForm = this._formBuilder.group({
      _id: new FormControl(''),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      noSlot: new FormControl(false, [Validators.required]),
    });
    this.slotForm.get('endTime').disable();
  }
  isEndTimeEarlier(start: string, end: string) {
    const format = 'HH:mm';
    const startMoment = moment(start, format);
    const endMoment = moment(end, format);

    return endMoment.isBefore(startMoment);
  };
  startTimeChange(event: any) {
    this.slotForm.get('endTime').enable();
    this.slotForm.patchValue({
      endTime: ''
    })
  }
  endTimeChange(event: any) {
    // this.configForm.get('endTime').enable();
    console.log(event)
    if (this.isEndTimeEarlier(this.slotForm.value.startTime, event)) {
      this._apiService.alert("End Time can't be before Start Time", "warning")
      setTimeout(() => {
        this.slotForm.patchValue({
          endTime: ''
        });
      }, 100)
    }
  }

  getSlots(event: any) {
    const date = moment(event);
    const formattedDate = date.format('DD/MM/YYYY');
    this._apiService.get(`slot?date=${formattedDate}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          if (resp.data) {
            this.slotForm.get('endTime').enable();
            this.slotForm.patchValue({ ...resp.data });
          }
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: () => {
        this._apiService.alert("Please try again later.", "error");
      }
    })
  }
  saveSlots() {
    if (this.slotForm.value._id) {
      this.updateSlot();
    } else {
      this.addSlot();
    }
  }

  setAsUnavailable() {
    const date = moment(this.selectedDate);
    const formattedDate = date.format('DD/MM/YYYY');
    const payload = {
      date: formattedDate,
      startTime: '',
      endTime: '',
      noSlot: true
    }
    this._apiService.post("slot", payload).subscribe({
      next: (resp: any) => {
        if (resp.status == 200) {
          this._apiService.alert("Successfully added slot.", "success");
          this.getSlots(this.selectedDate);
        } else {
          this._apiService.alert("Please try again later.", "error");
        }
      },
      error: () => {
        this._apiService.alert("Please try again later.", "error");
      }
    })
  }
  removeSlot() {
    this._apiService.delete(`slot/${this.slotForm.value._id}`,).subscribe({
      next: (resp: any) => {
        if (resp.status == 200) {
          this._apiService.alert("Successfully removed slot.", "success");
          this.getSlots(this.selectedDate);
        } else {
          this._apiService.alert("Please try again later.", "error");
        }
      },
      error: () => {
        this._apiService.alert("Please try again later.", "error");
      }
    })
  }
  addSlot() {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      this._apiService.alert("Please enter start & end time", "warning");
      return;
    }
    const date = moment(this.selectedDate);
    const formattedDate = date.format('DD/MM/YYYY');
    const payload = {
      date: formattedDate,
      startTime: this.slotForm.value.startTime,
      endTime: this.slotForm.value.endTime,
      noSlot: false
    }
    this._apiService.post("slot", payload).subscribe({
      next: (resp: any) => {
        if (resp.status == 200) {
          this._apiService.alert("Successfully added slot.", "success");
          this.getSlots(this.selectedDate);
        } else {
          this._apiService.alert("Please try again later.", "error");
        }
      },
      error: () => {
        this._apiService.alert("Please try again later.", "error");
      }
    })
  }

  updateSlot() {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      this._apiService.alert("Please enter start & end time", "warning");
      return;
    }
    const payload = {
      startTime: this.slotForm.value.startTime,
      endTime: this.slotForm.value.endTime
    }
    this._apiService.put(`slot/${this.slotForm.value._id}`, payload).subscribe({
      next: (resp: any) => {
        if (resp.status == 200) {
          this._apiService.alert("Successfully added slot.", "success");
          this.getSlots(this.selectedDate);
        } else {
          this._apiService.alert("Please try again later.", "error");
        }
      },
      error: () => {
        this._apiService.alert("Please try again later.", "error");
      }
    })
  }
}
