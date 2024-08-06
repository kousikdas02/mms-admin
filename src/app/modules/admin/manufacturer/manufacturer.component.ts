import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '@services'

@Component({
  selector: 'app-manufacturer',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss'
})
export class ManufacturerComponent {
  manufacturerList: any[] = [];
  constructor(private _router: Router,
    private _apiService: ApiService,
  ) {
    this.getManufacturerList();
  }
  getManufacturerList() {
    this._apiService.get('manufacturer').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.manufacturerList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
  changeStatus(currentStatus: string, manufacturerId: string) {
    const alertText = currentStatus == 'active' ? "Confirm to make this manufacturer inactive. Users will not be able to select inactive manufacturers"
      :
      "Confirm to make this manufacturer active. Users be able to select active manufacturers";
    console.log(currentStatus, alertText)
    this._apiService.alertConfirmation(alertText, 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        const body = {
          status: currentStatus == 'active' ? 'inactive' : 'active'
        }
        this._apiService.put(`manufacturer/${manufacturerId}`, body).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Successfully changed manufacturer status.', 'success');
              this.getManufacturerList();
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
  addManufacturer() {
    this._router.navigate(['manufacturers', 'add'])
  }
  editManufacturer(manufacturerId: string) {
    this._router.navigate(['manufacturers', manufacturerId])
  }
  deleteManufacturer(manufacturerId: string){
    this._apiService.alertConfirmation('Do you want to delete this manufacturer?', 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        this._apiService.delete(`manufacturer/${manufacturerId}`).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Manufacturer deleted successfully','success');
              this.getManufacturerList();
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

