import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Ng2SmartTableModule } from 'ng2-smart-table';

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

} from '@nebular/theme';

import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { RouterModule } from '@angular/router';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { OrdersService } from './orders.service';
import { MainPipe } from '../../shared/main-pipe.module';
import { SharedModule } from '../../shared/shared.module';
import { OrderComponent } from './order/order.component';
import { ArchivedComponent } from './archived/archived.component';
import {NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


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
    OrdersRoutingModule,
    NbActionsModule,
    NbIconModule,
    NbSelectModule,
    MainPipe,
    Ng2SmartTableModule,
    Ng2SearchPipeModule ,
    SharedModule,
    NgbPaginationModule],
  
  declarations: [
    OrdersComponent,
    OrdersPageComponent,
    OrderComponent,
    ArchivedComponent  ],
  providers:[OrdersService]
})



export class OrdersModule { }
