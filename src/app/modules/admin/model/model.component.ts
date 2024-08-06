import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '@services'

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss'
})
export class ModelComponent {
  modelList: any[] = [];
  constructor(private _router: Router,
    private _apiService: ApiService,
  ) {
    this.getModelList();
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
  changeStatus(currentStatus: string, modelId: string) {
    const alertText = currentStatus == 'active' ? "Confirm to make this model inactive. Users will not be able to select inactive models"
      :
      "Confirm to make this model active. Users be able to select active models";
    this._apiService.alertConfirmation(alertText, 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        const body = {
          status: currentStatus == 'active' ? 'inactive' : 'active'
        }
        this._apiService.put(`model/${modelId}`, body).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Successfully changed model status.', 'success');
              this.getModelList();
            } else {
              this._apiService.alert(resp.message, 'warning');
            }
          },
          error: (err: any) => {
            this._apiService.alert(err.message, 'error')
          }
        })
      }
    })
  }
  addModel() {
    this._router.navigate(['models', 'add'])
  }
  editModel(manufacturerId: string) {
    this._router.navigate(['models', manufacturerId])
  }
  deleteModel(modelId: string) {
    this._apiService.alertConfirmation('Do you want to delete this model?', 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        this._apiService.delete(`model/${modelId}`).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Model deleted successfully', 'success');
              this.getModelList();
            } else {
              this._apiService.alert(resp.message, 'warning');
            }
          },
          error: (err: any) => {
            this._apiService.alert(err.message, 'error')
          }
        })
      }
    });

  }
}


