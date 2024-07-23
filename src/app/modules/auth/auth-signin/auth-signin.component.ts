import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {

  constructor(private _router:Router){

  }

  login(){
    this._router.navigate(['dashboard'])
  }
}
