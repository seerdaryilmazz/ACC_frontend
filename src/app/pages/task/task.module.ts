import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule, IgxInputGroupModule, IgxSuffixModule, IgxIconModule } from 'igniteui-angular/';

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
  NbWindowModule,
  NbDialogModule,
  NbTooltipModule,
} from '@nebular/theme';

// import * as modules from '@nebular/theme';

import { TaskComponent } from './task.component';
import { TaskRoutingModule } from './task-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { RouterModule } from '@angular/router';
import { TaskPageComponent } from './task-page/task-page.component';
import { DelayedOrdersComponent } from './delayed-orders/delayed-orders.component';
import { ProblemComponent } from './problem/problem.component';
import { ExpensiveComponent } from './expensive/expensive.component';
import { NewLocationComponent } from './new-location/new-location.component';
import { PrelostComponent } from './prelost/prelost.component';
import { SharedModule } from '../../shared/shared.module';
import { TaskService } from './task.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommunicationComponent } from '../../shared/components/communication/communication.component';
import { MainPipe } from '../../shared/main-pipe.module';
import { ComplaintsComponent } from './complaints/complaints.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from '../calendar/calendar.service';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { TreeviewModule } from 'ngx-treeview';
import { CustomDropdowntreeDirective } from '../../shared/directives/custom-dropdowntree.directive';
import { TodoTaskDetailComponent } from './todo-tasks/todo-task-detail/todo-task-detail.component';
import { DashboardService } from '../dashboard/dashboard.service';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbCardModule,
    NgbModule,
    SelectDropDownModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    TaskRoutingModule,
    NbActionsModule,
    NbIconModule,
    NbSelectModule,
    SharedModule,
    IgxInputGroupModule,
    IgxSuffixModule,
    IgxIconModule,
    NbWindowModule,
    NbTooltipModule,
    MainPipe,
    NgSelectModule,
    NbDialogModule.forRoot(),
    Ng2SmartTableModule,
    TreeviewModule.forRoot(),
    IgxDatePickerModule,
  ],
  declarations: [
    TaskComponent,
    TaskPageComponent,
    DelayedOrdersComponent,
    ProblemComponent,
    ExpensiveComponent,
    NewLocationComponent,
    PrelostComponent,
    CommunicationComponent,
    ComplaintsComponent,
    TodoTasksComponent,
    CustomDropdowntreeDirective,
    TodoTaskDetailComponent,
  ],
  providers: [TaskService, CalendarService, DashboardService],
})



export class TaskModule { }
