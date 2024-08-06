import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '@services'

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export default class ServicesComponent {
  serviceList: any[] = [];
  constructor(private _router: Router,
    private _apiService: ApiService,
  ) {
    this.getServiceList();
  }
  getServiceList() {
    this._apiService.get('service').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.serviceList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
  changeStatus(currentStatus: string, serviceId: string) {
    const alertText = currentStatus == 'active' ? "Confirm to make this service inactive. Users will not be able to book inactive services"
      :
      "Confirm to make this service active. Users be able to book active services";
    console.log(currentStatus, alertText)
    this._apiService.alertConfirmation(alertText, 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        const body = {
          status: currentStatus == 'active' ? 'inactive' : 'active'
        }
        this._apiService.put(`service/${serviceId}`, body).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Successfully changed service status.', 'success');
              this.getServiceList();
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
  addService() {
    this._router.navigate(['services', 'add'])
  }
  editService(serviceId: string) {
    this._router.navigate(['services', serviceId])
  }
  deleteService(serviceId: string){
    this._apiService.alertConfirmation('Do you want to delete this service?', 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        this._apiService.delete(`service/${serviceId}`).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Service deleted successfully','success');
              this.getServiceList();
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
}
