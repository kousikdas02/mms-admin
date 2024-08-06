import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService, StorageService } from '@services';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-model',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule,MatIcon],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.scss'
})
export class AddModelComponent {
  modelForm: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _event: EventService,
    private _storage: StorageService) {
    this.formInit();
  }
  private formInit(): void {
    this.modelForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
    });
  }



  createManufacturer(): void {
    console.log(this.modelForm)
    if (this.modelForm.invalid) {
      this.modelForm.markAllAsTouched();
      return;
    }

    this._apiService.postMultiDataWithToken('manufacturer', this.modelForm.value).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created manufacturer.', 'success');
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

  back(){
    this._router.navigate(['models'])
  }
}

