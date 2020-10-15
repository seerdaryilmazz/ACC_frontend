import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../_services';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications = [];
  page = 1;
  pageSize = 10;

  constructor(private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.getNotifications();
    this.userService.reloadNotifications();
  }

  getNotifications() {
    this.userService.getNotifications().subscribe((r: any) => {
      this.notifications = r;
      this.notifications = this.notifications.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
    });
  }

  markAllRead() {
    this.notifications.forEach(not => {
      not.Read = true;
    });
    this.userService.readNotifications().subscribe(() => {
      this.userService.reloadNotifications();
    });
  }

  notificationClick(item) {
    item.Read = true;
    this.userService.readNotifications(item._id['$oid']).subscribe(() => {
      this.userService.reloadNotifications();
      if (item.Url) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([item.Url]));
      }
    });
  }

  readNotification(item) {
    item.Read = true;
    this.userService.readNotifications(item._id['$oid']).subscribe(() => {
      this.userService.reloadNotifications();
    });
  }

}
