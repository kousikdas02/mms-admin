import { Injectable, inject } from '@angular/core';
import { AES, enc } from 'crypto-ts';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private remembar = {
    KEY: 'project_auth02',
    PASSWORD: '!##0895*()?:}95047834&&tesdsfdsfsdf@EWdsd'
  };

  private TEMP = {
    KEY: 'project_auth',
    PASSWORD: '90590348534YYIU!@00asfdadsf@£sxfcdf'
  };
  private USER = {
    KEY: 'project_auth0',
    PASSWORD: '!##0895*()?:}95047834&&tes12323?ADSLklo'
  };

  private cookie = inject(CookieService);





  // DECRYPT THE COOKIES DATA BEFORE SAVE
  private encription(data: any, secret: string) {
    return AES.encrypt(JSON.stringify(data), secret);
  }

  // DECRYPT THE COOKIES DATA
  private decription(data: any, secret: string) {
    const bytes = AES.decrypt(data.toString(), secret);
    return JSON.parse(bytes.toString(enc.Utf8));
  }

  //  SAVE USER COOKIES DATA OR LOGIN THE USER
  async setUser(data: any) {
    return this.cookie.set(this.USER.KEY, this.encription(data, this.USER.PASSWORD).toString(), 7, '/', '', false, 'Strict');
  }

  // GET SAVED USER COOKIES DATA
  getUser() {
    const DATA = this.cookie.get(this.USER.KEY) !== null ? this.cookie.get(this.USER.KEY) : undefined;
    if (DATA) return this.decription(DATA, this.USER.PASSWORD)
    return false
  }

  // CLEAR USER COOKIES DATA OR LOGOUT THE USER
  clearUser() {
    this.cookie.delete(this.USER.KEY, '/');
    this.cookie.delete(this.USER.KEY, '/user');
    this.cookie.delete(this.USER.KEY, '/user/*');
  }

  getDataField(type: string): string | boolean {
    if (this.getUser() !== undefined && this.getUser()[type] !== undefined) return (this.getUser()[type]);
    return false
  }


  isAuthenticate(): boolean {
    return this.getDataField('token') ? true : false;
  }

}
