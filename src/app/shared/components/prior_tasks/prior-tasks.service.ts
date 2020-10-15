import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';



@Injectable()
export class PriorTasksService {
    constructor(private apiService:ApiService){}
    
    getPriorTasks(useremail,dateRange){  
        var parameter = useremail+"/"+dateRange;
        return this.apiService.get("get_prior_tasks/","quadro",parameter);
    }

  
}