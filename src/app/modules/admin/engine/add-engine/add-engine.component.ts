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
  selector: 'app-add-engine',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule,MatIcon, NgIf],
  templateUrl: './add-engine.component.html',
  styleUrl: './add-engine.component.scss'
})
export class AddEngineComponent {
  engineForm: FormGroup = new FormGroup({});
  modelList: any[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
    this.getModelList();
  }
  private formInit(): void {
    this.engineForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
    });
  }

  getModelList() {
    this._apiService.get('model').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.modelList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }


  createEngine(): void {
    console.log(this.engineForm)
    if (this.engineForm.invalid) {
      this.engineForm.markAllAsTouched();
      return;
    }

    this._apiService.post('engine', this.engineForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created engine.', 'success');
          this.engineForm.reset();
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    });
  }

  back(){
    this._router.navigate(['engines'])
  }
}


