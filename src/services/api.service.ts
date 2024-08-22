import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Signal, effect, inject, signal } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@env';
import { StorageService } from './storage.service';
import { EventService } from './event.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private event = inject(EventService);
  private API_URL: string = environment.BASE_API_PATH;
  httpOptions = signal({
    headers: new HttpHeaders({
      Accept: 'multipart/form-data',
      "Cache-Control": "max-age=84600, public"
    })
  });

  private isLoggedIn: Signal<boolean> = signal((typeof this.storage.getDataField('token') === 'string'));

  constructor() {
    effect(() => {
      this.isLoggedIn = signal((typeof this.storage.getDataField('token') === 'string'));
    }, { allowSignalWrites: true });

    this.isLoggedIn() && this.httpOptions.set({
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        'x-access-token': this.storage.getDataField('token') + '',
        "Cache-Control": "max-age=84600, public"
      })
    })
  }

  get(path: string, params: object = {}): any {
    this.httpOptions.set({
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        'x-access-token': this.storage.getDataField('token') + '',
        "Cache-Control": "max-age=84600, public"
      })
    })
    return this.http.get(`${this.API_URL}${path}`, { headers: this.httpOptions().headers, params: { ...params } }).pipe(catchError(this.formatErrors));
  }

  post(path: any, body: object = {}) {
    return this.http.post(`${this.API_URL}${path}`, body, { headers: this.httpOptions().headers }).pipe(catchError(this.formatErrors));
  }

  patch(path: any, body: object = {}) {
    return this.http.patch(`${this.API_URL}${path}`, body, { headers: this.httpOptions().headers }).pipe(catchError(this.formatErrors));
  }

  put(path: any, body: object = {}) {
    return this.http.put(`${this.API_URL}${path}`, body, { headers: this.httpOptions().headers }).pipe(catchError(this.formatErrors));
  }

  delete(path: string, params: HttpParams = new HttpParams()) {
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.httpOptions().headers, params }).pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(() => error);
  }


  // SHOW ALERT AS A TOSATER WHEN REQUIRED
  alert(message: string, type: any, duraion?: number) {
    return Swal.fire({
      title: message,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duraion ? duraion : 2000,
      timerProgressBar: true,
      customClass: {
        title: 'alert-toast-title',
      }
    });
  }
  // SHOW ALERT AS A POPUP WHEN REQUIRED
  alertModal(msg: string, message: string, type: any, CancelButton = false, isIcon?: boolean, btn?: string) {
    if (btn) {
      return Swal.fire({
        title: msg,
        text: message,
        icon: isIcon ? type : null,
        showConfirmButton: true,
        showCancelButton: CancelButton,
        confirmButtonText: btn,
        customClass: {
          title: 'alert-title',
        },
      });

    } else {
      return Swal.fire({
        title: msg,
        text: message,
        icon: isIcon ? type : null,
        showConfirmButton: true,
        showCancelButton: CancelButton,
        confirmButtonText: 'Delete',
        customClass: {
          title: 'alert-title',
        },
      });
    }
  }
  // alert modal
  async alertConfirmation(title?: any, confirmButtonText?: any): Promise<boolean> {
    let flag = false;
    await Swal.fire({
      title: title ? title : 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EB4846',
      // cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText ? confirmButtonText : 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'alert-confirm-button',
        title: 'alert-title',
        icon: 'alert-icon'
      },
    }).then((result: any) => {
      if (result && result.value) {
        flag = true;
      } else {
        flag = false;
      }
    });
    return new Promise((resolve, reject) => {
      resolve(flag);
    });
  }


  // POST HTTP REQUEST WITH FILE UPLOAD
  postMultiDataWithToken(
    path: string,
    body: FormData,
    params: object = {},
    reportProgress = false
  ): Observable<any> {
    console.log(this.httpOptions)
    return this.http
      .post(`${this.API_URL}${path}`, body, { headers: this.httpOptions().headers, params: { ...params } })
      .pipe(catchError(this.formatErrors));
  }
  postMultiData(path: string, file: FormData): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        "Cache-Control": "max-age=84600, public"
      }),
    };
    return this.http
      .post(`${this.API_URL}${path}`, file, httpOptionsimg)
      .pipe(catchError(this.formatErrors));
  }

  putMultiData(path: string, file: FormData): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        "Cache-Control": "max-age=84600, public"
      }),
    };
    return this.http
      .put(`${this.API_URL}${path}`, file, httpOptionsimg)
      .pipe(catchError(this.formatErrors));
  }
  putMultiDataWithToken(
    path: string,
    body: FormData,
    params: object = {},
    reportProgress = false
  ): Observable<any> {
    return this.http
      .put(`${this.API_URL}${path}`, body, { headers: this.httpOptions().headers, params: { ...params } })
      .pipe(catchError(this.formatErrors));
  }
}
