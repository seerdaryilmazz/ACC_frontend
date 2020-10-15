import { Component, OnInit, Input } from '@angular/core';
import { OrdersService } from '../../../pages/orders/orders.service';

@Component({
  selector: 'specific-order-component',
  templateUrl: './specific-order.component.html',
  styleUrls: ['./specific-order.component.scss']
})
export class SpecificOrderComponent implements OnInit {

  @Input('orderCode') orderCode;
  @Input('order') order;
  useremail;

  selectedOrder;
  constructor(private service:OrdersService) { }

  ngOnInit() {
    this.useremail = JSON.parse(localStorage.getItem('selectedUserInfo')).email;
    if(this.order==undefined){
      this.getSpecificOrder();
    }
    else {
      this.selectedOrder = this.order;
      this.selectedOrder.Service = this.selectedOrder.Service.replace('<br>','');
    }
  }


  getSpecificOrder() {
    if (this.orderCode.length > 0) {
      this.service.getSpecificOrder(this.orderCode,this.useremail).subscribe(result => {
        if (result['CompanyId']){
           this.selectedOrder = result;
           this.selectedOrder.Service = this.selectedOrder.Service.replace('<br>','');
        }
        else {
          //this.informationModal.dialogModalMessage = this.translateService.instant('ORDER_NOT_FOUND');
          //this.informationModal.openModal();
        }
      });
    }
    else {
      //this.informationModal.dialogModalMessage = this.translateService.instant('ORDER_CODE_REQUIRED');
      //this.informationModal.openModal();
    }
  }

}
