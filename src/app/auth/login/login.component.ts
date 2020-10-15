import {Component, OnInit} from '@angular/core';
import {NbLoginComponent, NbAuthResult} from '@nebular/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent implements OnInit {

  ngOnInit(): void {
   /*  this.service.isAuthenticated().subscribe(result => {
      if (result) {
        this.router.navigate(['pages/dashboard']);
      }
    }); */
    localStorage.setItem('lang','tr-TR');
  }
  onSigninWithGoogle() {
    // TODO: Read from config either api or env
    window.location.href = environment.apiUrl+`auth/google_signin`;
  }
  login(): void {
    this.router.navigate(['pages/dashboard']);
  }


}
