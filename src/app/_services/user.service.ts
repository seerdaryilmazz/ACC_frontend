import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
  private notificationsSubject = new Subject<any>();
  notificationsObservable = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient,
    private apiService: ApiService) {
  }

  reloadNotifications() {
    this.notificationsSubject.next();
  }

  getMe() {
    return this.http.get(`${environment.apiUrl}/user/me`);
  }

  getNotifications(toggleSpinner?) {
    return this.apiService.get('notifications', 'user', '', '', toggleSpinner);
  }

  readNotifications(id?) {
    let url = 'read_notifications';
    if (id) {
      url += '?notificationId=' + id;
    }
    return this.apiService.get(url, 'user');
  }

  validateGoogleResult(token) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }),
    };
    return this.http.post(environment.apiUrl+`auth/refresh`, {}, httpOptions);
  }

}
