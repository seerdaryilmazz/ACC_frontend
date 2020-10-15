import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable()
export class OrdersService {

    scope = "quadro"
    constructor(private apiService: ApiService) { }

    getOrders(useremail, type,dateRangeValue,pageNumber?,pageSize?) {
        var parameters = useremail+"?dateRange="+dateRangeValue; 
        if (type == "active")
            return this.apiService.get("active_orders/", this.scope,parameters);
        if (type == "finalized")
            return this.apiService.get("finalized_orders/", this.scope, parameters);
        if (type == "pending")
            return this.apiService.get("yola_cikacak_siparisler/", this.scope, parameters);
        if (type == "ontheroad")
            return this.apiService.get("yoldaki_siparisler/", this.scope, parameters);
        if (type == "terminal")
            return this.apiService.get("terminaldeki_siparisler/", this.scope, parameters);
        if (type == "ontheroadleaving")
            return this.apiService.get("terminalden_cikan_siparisler/", this.scope, parameters);    
        if (type == "archieved")
            parameters = parameters + "&pageNumber="+pageNumber + "&pageSize="+pageSize;
            return this.apiService.get("archived_orders/", this.scope, parameters);
    }

    getAllOrdersTypeCount(useremail,dateRangeValue) {
        var parameters = useremail+"/"+dateRangeValue; 
        return this.apiService.get("get_all_orders_type_count/", this.scope, parameters);
    }
    getSpecificOrder(orderCode, useremail) {
        return this.apiService.get("get_specific_order/", this.scope, orderCode + '/' + useremail)
    }
}