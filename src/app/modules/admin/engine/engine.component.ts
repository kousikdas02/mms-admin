import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '@services'

@Component({
  selector: 'app-engine',
  standalone: true,
  imports: [SharedModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './engine.component.html',
  styleUrl: './engine.component.scss'
})
export class EngineComponent {
  engineList: any[] = [];
  constructor(private _router: Router,
    private _apiService: ApiService,
  ) {
    this.getEngineList();
  }
  getEngineList() {
    this._apiService.get('engine').subscribe({
      next: (resp: any) => {
        if (resp.status === 200) {
          this.engineList = resp.data;
        } else {
          this._apiService.alert(resp.message, 'warning');
        }
      },
      error: (err: any) => {
        this._apiService.alert(err.message, 'error')
      }
    })
  }
  changeStatus(currentStatus: string, engineId: string) {
    const alertText = currentStatus == 'active' ? "Confirm to make this engine inactive. Users will not be able to select inactive engines"
      :
      "Confirm to make this engine active. Users be able to select active engines";
    this._apiService.alertConfirmation(alertText, 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        const body = {
          status: currentStatus == 'active' ? 'inactive' : 'active'
        }
        this._apiService.put(`engine/${engineId}`, body).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Successfully changed engine status.', 'success');
              this.getEngineList();
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
  addEngine() {
    this._router.navigate(['engines', 'add'])
  }
  editEngine(engineId: string) {
    this._router.navigate(['engines', engineId])
  }
  deleteEngine(engineId: string) {
    this._apiService.alertConfirmation('Do you want to delete this engine?', 'Confirm').then((confirmation: boolean) => {
      if (confirmation) {
        this._apiService.delete(`engine/${engineId}`).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this._apiService.alert('Engine deleted successfully', 'success');
              this.getEngineList();
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
