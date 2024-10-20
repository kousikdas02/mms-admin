import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
      images: new FormControl(''),
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

  getServiceDetails(serviceId: string) {
    this._apiService.get(`service/${serviceId}`).subscribe({
      next: async (resp: any) => {
        if (resp.status === 200) {
          this.serviceDetails = resp.data;
          this.serviceForm.patchValue({
            name: resp.data.name,
            description: resp.data.description,
            price: resp.data.price,
            images:resp.data.images
          });
          for (let i = 0; i < this.serviceDetails.specialConsideration.length; i++) {
            let element = this.serviceDetails.specialConsideration[i];
            let index = i;
            if (index > 0) {
              this.AddSpecialConsiderationItem();
            }

            (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
              year: element.year,
              price: element.price
            });

            await this.getManufacturerList(index);
            (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
              manufacturer: element.manufacturer
            });

            await this.getModelList(index);
            (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
              model: element.model
            });

            await this.getEngineList(index);
            (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
              engine: element.engine
            });
          }
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
  yearChange(event: any, index: number) {
    if ((this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value.length >= 4) {
      (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
        manufacturer: '',
        model: '',
        engine: '',
      });
      this.getManufacturerList(index).then();
    }
  }
  getManufacturerList(index: number): Promise<void> {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    return new Promise((resolve, rejct) => {
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
            resolve();
          } else {
            this._apiService.alert(resp.message, 'warning');
            resolve();
          }
        },
        error: (err: any) => {
          this._apiService.alert(err.message, 'error');
          resolve();
        }
      })
    })

  }
  manufacturerChange(event: any, index: number) {
    (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
      model: '',
      engine: '',
    });
    this.getModelList(index).then();;
  }
  getModelList(index: number): Promise<void> {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    const manufacturer = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('manufacturer').value;
    return new Promise((resolve, rejct) => {
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
            resolve()
          } else {
            this._apiService.alert(resp.message, 'warning');
            resolve()
          }
        },
        error: (err: any) => {
          this._apiService.alert(err.message, 'error');
          resolve()
        }
      })
    })
  }
  modelChange(event: any, index: number) {
    (this.serviceForm.get('specialConsideration') as FormArray).at(index).patchValue({
      engine: '',
    });
    this.getEngineList(index).then();;
  }
  getEngineList(index: number): Promise<void> {
    const year = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('year').value;
    const manufacturer = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('manufacturer').value;
    const model = (this.serviceForm.get('specialConsideration') as FormArray).at(index).get('model').value;
    return new Promise((resolve, rejct) => {
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
            resolve()

          } else {
            this._apiService.alert(resp.message, 'warning');
            resolve()
          }
        },
        error: (err: any) => {
          this._apiService.alert(err.message, 'error');
          resolve()
        }
      })
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

