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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-manufacturer',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './add-manufacturer.component.html',
  styleUrl: './add-manufacturer.component.scss'
})
export class AddManufacturerComponent {
  manufacturerForm: FormGroup = new FormGroup({});

  uploadedFiles: File[] = [];
  previewUploadedFiles: string[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router,
    private _event: EventService,
    private _storage: StorageService) {
    this.formInit();
  }
  private formInit(): void {
    this.manufacturerForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required]),
    });
  }



  createManufacturer(): void {
    console.log(this.manufacturerForm)
    if (this.manufacturerForm.invalid) {
      this.manufacturerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('name', this.manufacturerForm.value.name);
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      formData.append(`images[${i}]`, this.uploadedFiles[i]);
    }
    this._apiService.postMultiDataWithToken('manufacturer', formData).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created manufacturer.', 'success');
          this.manufacturerForm.reset();
          this.previewUploadedFiles = [];
          this.uploadedFiles = [];
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
      this.manufacturerForm.patchValue({
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
    this._router.navigate(['manufacturers'])
  }
}

