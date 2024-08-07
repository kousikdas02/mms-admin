import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService, StorageService } from '@services';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'
import { MatIcon } from '@angular/material/icon';
import { environment } from '@env'
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {
  readonly fileUrl: string = environment.BASE_FILE_PATH + 'services/';
  serviceForm: FormGroup = new FormGroup({});

  uploadedFiles: File[] = [];
  previewUploadedFiles: string[] = [];
  serviceDetails: any;

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.formInit();
    this.getServiceDetails(this._route.snapshot.paramMap.get('serviceId'))

  }
  private formInit(): void {
    this.serviceForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      images: new FormControl('', []),
      price: new FormControl('', [Validators.required]),
    });
  }
  getServiceDetails(serviceId: string) {
    this._apiService.get(`service/${serviceId}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.serviceDetails = resp.data;
          this.serviceForm.patchValue({
            name: resp.data.name,
            description: resp.data.description,
            price: resp.data.price
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



  editService(): void {
    console.log(this.serviceForm)
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('name', this.serviceForm.value.name);
    formData.append('description', this.serviceForm.value.description);
    formData.append('price', this.serviceForm.value.price);
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      formData.append(`images[${i}]`, this.uploadedFiles[i]);
    }
    this._apiService.putMultiDataWithToken(`service/${this.serviceDetails._id}`, formData).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created service.', 'success');
          this.serviceForm.reset();
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

  // when files are selected, save them in array uploadedFiles
  fileAdded(event: Event) {
    const inputValue = event.target as HTMLInputElement;
    if (inputValue.files && inputValue.files.length > 0) {
      const files: File[] = [];
      for (let i = 0; i < inputValue.files.length; i++) {
        this.uploadedFiles.push(<File>inputValue.files[i]);
        files.push(<File>inputValue.files[i]);
        if (
          inputValue.files[i].type === 'image/jpeg' ||
          inputValue.files[i].type === 'image/png' ||
          inputValue.files[i].type === 'image/jpg'
        ) {
          const reader = new FileReader();
          reader.readAsDataURL(inputValue.files[i]);
          reader.onload = () => {
            this.previewUploadedFiles.push(reader.result as string);
          };
        }
      }
      this.serviceForm.patchValue({
        images: files
      })
    }
  }
  // To delete selected files
  deleteFiles(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.previewUploadedFiles.splice(index, 1);
    (document.getElementById('image') as HTMLInputElement).value = null;
  }

  back() {
    this._router.navigate(['services'])
  }
}

