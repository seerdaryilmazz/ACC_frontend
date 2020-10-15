import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { TranslateService } from '../shared/translate/translate.service';
import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu;

  constructor( private translateService: TranslateService ) { }
  ngOnInit() {
    this.translateService.languageObservable.subscribe(event => this.translateMenuItems());
    this.translateMenuItems();
  }

  translateMenuItems() {
    this.menu = JSON.parse(JSON.stringify(MENU_ITEMS));
    this.menu.forEach(item => this.translateMenuItem(item));
  }

  translateMenuItem(menuItem: NbMenuItem) {
    if (menuItem.children != null) {
      menuItem.children.forEach(item => this.translateMenuItem(item));
    }
    menuItem.title = this.translateService.instant(menuItem.title);
    return menuItem;
  }
}
