import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { OrderComponent } from './order/order.component';
import { ArchivedComponent } from './archived/archived.component';

const routes: Routes = [{
  path: '',
  component: OrdersComponent,
  children: [
    {
      path: 'orders-page',
      component: OrdersPageComponent,
    },
    {
      path: 'active-orders',
      component: OrderComponent,
    },
    {
      path: 'pending-orders',
      component: OrderComponent,
    },
    {
      path: 'ontheroad-orders',
      component: OrderComponent,
    },
    {
      path: 'ontheroadleaving-orders',
      component: OrderComponent,
    },
    {
      path: 'finalized-orders',
      component: OrderComponent,
    },
    {
      path: 'terminal-orders',
      component: OrderComponent,
    },
    {
      path: 'archieved-orders',
      component: ArchivedComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {
}
 