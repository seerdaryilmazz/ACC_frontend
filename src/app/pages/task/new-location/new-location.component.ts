import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '../../../shared/translate/translate.service';
import { TaskService } from '../task.service';
import { DatePipe } from '@angular/common';
import { SpecificOrderComponent } from '../../../shared/components/specific-order/specific-order.component';
import { UtilsService } from '../../../services/utils.service';
import { CustomRendererComponent } from '../../../shared/components/custom-renderer/custom-renderer.component';

@Component({
  selector: 'ngx-problem',
  styleUrls: ['./new-location.component.scss'],
  templateUrl: './new-location.component.html',
})
export class NewLocationComponent implements OnInit {
  @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;
  showDetail = false;
  useremail;
  newLocationResult;
  selectedOrder;
  userName;
  searchQuery: string = '';
  customRendererComponent = CustomRendererComponent;
  constructor(private service: TaskService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    const userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.userName = userInfo.Username;
    this.useremail = userInfo.UserEmail;

    this.service.getNewLocationOrders(this.userName.toUpperCase(), this.useremail).subscribe(result=>{
      this.newLocationResult = result;
    })
  }

  onSearch(query= '') {
    this.searchQuery = query;
  }

  userRowSelect(event) {
    if (event) {
      this.selectedOrder = event.data;
      this.showDetail = true;
    }
  }
}




