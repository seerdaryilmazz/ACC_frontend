import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    // {
    //   path: 'iot-dashboard',
    //   component: ECommerceComponent,
    // },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'customers',
      loadChildren: () => import('./customers/customers.module')
        .then(m => m.CustomersModule),
    },
    {
      path: 'orders',
      loadChildren: () => import('./orders/orders.module')
        .then(m => m.OrdersModule),
    },
    {
      path: 'task',
      loadChildren: () => import('./task/task.module')
        .then(m => m.TaskModule),
    },
    {
      path: 'calendar',
      loadChildren: () => import('./calendar/calendar.module')
        .then(m => m.CalendarModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'documents',
      loadChildren: () => import('./documents/documents.module')
      .then(m => m.DocumentsModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
