import {NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbLogoutComponent} from '@nebular/auth';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-register',
  templateUrl: './logout.component.html',
})
export class LogoutComponent extends NbLogoutComponent implements OnInit {

  ngOnInit(): void {
    this.logout('email');
  }

  logout(strategy: string): void {
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {
      localStorage.clear();
      setTimeout(() => {
        return this.router.navigate(['auth/login']);
      }, 100);
    });
  }



}
