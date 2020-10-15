import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {NgxAuthRoutingModule} from './auth-routing.module';
import {NbAuthModule} from '@nebular/auth';
import {NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbCardModule} from '@nebular/theme';
import { GoogleResultComponent } from './google-result/google-result.component';

import {LoginComponent} from './login/login.component'; // <---
import { LogoutComponent } from './logout/logout.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    NbCardModule
  ],
  declarations: [
    LoginComponent,
    GoogleResultComponent,
    LogoutComponent
  ],
})
export class NgxAuthModule {
}
