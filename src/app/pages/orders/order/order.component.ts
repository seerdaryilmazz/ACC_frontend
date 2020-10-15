import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { OrdersService } from '../orders.service';
import { TranslateService } from '../../../shared/translate/translate.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { CustomRendererComponent } from '../../../shared/components/custom-renderer/custom-renderer.component';

@Component({
  selector: 'ngx-active-orders',
  styleUrls: ['./order.component.scss'],
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit, OnDestroy {

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  activeOrdersSubsc: Subscription;
  activeOrderSettings;
  activeOrders: any;
  selectedOrder;
  showDetail = false;
  customRendererComponent = CustomRendererComponent;
  searchQuery:string ='';
  useremail;
  dialogRef: any;
  type = "";
  dateRangeValue = 30;
  dateRangeList = [];
  @ViewChild('problemModal', { static: false }) problemModal: TemplateRef<any>;
  @ViewChild('expenseModal', { static: false }) expenseModal: TemplateRef<any>;
  @ViewChild('delayModal', { static: false }) delayModal: TemplateRef<any>;

  constructor(private dialogService: NbDialogService,
    private ordersService: OrdersService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private router: Router,
    private utilsService:UtilsService) {
  }

  ngOnInit() {
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList = this.utilsService.getDateRangeList();
    this.type = (this.router.url.split('/')[3]).split('-')[0];
    this.getOrders(this.dateRangeValue);
  }

  getOrders(dateRangeValue) {
    this.dateRangeValue = dateRangeValue;
    this.activeOrdersSubsc = this.ordersService.getOrders(this.useremail, this.type, this.dateRangeValue).subscribe(result => {
      this.activeOrders = result;
    });
  }

  ngOnDestroy(): void {
    //this.activeOrdersSubsc.unsubscribe();
  }

  onSearch(query=''){
    this.searchQuery = query
  }

  userRowSelect(event) {
    if (event) {
      this.selectedOrder = event.data;
      this.showDetail = true;
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




