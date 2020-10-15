import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { UtilsService } from '../../../services/utils.service';
import { TranslateService } from '../../../shared/translate/translate.service';

@Component({
  selector: 'ngx-task-page',
  styleUrls: ['./task-page.component.scss'],
  templateUrl: './task-page.component.html',
})
export class TaskPageComponent {

  showDetail=false;
  useremail;
  taskTypeCount={DelayedOrderCount:0,ExpenseOrderCount:0,ProblematicOrderCount:0,NewLocationOrderCount:0, ComplaintCount:0,TodosCount:0};
  dateRangeList = [];
  dateRangeValue = 30;


  constructor(private service:TaskService, private utilsService:UtilsService, private translateService:TranslateService){
   
  }

  ngOnInit(){
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.useremail = userInfo.UserEmail;
    this.dateRangeList  = this.utilsService.getDateRangeList();
    this.getAllTaskTypeCount(this.dateRangeValue);


  }

  getAllTaskTypeCount(dateRangeValue){
    this.dateRangeValue = dateRangeValue;
    this.service.getAllTaskTypeCount(this.useremail,this.dateRangeValue).subscribe(result=>{
      this.taskTypeCount.DelayedOrderCount = result["DelayedOrderCount"];
      this.taskTypeCount.ExpenseOrderCount = result["ExpenseOrderCount"];
      this.taskTypeCount.ProblematicOrderCount = result["ProblematicOrderCount"];
      this.taskTypeCount.NewLocationOrderCount=result["NewLocationOrderCount"];
      this.taskTypeCount.ComplaintCount = result["ComplaintCount"];
      this.taskTypeCount.TodosCount = result["TodosCount"];
    });
  }
  
}





