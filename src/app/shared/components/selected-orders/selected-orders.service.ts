import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';



@Injectable()
export class SelectedOrdersService {
    constructor(private apiService:ApiService){}

    getAllOrders(useremail, companyId?) {
        let body = useremail;
        companyId ? body += '/' + companyId : '';
        return this.apiService.get('get_all_orders/', 'quadro', body + '?dateRange=10800');
    }
    getPendingOrders(useremail,companyId){
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("yola_cikacak_siparisler/", "quadro",body);
    }
    getActiveOrders(useremail,companyId) {
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("active_orders/", "quadro", body);
    }
    getFinalizedOrders(useremail,companyId) {
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("finalized_orders/", "quadro", body);
    }
    getOnTheRoadOrders(useremail,companyId) {
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("yoldaki_siparisler/", "quadro", body);
    }
    getTerminalOrders(useremail,companyId) {
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("terminaldeki_siparisler/", "quadro", body);
    }
    getArchievedOrders(useremail,companyId) {
        var body=useremail + "/"+companyId+"?dateRange=10800";
        return this.apiService.get("archived_orders/", "quadro", body);
    }
}