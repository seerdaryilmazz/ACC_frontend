import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';


@Injectable()
export class DashboardService {
    constructor(private apiService:ApiService){

    }

    getAllParameters(){
        return this.apiService.get("get_all_parameters","oneorder",);
    }

    getUserInformation(getAllSubhierarchy: boolean = true, xOnBehalfOf?:any){
        const params = '?getAllSubhierarchy=' + getAllSubhierarchy;
        return this.apiService.get("get_my_information","oneorder", params, xOnBehalfOf);
    }

    getAccountAndCalendarSize(username){
        return this.apiService.get("get_dashboard_account_and_calendar_counts_by_account_owner_name/","oneorder",username);
    }

    checkUserIsAdmin(){
        return this.apiService.get("check_user_is_admin","auth","");
    }


    getTaskAndOrderSize(useremail,dateRange){
        var parameter = useremail + "/" + dateRange
        return this.apiService.get("get_dashboard_task_and_order_counts_by_email/","quadro",parameter);
    }
}