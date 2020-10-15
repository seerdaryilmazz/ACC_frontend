import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { TranslateService } from '../../../shared/translate/translate.service';
import { UtilsService } from '../../../services/utils.service';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-orders-page',
  styleUrls: ['./orders-page.component.scss'],
  templateUrl: './orders-page.component.html',
})
export class OrdersPageComponent implements OnInit {

  showDetail = false;
  useremail;
  selectedOrder;
  orderCode = '';
  dialogRef: any;
  dateRangeValue = 30;
  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;
  @ViewChild('problemModal', { static: false }) problemModal: TemplateRef<any>;
  @ViewChild('expenseModal', { static: false }) expenseModal: TemplateRef<any>;
  @ViewChild('delayModal', { static: false }) delayModal: TemplateRef<any>;
  dateRangeList = [];
  constructor(private service: OrdersService,
    private dialogService: NbDialogService,
    private translateService: TranslateService,
    private utilsService: UtilsService) {
  }
  ordersTypeCount = { ActiveOrderCount: 0, ArchivedOrderCount: 0, FinalizedOrderCount: 0,
    OnTheRoadOrderCount: 0, OnTheTerminalOrderCount: 0, ToTheRoadOrderCount: 0, OnTheTerminalLeavingCount: 0 };

  ngOnInit() {
    const userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList = this.utilsService.getDateRangeList();

   this.getAllOrdersTypeCount(this.dateRangeValue);
  }

  getAllOrdersTypeCount(dateRangeValue) {
    this.dateRangeValue = dateRangeValue;
    this.service.getAllOrdersTypeCount(this.useremail, this.dateRangeValue).subscribe(result => {
      this.ordersTypeCount.ActiveOrderCount = result['ActiveOrderCount'];
      this.ordersTypeCount.ArchivedOrderCount = result['ArchivedOrderCount'];
      this.ordersTypeCount.FinalizedOrderCount = result['FinalizedOrderCount'];
      this.ordersTypeCount.OnTheRoadOrderCount = result['OnTheRoadOrderCount'];
      this.ordersTypeCount.OnTheTerminalOrderCount = result['OnTheTerminalOrderCount'];
      this.ordersTypeCount.ToTheRoadOrderCount = result['ToTheRoadOrderCount'];
      this.ordersTypeCount.OnTheTerminalLeavingCount = result['OnTheTerminalLeavingCount'];
    });
  }

  getSpecificOrder() {
    if (this.orderCode.length > 0) {
      this.service.getSpecificOrder(this.orderCode, this.useremail).subscribe(result => {
        if (result['CompanyId']) {
           this.selectedOrder = result;
        } else {
          this.informationModal.dialogModalMessage = this.translateService.instant('ORDER_NOT_FOUND');
          this.informationModal.openModal();
        }
      });
    } else {
      this.informationModal.dialogModalMessage = this.translateService.instant('ORDER_CODE_REQUIRED');
      this.informationModal.openModal();
    }
  }

  showProblemModal() {
    this.dialogRef = this.dialogService.open(this.problemModal, { context: '' });
  }
  showExpenseModal() {
    this.dialogRef = this.dialogService.open(this.expenseModal, { context: '' });
  }
  showDelayModel() {
    this.dialogRef = this.dialogService.open(this.delayModal, { context: '' });
  }
}





