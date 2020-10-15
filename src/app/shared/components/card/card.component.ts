import { Component, OnInit, Input } from '@angular/core';

const gradiants = {
  'navigation-2-outline': 'icon-bg-2',
  'checkmark-square-outline': 'icon-bg-4',
  'people-outline': 'icon-bg-1',
  'calendar-outline': 'icon-bg-3',
};

@Component({
  selector: 'ngx-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('title') title: string;
  @Input('path') path: string;
  @Input('icon') icon: string;
  @Input('amount') amount: number;
  @Input('iconClass') iconClass: string;
  @Input ('homePage') homePage: boolean;
  iconWidth;
  textWidth;

  constructor() { }

  ngOnInit() {
    if (this.homePage && this.homePage === true) {
      this.iconWidth = 'col-md-4 col-4';
      this.textWidth = 'col-md-8 col-8 main-text';
    } else {
      this.iconWidth = 'col-md-3 col-4';
      this.textWidth = 'col-md-9 col-8 main-text';
    }

  }
}
