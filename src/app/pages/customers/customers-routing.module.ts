import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customers.component';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { CustomerDetailPageComponent } from './customer-detail/customer-detail-page.component';

const routes: Routes = [{
  path: '',
  component: CustomersComponent,
  children: [
    {
      path: 'customers-page',
      component: CustomersPageComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {
}
 