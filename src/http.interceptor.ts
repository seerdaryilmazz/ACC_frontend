import {Injectable} from '@angular/core';
import {ConnectionBackend, Headers, Http, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
//import {environment} from '../../environments/environment';
import {AppService} from './app.service';
import {ServiceLocator} from './locator.service';

@Injectable()
export class InterceptedHttp extends Http {
    private appService: AppService;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
        this.appService = ServiceLocator.injector.get(AppService);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options));
    }

    private updateUrl(req: string) {
        return 'http://appdev:81/api/request' + req;
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }

        if (options.headers == null) {
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
        }

        if (localStorage.getItem('currentUser') !== null) {
            const token = JSON.parse(localStorage.getItem('currentUser'));
            options.headers.append('Authorization', 'bearer ' + token.token);

        } else {
            //options.headers.append('Authorization', 'bearer ' + environment.genericToken);
        }
        options.headers.append('Accept-Language', localStorage.getItem('lang'));


        return options;
    }
}
