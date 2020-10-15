import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbButtonModule, NbDialogModule, NbCheckboxModule, NbAccordionModule, NbToastrModule } from '@nebular/theme';
import { DialogNamePromptComponent } from './components/dialog-name-prompt/dialog-name-prompt.component';
import { SelectedOrdersService } from './components/selected-orders/selected-orders.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { ModalModule, AccordionModule, AccordionConfig } from 'ngx-bootstrap';
import { MainPipe } from './main-pipe.module';
import { SpecificOrderComponent } from './components/specific-order/specific-order.component';
import { OrdersService } from '../pages/orders/orders.service';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { IgxDatePickerModule, IgxInputGroupModule, IgxIconModule, IgxButtonModule, IgxPrefixModule, IgxTimePickerModule } from 'igniteui-angular';
import { CardComponent } from './components/card/card.component';
import { CustomRendererComponent } from './components/custom-renderer/custom-renderer.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DatatableComponent } from './components/datatable/datatable.component';
import { ColumnComponent } from './components/datatable/column/column.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { RichTextViewComponent } from './components/rich-text-view/rich-text-view.component';
import { CalendarEventComponent } from './components/calendar-event/calendar-event.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SelectedDisplay } from './components/dropdown/selected-display.pipe';
import { TaskService } from '../pages/task/task.service';
import { FilterByPipe } from './components/dropdown/filterBy.pipe';

@NgModule({
  imports: [
    RouterModule,
    NbCardModule,
    NbIconModule,
    CommonModule,
    MainPipe,
    FormsModule,
    ModalModule.forRoot(),
    Ng2SmartTableModule,
    AngularEditorModule,
    IgxInputGroupModule,
    IgxDatePickerModule,
    IgxIconModule,
    IgxButtonModule,
    IgxPrefixModule,
    ReactiveFormsModule,
    NbCheckboxModule,
    NgbModule,
    AccordionModule,
    NbButtonModule,
    NbAccordionModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    ModalModule.forRoot(),
    // TimepickerModule.forRoot(),
    IgxTimePickerModule,
    IgxDatePickerModule,
    SelectDropDownModule,
  ],
  declarations: [DialogNamePromptComponent, DialogComponent, SpecificOrderComponent, CardComponent, CustomRendererComponent,
    DatatableComponent, ColumnComponent, DateRangePickerComponent, RichTextViewComponent, CalendarEventComponent,
    DropdownComponent, SelectedDisplay, FilterByPipe],
  exports: [CommonModule, FormsModule, DialogNamePromptComponent, DialogComponent, SpecificOrderComponent, CardComponent,
    AngularEditorModule, DatatableComponent, ColumnComponent, DateRangePickerComponent, CalendarEventComponent,
    DropdownComponent, SelectedDisplay, FilterByPipe],
  entryComponents: [DialogNamePromptComponent, CustomRendererComponent, RichTextViewComponent],

  providers: [SelectedOrdersService, OrdersService, TaskService, TitleCasePipe, AccordionConfig],
})

export class SharedModule { }
