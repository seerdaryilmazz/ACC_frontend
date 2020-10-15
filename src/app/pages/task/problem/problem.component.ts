import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TaskService } from '../task.service';
import { TranslateService } from '../../../shared/translate/translate.service';
import { SpecificOrderComponent } from '../../../shared/components/specific-order/specific-order.component';
import { UtilsService } from '../../../services/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-problem',
  styleUrls: ['./problem.component.scss'],
  templateUrl: './problem.component.html',
})
export class ProblemComponent {
  
  @ViewChild('dialog', {static: false}) dialog:TemplateRef<any>;
  @ViewChild('orderDetailModal', { static: false }) orderDetailModal: TemplateRef<any>;
  @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;

  showDetail=false;
  selectedOrder;
  dateRangeList = [];
  dateRangeValue = 30;
  problematicOrders;
  searchQuery:string = '';
  useremail;
  constructor(private dialogService: NbDialogService, 
    private service:TaskService,
    private translateService:TranslateService,
    private utilsService:UtilsService,
    private datePipe:DatePipe){
  }

  open() {
    this.dialogService.open(this.dialog, { context: 'this is some additional data passed to dialog' });
  }

  ngOnInit(){
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList = this.utilsService.getDateRangeList();
    this.getProblematicOrders(this.dateRangeValue);
  }

  getProblematicOrders(dateRangeValue){
    this.dateRangeValue = dateRangeValue;
    this.service.getProblematicOrders(this.useremail,this.dateRangeValue).subscribe(result => {
      this.problematicOrders = result;
      var tempList = [];
      tempList = this.problematicOrders;
      tempList.sort(
        (a:any, b:any) => a.ProblemDate - b.ProblemDate
      );
      tempList.forEach(problem=> {
        problem.ProblemDate = this.datePipe.transform(problem.ProblemDate,'dd.MM.yyyy')
      })
    })
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
  
  showOrderDetailModal(){
    this.dialogService.open(this.orderDetailModal, { context: '' });
  }
}
