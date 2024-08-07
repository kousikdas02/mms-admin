import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-model',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './edit-model.component.html',
  styleUrl: './edit-model.component.scss'
})
export class EditModelComponent {
  modelForm: FormGroup = new FormGroup({});
  manufacturerList: any[] = [];
  modelDetails: any;

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.formInit();
    this.getManufacturerList().then(() => {
      this.getModelDetails(this._route.snapshot.paramMap.get('modelId'));
    })
  }
  private formInit(): void {
    this.modelForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
    });
  }
  getModelDetails(modelId: string) {
    this._apiService.get(`model/${modelId}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.modelDetails = resp.data;
          this.modelForm.patchValue({
            name: resp.data.name,
            manufacturer: resp.data.manufacturer._id
          })
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }

  getManufacturerList() {
    return new Promise<void>((resolve, reject) => {
      this._apiService.get('manufacturer').subscribe({
        next: (resp: any) => {
          if (resp.status === 200) {
            this.manufacturerList = resp.data;
            resolve()
          } else {
            // this._apiService.alert(resp.message, 'warning');
            resolve()
          }
        },
        error: (err: any) => {
          // this._apiService.alert(err.message, 'error')
          resolve()
        }
      })
    });
  }


  editModel(): void {
    console.log(this.modelForm)
    if (this.modelForm.invalid) {
      this.modelForm.markAllAsTouched();
      return;
    }

    this._apiService.put(`model/${this.modelDetails._id}`, this.modelForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully edited model.', 'success');
          this.modelForm.reset();
          this.back();
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


