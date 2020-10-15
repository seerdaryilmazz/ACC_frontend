import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NbAuthComponent} from '@nebular/auth';

import {LoginComponent} from './login/login.component'; // <---
import { GoogleResultComponent } from './google-result/google-result.component';
import { LogoutComponent } from './logout/logout.component';


export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent, // <---
      },
      {
        path: 'google_result',
        component: GoogleResultComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent, // <---
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
