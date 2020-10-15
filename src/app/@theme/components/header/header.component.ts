import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { TranslateService } from '../../../shared/translate/translate.service';
import { environment } from '../../../../environments/environment';
import { CommunicationService } from '../../../services/communication.service';
import { UtilsService } from '../../../services/utils.service';
import { UserService } from '../../../_services';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  notifications = [];
  handleNotifications;
  unreadNotificationsCount;
  userName: any = "";
  pictureUrl = "";

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  languageList = [
    {
      display: 'TR',
      value: 'tr-TR'
    },
    {
      display: 'EN',
      value: 'en-EN'
    }];
  selectedLanguage;

  firstTime = false;

  changeLanguage(event) {
    localStorage.setItem('lang', this.selectedLanguage);
    this.translateService.use(event);
    //location.reload();
  }
  userMenu = [
    { title: this.translateService.instant('UPDATE_APP') },
    { title: this.translateService.instant('LOG_OUT'), url: '/auth/logout' }
  ];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userData: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private nbservice: NbAuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private communicationService: CommunicationService,
    private utilsService: UtilsService) {
    menuService.onItemClick().subscribe((result) => {
      if (result.item.title == this.translateService.instant('UPDATE_APP')) {
        localStorage.removeItem('UserInfo');
        localStorage.removeItem('selectedUserInfo');
        this.router.navigate(['pages/dashboard']);
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('selectedUserInfo')) {
      var selectedUserInfo = this.utilsService.getUserInfoFromLocalStorage();
      this.userName = selectedUserInfo.DisplayName;
      this.pictureUrl = environment.staticPath + selectedUserInfo.Username + '.jpeg';
    }
    this.communicationService.changeForHeader.subscribe(userObject => {
      var selectedUserInfo = this.utilsService.getUserInfoFromLocalStorage();
      this.userName = selectedUserInfo.DisplayName;
      this.pictureUrl = environment.staticPath + selectedUserInfo.Username + '.jpeg';
    });
    this.currentTheme = this.themeService.currentTheme;
    var currentLanguage = localStorage.getItem('lang');
    if (currentLanguage != null && currentLanguage != undefined) {
      var index = this.languageList.findIndex(lang => lang.value == currentLanguage);
      this.selectedLanguage = this.languageList[index].value;
    }
    else {
      this.selectedLanguage = 'tr-TR'
    }
    this.userData.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    const { lg } = this.breakpointService.getBreakpointsMap();

    this.menuService.onItemSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: { tag: string, item: any }) => {
        if ((document.documentElement.clientWidth < lg) && this.firstTime && document.getElementsByClassName('menu-sidebar fixed left expanded').length > 0) {
          this.toggleSidebar();
        }
        this.firstTime = true;
      });
    // dashboard içinde kullanıcı değişiminde tetiklenir.
    this.userService.notificationsObservable.subscribe(() => {
      this.getNotifications();
    });
    this.getNotifications();
    this.handleNotifications = setInterval(() => this.getNotifications(false), 60000);
  }

  public getNotifications(toggleSpinner = true) {
    this.userService.getNotifications(toggleSpinner).subscribe((r: any) => {
      this.notifications = r;
      this.notifications = this.notifications.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
      this.unreadNotificationsCount = this.notifications.filter(nots => nots.Read === false).length;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.handleNotifications);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  notificationClick(item) {
    this.userService.readNotifications(item._id['$oid']).subscribe(r => {
      this.userService.reloadNotifications();
      if (item.Url) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([item.Url]));
      }
    });
  }

  navigateNotifications() {
    this.router.navigate(['pages/miscellaneous/notifications']);
  }
}
