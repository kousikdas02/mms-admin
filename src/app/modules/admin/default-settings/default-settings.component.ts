import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-default-settings',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf, NgxMatTimepickerModule],
  templateUrl: './default-settings.component.html',
  styleUrl: './default-settings.component.scss'
})
export class DefaultSettingsComponent {
  configForm: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
    this.getConfig();
  }
  private formInit(): void {
    this.configForm = this._formBuilder.group({
      minimumBookingPrice: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
    });
    this.configForm.get('endTime').disable();
  }

  isEndTimeEarlier(start: string, end: string) {
    const format = 'HH:mm';
    const startMoment = moment(start, format);
    const endMoment = moment(end, format);

    return endMoment.isBefore(startMoment);
  };
  startTimeChange(event: any) {
    this.configForm.get('endTime').enable();
    this.configForm.patchValue({
      endTime: ''
    })
  }
  endTimeChange(event: any) {
    // this.configForm.get('endTime').enable();
    console.log(event)
    if (this.isEndTimeEarlier(this.configForm.value.startTime, event)) {
      this._apiService.alert("End Time can't be before Start Time","warning")
      setTimeout(()=>{
        this.configForm.patchValue({
          endTime: ''
        });
      },100)
    }
  }

  getConfig(): void {
    this._apiService.get('config').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          console.log(resp)
          if (resp.data) {
            this.configForm.get('endTime').enable();
            this.configForm.patchValue({ ...resp.data })
          }
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    });
  }

  updateConfig(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    this._apiService.post('config', this.configForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully update the configurations.', 'success');
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    });
  }
}
