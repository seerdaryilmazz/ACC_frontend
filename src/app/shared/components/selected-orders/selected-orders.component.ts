import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { SelectedOrdersService } from './selected-orders.service';
import { TranslateService } from '../../translate/translate.service';
import { DatePipe } from '@angular/common';
import { ParameterService } from '../../../services/parameter.service';
import { SpecificOrderComponent } from '../specific-order/specific-order.component';
import { NbDialogService } from '@nebular/theme';
import { UtilsService } from '../../../services/utils.service';
import { CustomRendererComponent } from '../custom-renderer/custom-renderer.component';

@Component({
    selector: 'app-selected-orders-comp',
    templateUrl: 'selected-orders.component.html',
    styleUrls: ['selected-orders.component.scss'],
})


export class SelectedOrdersComponent {
    orders;
    useremail;
    selectedOrderNo;
    searchQuery:string = ''
    @Input() companyId:number;
    @ViewChild('orderDetailModal', { static: false }) orderDetailModal: TemplateRef<any>;
    @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;
    customRendererComponent = CustomRendererComponent;
    ordersTypeList = [
        { Display: this.translateService.instant('ALL_ORDERS'), Value: '0' },
        { Display: this.translateService.instant('ACTIVE_ORDERS'), Value: '1' },
        { Display: this.translateService.instant('FINALIZED_ORDERS'), Value: '2' },
        { Display: this.translateService.instant('ORDERS_TO_LEAVE'), Value: '3' },
        { Display: this.translateService.instant('ORDERS_ON_THE_ROAD'), Value: '4' },
        { Display: this.translateService.instant('ORDERS_ON_THE_TERMINAL'), Value: '5' },
        { Display: this.translateService.instant('ARCHIVED_ORDERS'), Value: '6' }
    ]
    selectedOrderType;

    constructor(
        private service: SelectedOrdersService,
        private translateService: TranslateService,
        private datePipe: DatePipe,
        private dialogService:NbDialogService,
        private utilsService:UtilsService) { }

    ngOnInit() {
        this.selectedOrderType = '0';
        //this.changeOrdersType(this.selectedOrderType);
    }

    customDate = (date) => {
        var raw = new Date(date);
        var formatted = this.datePipe.transform(raw, 'dd.MM.yyyy');
        return formatted;
    }

    onSearch(query=''){
        this.searchQuery = query
      }

    changeOrdersType(event) {
        if (this.companyId) {
        this.selectedOrderType = event

        var userInfo = this.utilsService.getUserInfoFromLocalStorage();
        this.useremail = userInfo.UserEmail;

        if (this.selectedOrderType == '0') {
            this.service.getAllOrders(this.useremail,this.companyId).subscribe(result=>{
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '1') {
            this.service.getActiveOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '2') {
            this.service.getFinalizedOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '3') {
            this.service.getPendingOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '4') {
            this.service.getOnTheRoadOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '5') {
            this.service.getTerminalOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            })
        }
        else if (this.selectedOrderType == '6') {
            this.service.getArchievedOrders(this.useremail,this.companyId).subscribe(result => {
                this.orders = result;
                this.setCountryInfoAndLoadTableSource();
            });
        }

        }
    }


    setCountryInfoAndLoadTableSource(){
        this.orders.forEach(order =>{
            if(order.Service.includes('İthalat')){
                order.CountryInfo = order.LoadingInformation
            }
            else {
                order.CountryInfo = order.DeliveryInformation
            }
        });
    }

  onRowSelected(event){
      this.selectedOrderNo = event.data.OrderNo;
      this.dialogService.open(this.orderDetailModal, { context: '' });
    }
}