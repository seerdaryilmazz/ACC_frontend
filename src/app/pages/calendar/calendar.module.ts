import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxTimePickerModule, IgxDatePickerModule } from 'igniteui-angular/';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbTabsetModule,
  NbUserModule,
  NbActionsModule,
  NbIconModule,
  NbSelectModule,
  NbDialogModule,


} from '@nebular/theme';

// import * as modules from '@nebular/theme';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarService } from './calendar.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MainPipe } from '../../shared/main-pipe.module';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { TaskService } from '../task/task.service';


@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NgbModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    CalendarRoutingModule,
    NbActionsModule,
    NbIconModule,
    NbSelectModule,
    FullCalendarModule,
    NbDialogModule.forRoot(),
    ModalModule.forRoot(),
    // TimepickerModule.forRoot(),
    IgxTimePickerModule,
    IgxDatePickerModule,
    SelectDropDownModule,
    MainPipe,
    SharedModule  ],

  declarations: [
    CalendarComponent,
  ],

  providers: [CalendarService, TaskService],
})



export class CalendarModule { }
