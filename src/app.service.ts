import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AppService {


    constructor() {
    }

    private showSubject = new Subject();
    private hideSubject = new Subject();
    private errorSubject = new Subject();
    private backSubject = new Subject();

    private successSubject = new Subject();

    show(): void {
        this.showSubject.next('show');
    }

    hide(): void {
        this.hideSubject.next('hide');
    }

    error(error): void {
        this.errorSubject.next(error);
    }

    goBack(): void {
        this.backSubject.next(true);
    }

    onSuccess(): Observable<any> {
        return this.successSubject.asObservable();
    }

    onError(): Observable<any> {
        return this.errorSubject.asObservable();
    }

    onShow(): Observable<any> {
        return this.showSubject.asObservable();
    }

    onHide(): Observable<any> {
        return this.hideSubject.asObservable();
    }

    onBackClicked(): Observable<any> {
        return this.backSubject.asObservable();
    }

}
