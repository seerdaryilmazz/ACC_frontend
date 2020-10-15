import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpErrorResponse, HttpResponse,
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {NbAuthService} from '@nebular/auth';
import {Router} from '@angular/router';
// import {HttpConfigInterceptor} from './app-http-interceptor';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  request: any;
  constructor(private authService: NbAuthService, private router: Router) {
    // this.authService.onAuthenticationChange().subscribe(result => {
    //   if (!result) {
    //     this.my_token = '';
    //   }
    // });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.getToken().subscribe(result => {
      const token = result.getValue();
      if (!!token) {
        request = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)});
      }
    });

    if (!request.headers.has('Content-Type')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    this.request = request;

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              if(event.body.result_code === 401){
                this.router.navigate['/auth/login'];
              }
          }
          return event;
      }));
  }
}

