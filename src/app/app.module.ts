/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NbChatModule, NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbToastrModule, NbWindowModule, } from '@nebular/theme';
import { ApiService } from './services/api.service';
import { ParameterService } from './services/parameter.service';

import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { CommunicationService } from './services/communication.service';
import { httpFactory } from '../http.factory';
import { ServiceLocator } from '../locator.service';
import { AppService } from '../app.service';
import { RouterModule } from '@angular/router';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import { UserService } from './_services';
import { AuthGuard } from './app-auth-guard.service';
import { TranslatePipe } from './shared/translate/translate.pipe';
import { TranslateService } from './shared/translate/translate.service';
import { TRANSLATION_PROVIDERS } from './shared/translate/translation';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UtilsService } from './services/utils.service';
import { CustomerService } from './pages/customers/customer.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    // NgbTimepickerModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    ModalModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
        }),
      ],
      forms: {
        login: {
          redirectDelay: 500,
          strategy: 'email',
          rememberMe: true,
          showMessages: {
            success: true,
            error: true,
          },
        },
        register: {
          redirectDelay: 500,
          strategy: 'email',
          showMessages: {
            success: true,
            error: true,
          },
          terms: true,
        },
        requestPassword: {
          redirectDelay: 500,
          strategy: 'email',
          showMessages: {
            success: true,
            error: true,
          },
        },
        resetPassword: {
          redirectDelay: 500,
          strategy: 'email',
          showMessages: {
            success: true,
            error: true,
          },
        },
        logout: {
          redirectDelay: 500,
          strategy: 'email',
        },
        validation: {
          password: {
            required: true,
            minLength: 4,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
    }),
    CoreModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AppService,ParameterService,ApiService,CommunicationService,  UtilsService,  UserService,AuthGuard, TranslateService, TRANSLATION_PROVIDERS,
    CustomerService,

    { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions] }],
  bootstrap: [AppComponent]
})

// HTTP Interceptor
//     {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},

export class AppModule {

  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
