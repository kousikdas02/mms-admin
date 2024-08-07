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

@Component({
  selector: 'app-add-model',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.scss'
})
export class AddModelComponent {
  modelForm: FormGroup = new FormGroup({});
  manufacturerList: any[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
    this.getManufacturerList();
  }
  private formInit(): void {
    this.modelForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
    });
  }

  getManufacturerList() {
    this._apiService.get('manufacturer').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.manufacturerList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }


  createModel(): void {
    console.log(this.modelForm)
    if (this.modelForm.invalid) {
      this.modelForm.markAllAsTouched();
      return;
    }

    this._apiService.post('model', this.modelForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created model.', 'success');
          this.modelForm.reset();
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    });
  }

  back() {
    this._router.navigate(['models'])
  }
}

