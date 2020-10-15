/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { CommunicationService } from './services/communication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet> 	<ngx-spinner [fullScreen]="true" type="ball-clip-rotate-multiple" size="medium"> 	<p class="loading">Yükleniyor...</p> 	</ngx-spinner>' ,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,
    private swUpdate: SwUpdate,
    private spinner: NgxSpinnerService,
    private communicationService:CommunicationService) {
  }

  showSpinner() {
    this.spinner.show(undefined, { fullScreen: true });
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

          if(confirm("Uygulamanın yeni bir sürümü mevcut. Yeni versiyonu yüklemek ister misiniz?")) {

              window.location.reload();
          }
      });
  }   
    this.analytics.trackPageViews();
    this.communicationService.change.subscribe(isOpen => {
      if(isOpen){
        this.spinner.show();
      }
      else {
        this.spinner.hide();
      }
    });  }
}
