import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomerService } from '../../../pages/customers/customer.service';

interface Button {
  label?: string;
  icon?: string;
  iconClass?: string;
  click: any;
  class?: string;
}
@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  public openYesButton = false;
  @Output() runMethod = new EventEmitter();
  @Output() onCloseDialog = new EventEmitter();
  @Input('buttons') buttons: Button[];
  runState = 'cannotRun';
  @Input('parentPage') parentPage: string;
  @ViewChild('informationModal', {static: false}) public informationModal: ModalDirective;
  public dialogModalMessage: any ;
  constructor(private customerService: CustomerService) { }

  ngOnInit() {

  }
  openModal() {
    this.informationModal.show();
  }
  closeModal() {
    this.informationModal.hide();
    this.runState = 'cannotRun';
    this.runMethod.emit(this.runState);
    this.openYesButton = false;
  }

  runMethodState() {
    // set runState 'canRun' to run the method

    this.runState = 'canRun';
    this.runMethod.emit(this.runState);
  }

  closeDialog() {
    this.onCloseDialog.emit();
    this.informationModal.hide();
  }
}
