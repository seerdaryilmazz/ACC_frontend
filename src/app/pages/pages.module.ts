import { NgModule } from '@angular/core';
import { NbMenuModule, NbSelectModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { RouterModule } from '@angular/router';
import { MainPipe } from '../shared/main-pipe.module';
import { OnlyNumber } from '../shared/directives/only-number.directive';


@NgModule({
  imports: [
    RouterModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,
    NbSelectModule ,
    NbCardModule,
    MainPipe
    ],
    declarations: [
    PagesComponent ],
})
export class PagesModule {
}
