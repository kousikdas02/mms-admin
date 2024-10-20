import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services'
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [NgbDropdownModule, SharedModule, ReactiveFormsModule, RouterLink, FormsModule, MatSlideToggleModule, MatInputModule, MatIcon, NgIf],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {
  serviceForm: FormGroup = new FormGroup({});

  uploadedFiles: File[] = [];
  previewUploadedFiles: string[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _router: Router) {
    this.formInit();
  }
  private formInit(): void {
    this.serviceForm = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      specialConsideration: new FormArray([this.specialConsiderationDetails()]),
    });
  }
  specialConsiderationDetails(): FormGroup {
    return this._formBuilder.group({
      year: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      engine: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    });
  }
  get specialConsiderationList() {
    return (this.serviceForm.get('specialConsideration') as FormArray)?.controls;
  }
  AddSpecialConsiderationItem(): void {
    const SpecialConsiderationList = this.serviceForm.get('specialConsideration') as FormArray;
    if (SpecialConsiderationList.valid) {
      SpecialConsiderationList.push(this.specialConsiderationDetails());
    } else {
      SpecialConsiderationList.markAllAsTouched();
    }
  }
  RemoveSpecialConsiderationItem(index: number): void {
    const SpecialConsiderationList = this.serviceForm.get('specialConsideration') as FormArray;
    SpecialConsiderationList.removeAt(index);
  }


  yearChange(event: any, index: number) {
    if ((this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value.length >= 4) {
      (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
        manufacturer: '',
        model: '',
        engine: '',
      });
      this.getManufacturerList(index);
    }
  }
  getManufacturerList(index: number) {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    this._apiService.get(`manufacturer?year=${year}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          const selectElement = document.getElementById(`manufacturer${index}`) as HTMLSelectElement;
          // Remove all existing options
          while (selectElement.options.length > 0) {
            selectElement.remove(0);
          }
          const option = document.createElement('option');
          option.value = '';
          option.text = 'Select a manufacturer';
          selectElement.appendChild(option);
          // Add new options
          resp.data.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.name;
            option.text = optionData.name;
            selectElement.appendChild(option);
          });
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
  manufacturerChange(event: any, index: number) {
    (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
      model: '',
      engine: '',
    });
    this.getModelList(index);
  }
  getModelList(index: number) {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    const manufacturer = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('manufacturer').value;
    this._apiService.get(`model?year=${year}&manufacturer=${manufacturer}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          const selectElement = document.getElementById(`model${index}`) as HTMLSelectElement;
          // Remove all existing options
          while (selectElement.options.length > 0) {
            selectElement.remove(0);
          }
          const option = document.createElement('option');
          option.value = '';
          option.text = 'Select a model';
          selectElement.appendChild(option);
          // Add new options
          resp.data.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.name;
            option.text = optionData.name;
            selectElement.appendChild(option);
          });
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error');
      }
    })
  }
  modelChange(event: any, index: number) {
    (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
      engine: '',
    });
    this.getEngineList(index);
  }
  getEngineList(index: number) {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    const manufacturer = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('manufacturer').value;
    const model = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('model').value;
    this._apiService.get(`engine?year=${year}&model=${model}&manufacturer=${manufacturer}`).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          const selectElement = document.getElementById(`engine${index}`) as HTMLSelectElement;
          // Remove all existing options
          while (selectElement.options.length > 0) {
            selectElement.remove(0);
          }
          const option = document.createElement('option');
          option.value = '';
          option.text = 'Select a engine';
          selectElement.appendChild(option);
          // Add new options
          resp.data.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.cylinders + '-' + optionData.engine_type;
            option.text = optionData.cylinders + '-' + optionData.engine_type;
            selectElement.appendChild(option);
          });
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error');
      }
    })
  }
  createService(): void {
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
    (this.serviceForm.get('specialConsideration') as FormArray).value.forEach((element: any, index: number) => {
      formData.append(`specialConsideration[${index}]`, JSON.stringify({...element}));
    });
    this._apiService.postMultiDataWithToken('service', formData).subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this._apiService.alert('Successfully created service.', 'success');
          this.serviceForm.reset();
          this.previewUploadedFiles = [];
          this.uploadedFiles = [];
          this._router.navigate(['services']);
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
