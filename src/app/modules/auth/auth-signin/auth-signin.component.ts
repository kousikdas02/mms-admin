import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService, StorageService } from '@services';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {

  loginForm: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _event: EventService,
    private _storage: StorageService) {
    this.formInit();
  }
  private formInit(): void {
    this.loginForm = this._formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }



  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return
    }
    this._apiService.post('auth/signin', this.loginForm.value).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if(resp.data.role != 'admin'){
          this._apiService.alert('Only Admins are allowed', 'warning');
          return;
        }
        const userObj = {
          _id: resp.data._id,
          firstName: resp.data.firstName,
          lastName: resp.data.lastName,
          email: resp.data.email,
          phone: resp.data.phone,
          gender: resp.data.gender,
          createdAt: resp.data.createdAt,
          updatedAt: resp.data.updatedAt,
          token: resp.data.accessToken
        }
        this._storage.setUser({
          ...userObj,
        });
        this._storage.setUser(userObj).then(() => {
          this._apiService.alert('Successfully logged in.', 'success');
          this._event.user.set(userObj);
          this._event.isLoggedIn.set(true);
          this._router.navigate(['/dashboard'])
        })

      },
      error: (err: any) => {
        console.log(err)
        this._apiService.alert(err.error.message, 'error')
      }
    })
  }


  TypeIndicators: any = {
    password: true,
    confirmPassword: true
  }
  changePasswordType(field: string) {
    this.TypeIndicators[field] = !this.TypeIndicators[field]
  }
}
