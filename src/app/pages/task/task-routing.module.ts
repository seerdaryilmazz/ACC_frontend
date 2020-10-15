import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent } from './task.component';
import { TaskPageComponent } from './task-page/task-page.component';
import { DelayedOrdersComponent } from './delayed-orders/delayed-orders.component';
import { ProblemComponent } from './problem/problem.component';
import { ExpensiveComponent } from './expensive/expensive.component';
import { NewLocationComponent } from './new-location/new-location.component';
import { PrelostComponent } from './prelost/prelost.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { TodoTaskDetailComponent } from './todo-tasks/todo-task-detail/todo-task-detail.component';

const routes: Routes = [{
  path: '',
  component: TaskComponent,
  children: [
    {
      path: 'task-page',
      component: TaskPageComponent,
    },
    {
      path: 'delayed-orders',
      component: DelayedOrdersComponent,
    },
    {
      path: 'problem',
      component: ProblemComponent,
    },
    {
      path: 'expensive',
      component: ExpensiveComponent,
    },
    {
      path: 'new-location',
      component: NewLocationComponent,
    },
    {
      path: 'prelost',
      component: PrelostComponent,
    },
    {
      path: 'complaints',
      component: ComplaintsComponent,
    },
    {
      path: 'todo/:number',
      component: TodoTaskDetailComponent,
    },
    {
      path: 'todos',
      component: TodoTasksComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {
}
 