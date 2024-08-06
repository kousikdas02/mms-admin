import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApiService } from '@services'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgbDropdownModule,SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export default class SettingsComponent  {
  userDetails: any[] = [];
  userForm: FormGroup = new FormGroup({});
  constructor(private _apiService: ApiService,
    private _formBuilder: FormBuilder
  ) {
    this.formInit();
    this.getProfile();
  }
  private formInit(): void {
    this.userForm = this._formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
    });
  }
  getProfile() {
    this._apiService.get('user/profile').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.userDetails = resp.data;
          this.userForm.patchValue({...this.userDetails})
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }

  updateProfile(){
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }
    this._apiService.put('user/profile',this.userForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Profile updated successfully', 'success');
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