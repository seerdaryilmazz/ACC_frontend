import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainPipe } from '../../shared/main-pipe.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from '../../shared/shared.module';
import { IgxIconModule } from 'igniteui-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    MiscellaneousRoutingModule,
    NgbPaginationModule,
    SharedModule,
    NbIconModule,
    IgxIconModule,
    MainPipe,
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
    NotificationsComponent,
  ],
})
export class MiscellaneousModule { }
