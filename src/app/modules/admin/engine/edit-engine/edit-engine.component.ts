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
  selector: 'app-edit-engine',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './edit-engine.component.html',
  styleUrl: './edit-engine.component.scss'
})
export class EditEngineComponent {
  engineForm: FormGroup = new FormGroup({});
  modelList: any[] = [];
  engineDetails: any;

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.formInit();
    this.getModelList().then(() => {
      this.getEngineDetails(this._route.snapshot.paramMap.get('engineId'));
    })
  }
  private formInit(): void {
    this.engineForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
    });
  }
  getEngineDetails(engineId: string) {
    this._apiService.get(`engine/${engineId}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.engineDetails = resp.data;
          this.engineForm.patchValue({
            name: resp.data.name,
            model: resp.data.model._id
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

  getModelList() {
    return new Promise<void>((resolve, reject) => {
      this._apiService.get('model').subscribe({
        next: (resp: any) => {
          if (resp.status === 200) {
            this.modelList = resp.data;
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


  editEngine(): void {
    console.log(this.engineForm)
    if (this.engineForm.invalid) {
      this.engineForm.markAllAsTouched();
      return;
    }

    this._apiService.put(`engine/${this.engineDetails._id}`, this.engineForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully edited engine.', 'success');
          this.engineForm.reset();
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
    this._router.navigate(['engines'])
  }
}



