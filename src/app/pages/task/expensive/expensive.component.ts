import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TaskService } from '../task.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../shared/translate/translate.service';
import { SpecificOrderComponent } from '../../../shared/components/specific-order/specific-order.component';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'ngx-problem',
  styleUrls: ['./expensive.component.scss'],
  templateUrl: './expensive.component.html',
})
export class ExpensiveComponent {

  @ViewChild('dialog', {static: false}) dialog:TemplateRef<any>;
  @ViewChild('orderDetailModal', { static: false }) orderDetailModal: TemplateRef<any>;
  @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;
  
  showDetail=false;
  selectedOrder;
  expenseOrders;
  searchQuery:string = '';
  useremail;
  dateRangeList = [];
  dateRangeValue = 30;
  constructor(private dialogService: NbDialogService, 
    private service:TaskService,
    private datePipe: DatePipe,
    private utilsService:UtilsService){
  }

  ngOnInit(){
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList = this.utilsService.getDateRangeList();
    this.getExpenseOrders(this.dateRangeValue);
  
  }

  getExpenseOrders(dateRangeValue){
    this.dateRangeValue = dateRangeValue;
    this.service.getExpenseOrders(this.useremail,this.dateRangeValue).subscribe(result => {
      this.expenseOrders = result;
      this.expenseOrders.forEach(expense=> {
        expense.ExpenseDate = this.datePipe.transform(expense.ExpenseDate,'dd.MM.yyyy')
      })
    })
  }


  userRowSelect(event) {
    if (event) {
      this.selectedOrder = event.data;
      this.showDetail = true;
    }
  }

  onSearch(query: string = '') {
    this.searchQuery = query
  }

  showOrderDetailModal(){
    this.dialogService.open(this.orderDetailModal, { context: '' });
  }

}
