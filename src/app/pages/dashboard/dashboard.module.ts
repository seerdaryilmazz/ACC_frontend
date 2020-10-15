import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { MainPipe } from '../../shared/main-pipe.module';
import { PriorTasksService } from '../../shared/components/prior_tasks/prior-tasks.service';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { PriorTasksComponent } from '../../shared/components/prior_tasks/prior-tasks.component';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../_services/user.service';


@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    MainPipe,
    SelectDropDownModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    PriorTasksComponent
  ],
 
  providers: [DashboardService, PriorTasksService, UserService,
    //TranslateService, 
    //TRANSLATION_PROVIDERS
  ]
})
export class DashboardModule { }
