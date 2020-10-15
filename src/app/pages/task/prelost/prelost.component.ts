import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-problem',
  styleUrls: ['./prelost.component.scss'],
  templateUrl: './prelost.component.html',
})
export class PrelostComponent {
  
  @ViewChild('dialog', {static: false}) dialog:TemplateRef<any>;

  showDetail=false;
  constructor(private dialogService: NbDialogService){
  }

  open() {
    this.dialogService.open(this.dialog, { context: 'this is some additional data passed to dialog' });
  }

}
