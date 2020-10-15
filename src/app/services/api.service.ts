//import { TranslateService } from '../shared/pipe/translate';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
//import { AppSettings } from '../app.settings';
import { Router } from '@angular/router';
import { CommunicationService } from './communication.service';
import { BusinessError, AuthenticationError } from '../shared/dto/errors';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../app.service';
import { ServiceLocator } from '../../locator.service';
import { environment } from '../../environments/environment';
import { isBoolean } from 'util';
//import { AuthenticationService } from './authentication.service';

class ApiMessage {
    public Intent: string;
    public Payload: any;
    public JobId: string;
    public ResultCode: number;
    public ResultMessage: string;
}

@Injectable()
export class ApiService {

    public token: string;
    private headers: HttpHeaders;
    private options: any;
    private apiUrl: string = environment.apiUrl;
    getCounter = 0;
    postCounter = 0;
    private appService: AppService;
    userEmail;
    loggedUser;
    //private geocodingUrl: string = GEOCODING_SERVICE_URL;

    constructor(private http: HttpClient, private router: Router, private communicationService: CommunicationService) {
        this.appService = ServiceLocator.injector.get(AppService);
    }

    getUserMail() {
        const selectedUser = localStorage.getItem('selectedUserInfo');
        const loggedUser = localStorage.getItem('LoggedUserEmail');
        if (selectedUser) {
            this.userEmail = JSON.parse(selectedUser).email;
        } else {
            this.userEmail = loggedUser;
        }
        this.loggedUser = loggedUser;
    }

    get(serviceName:string, scopeName:string, body?: any,xOnBehalfOf?:any, toggleSpinner?: boolean){
        this.getUserMail();
        if(this.getCounter < 0) {
            this.getCounter = 0;
        }
        this.getCounter++;
        this.communicationService.toggle(isBoolean(toggleSpinner) ? toggleSpinner : true);
        let currentUser = JSON.parse(localStorage.getItem('auth_app_token'));
        this.token = currentUser.value
        body = body|| "";
        
        if(xOnBehalfOf)
            this.userEmail = xOnBehalfOf;

        return this.http.get(this.apiUrl + scopeName + "/" + serviceName + body,  {headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            'X-On-Behalf-Of': this.userEmail,
            'X-User': this.loggedUser,
          })}).map((response:Response)=>{
              this.getCounter--;
              if(this.getCounter == 0) {
                  this.communicationService.toggle(false);
              }
            if(response['result_code']==401){
                this.router.navigate(['auth/logout']);
            }
              return response;

          }).catch((error: any) => {
              this.getCounter = 0;
              if (this.getCounter == 0) {
                  this.communicationService.toggle(false);
              }
            return throwError( "Sunucuda hata oluştu")
        }
        );
    }

    getBlob(serviceName: string, scopeName: string, body?: any, xOnBehalfOf?: any, toggleSpinner?: boolean) {
        this.getUserMail();
        if (this.getCounter < 0) {
            this.getCounter = 0;
        }
        this.getCounter++;
        this.communicationService.toggle(false);
        const currentUser = JSON.parse(localStorage.getItem('auth_app_token'));
        this.token = currentUser.value;
        body = body || "";
        if (xOnBehalfOf)
            this.userEmail = xOnBehalfOf;

        return this.http.get(this.apiUrl + scopeName + '/' + serviceName + body, {
            responseType: 'blob' as 'json',
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.token,
                'X-On-Behalf-Of': this.userEmail,
                'X-User': this.loggedUser,
            }),
        }).map(response => {
            this.getCounter--;
            if (this.getCounter === 0) {
                this.communicationService.toggle(false);
            }
            if (response['result_code'] === 401) {
                this.router.navigate(['auth/logout']);
            }
            return response;

        }).catch((error: any) => {
            this.getCounter = 0;
            if (this.getCounter === 0) {
                this.communicationService.toggle(false);
            }
            return throwError('Sunucuda hata oluştu');
        });
    }

    post(serviceName: string, scopeName: string, body?: any, jsonObj?: any, toggleSpinner?: boolean) {
        this.getUserMail();
        if (this.getCounter < 0) {
            this.getCounter = 0;
        }
        this.postCounter++;
        this.communicationService.toggle(isBoolean(toggleSpinner) ? toggleSpinner : true);
        let currentUser = JSON.parse(localStorage.getItem('auth_app_token'));
        this.token = currentUser.value
        return this.http.post(this.apiUrl + scopeName + "/" + serviceName + body, JSON.stringify(jsonObj), {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json',
                'X-On-Behalf-Of': this.userEmail,
                'X-User': this.loggedUser,
            }),
        }).map((response: Response) => {
            this.postCounter--;
            if (this.postCounter == 0) {
                this.communicationService.toggle(false);
            }
            if(response['result_code']==401){
                this.router.navigate(['auth/logout']);
            }
              return response;
        }).catch((error: any) => {
            this.getCounter = 0;
            if (this.getCounter == 0) {
                this.communicationService.toggle(false);
            }
            return throwError( "Sunucuda hata oluştu")
        });
    }
    delete(serviceName: string, scopeName: string, body?: any) {
        this.getUserMail();
        if (this.getCounter < 0) {
            this.getCounter = 0;
        }
        this.postCounter++;
        this.communicationService.toggle(true);
        let currentUser = JSON.parse(localStorage.getItem('auth_app_token'));
        this.token = currentUser.value
        return this.http.delete(this.apiUrl + scopeName + "/" + serviceName + "/" + body,{
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.token,
                'X-On-Behalf-Of': this.userEmail,
                'X-User': this.loggedUser,
            })
        }).map((response: Response) => {
            this.postCounter--;
            if (this.postCounter == 0) {
                this.communicationService.toggle(false);
            }
            if(response['result_code']==401){
                this.router.navigate(['auth/logout']);
            }
            if (response['result_code'] == 500) {
              throw new BusinessError(response['result_code'], response['result_message']);
            }

              return response;
        }).catch((error: any) => {
            this.getCounter = 0;
            if (this.getCounter == 0) {
                this.communicationService.toggle(false);
            }
            return throwError(error)
        });
    }
}

