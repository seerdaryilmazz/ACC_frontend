import { Component, Input, HostListener, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TaskService } from '../task.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../shared/translate/translate.service';
import { SpecificOrderComponent } from '../../../shared/components/specific-order/specific-order.component';
import { UtilsService } from '../../../services/utils.service';


@Component({
  selector: 'ngx-delayed-orders',
  styleUrls: ['./delayed-orders.component.scss'],
  templateUrl: './delayed-orders.component.html',
})
export class DelayedOrdersComponent {

  @ViewChild('dialog', {static: false}) dialog:TemplateRef<any>;
  @ViewChild('orderDetailModal', { static: false }) orderDetailModal: TemplateRef<any>;
  @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;

  showDetail=false;

  delayedOrders;
  selectedOrder;
  useremail;
  dateRangeValue = 30;
  searchQuery: string = '';
  dateRangeList=[];
  constructor(private dialogService: NbDialogService, 
    private service:TaskService,
    private datePipe: DatePipe,
    private translateService:TranslateService,
    private utilsService:UtilsService){
  }
  
  ngOnInit() {
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList = this.utilsService.getDateRangeList();
    this.getDelayedOrders(this.dateRangeValue)

  }
  
  getDelayedOrders(dateRangeValue){
    this.dateRangeValue = dateRangeValue;
    this.service.getDelayedOrders(this.useremail,this.dateRangeValue).subscribe(result => {
      this.delayedOrders = result;
      this.delayedOrders.forEach(delayedOrder => {
        delayedOrder.Service = delayedOrder.Service.replace('<br>','');
      });
    })
  }

  onSearch(query=''){
    this.searchQuery = query
  }

  customDate = (date)=> {
    var raw = new Date(date);
    var formatted = this.datePipe.transform(raw, 'dd.MM.yyyy');
    return formatted;
  }

  userRowSelect(event) {
    if (event) {
      this.selectedOrder = event.data;
      this.showDetail = true;
    }
  }

  showOrderDetailModal(){
    this.dialogService.open(this.orderDetailModal, { context: '' });
  }
}


