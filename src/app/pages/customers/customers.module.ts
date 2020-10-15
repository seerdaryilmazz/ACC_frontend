import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, EmailValidator } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown'

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
  NbSpinnerModule,
  NbRadioModule,
  NbCheckboxModule,
  NbAlertModule,


} from '@nebular/theme';

// import * as modules from '@nebular/theme';

import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomerService } from './customer.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomerDetailPageComponent } from './customer-detail/customer-detail-page.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SelectedOrdersComponent } from '../../shared/components/selected-orders/selected-orders.component';
import { MainPipe } from '../../shared/main-pipe.module';
import { OnlyNumber } from '../../shared/directives/only-number.directive';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ModalModule, AccordionModule, AccordionConfig } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IgxDatePickerModule, IgxTimePickerModule } from 'igniteui-angular';
import { CalendarService } from '../calendar/calendar.service';
// import { OpportunityComponent } from './opportunity/opportunity.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PwGraphComponent } from './customer-detail/pw-graph/pw-graph.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    CustomersRoutingModule,
    NbActionsModule,
    NbIconModule,
    NbSelectModule,
    SharedModule,
    CommonModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    MainPipe,
    NbCardModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NbRadioModule,
    NbCheckboxModule,
    SelectDropDownModule,
    NbAlertModule,
    ModalModule.forRoot(),
    NgbModule,
    IgxDatePickerModule,
    IgxTimePickerModule,
    AccordionModule,
    NbAccordionModule,
    NgSelectModule,
    NgxChartsModule,
  ],

  declarations: [
    CustomersComponent,
    CustomersPageComponent,
    CustomerDetailPageComponent,
    SelectedOrdersComponent,
    OnlyNumber,
    PwGraphComponent],
  providers: [CustomerService, EmailValidator, CalendarService, AccordionConfig, CurrencyPipe],
})



export class CustomersModule { }
