import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import { NbCardModule } from '@nebular/theme';
import { MainPipe } from '../../shared/main-pipe.module';
import { ThemeModule } from '../../@theme/theme.module';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    DocumentsRoutingModule,
    MainPipe,
  ],
})
export class DocumentsModule { }
