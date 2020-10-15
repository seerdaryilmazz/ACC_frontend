import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { OrdersService } from '../orders.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../shared/translate/translate.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { CustomRendererComponent } from '../../../shared/components/custom-renderer/custom-renderer.component';

@Component({
  selector: 'ngx-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit {

 
  
    @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
    activeOrdersSubsc: Subscription;
    activeOrderSettings;
    activeOrders: any;
    selectedOrder;
    localDataSource = new LocalDataSource();
    showDetail = false;
    useremail;
    dialogRef: any;
    type = "";
    searchText = ""
    dateRangeValue = 30
    dateRangeList = [{ "name": "Son Bir Ay", "value": 30 },
     { "name": "Son İki Ay", "value": 60 }, 
     { "name": "Son Üç Ay", "value": 90 },
      { "name": "Son Dört Ay", "value": 120 },
       { "name": "Son Beş Ay", "value": 150 }, 
       { "name": "Son Altı Ay", "value": 180 },
       { "name": "Son 1 Yıl", "value": 360 },
       { "name": "Son 2 Yıl", "value": 720 },
       { "name": "Son 3 Yıl", "value": 1080 },
       { "name": "Tüm Zamanlar", "value": 10800 }]
    @ViewChild('problemModal', { static: false }) problemModal: TemplateRef<any>;
    @ViewChild('expenseModal', { static: false }) expenseModal: TemplateRef<any>;
    @ViewChild('delayModal', { static: false }) delayModal: TemplateRef<any>;
    totalCount = 0;
    pageNumber = 1;
    pageSize  = 10;
    constructor(private dialogService: NbDialogService,
      private ordersService: OrdersService,
      private router: Router,
      private utilsService:UtilsService) {
    }
  
    ngOnInit() {
  
      var userInfo = this.utilsService.getUserInfoFromLocalStorage();
      this.useremail = userInfo.UserEmail;
  
      this.type = (this.router.url.split('/')[3]).split('-')[0];
      this.getOrders();
    }
  
    getOrders() {
      this.activeOrdersSubsc = this.ordersService.getOrders(this.useremail, this.type, this.dateRangeValue,this.pageNumber,this.pageSize).subscribe(result => {
        this.activeOrders = result;
        this.totalCount = this.activeOrders[0]['TotalCount']
        this.localDataSource.load(this.activeOrders);
      });
    }

    pageChange($event,dateRangeValue){
      this.dateRangeValue = dateRangeValue
      this.pageNumber =$event;
      this.getOrders();
    }
  
    ngOnDestroy(): void {
      //this.activeOrdersSubsc.unsubscribe();
    }

    userRowSelect(event) {
      if (event) {
        this.selectedOrder = event;
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
  
  
  
  
  