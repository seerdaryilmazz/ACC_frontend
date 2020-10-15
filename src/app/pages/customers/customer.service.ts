import { Injectable, Output, EventEmitter } from "@angular/core";
import { ApiService } from "../../services/api.service";

@Injectable()
export class CustomerService {
    constructor(private apiService:ApiService){}

    getAccountsByQuery(queryParams) {
        const array = [];
        for (const key of Object.keys(queryParams)) {
            if (queryParams[key] != null) {
                array.push(`${key}=${queryParams[key]}`);
            }
        }
        const query = array.join('&');
        return this.apiService.get('get_accounts_by_query', 'oneorder', '?' + query);
    }

    getAgreementsByAccountId(payload) {
        return this.apiService.post('get_agreements_by_accountId', 'oneorder', '', payload);
    }

    getOpportunitiesByQuery(payload) {
        return this.apiService.post('get_opportunities_by_query', 'oneorder', '', payload);
    }

    getOpportunityById(id) {
        return this.apiService.get('get_opportunity/' + id, 'oneorder');
    }

    getQuotesByQuery(data) {
        return this.apiService.post('get_quotes_by_query', 'oneorder', '', data);
    }

    getCompanyById(companyId: string){
        return this.apiService.get("get_company_by_id/", "oneorder", companyId);
    }
    getCompanyLocationsById(companyId: string){
        return this.apiService.get("get_company_locations_by_id/", "oneorder", companyId);
    }
    getCompanyLocationById(companyId: string,locationId:string){
        return this.apiService.get("get_company_location_by_id/"+companyId+"/", "oneorder", locationId);
    }
    saveContact(contact){
        return this.apiService.post('save_contact_to_location',"oneorder","",contact);
    }
    editContact(contact){
        return this.apiService.post('edit_contact',"oneorder","",contact);
    }
    deleteContact(contactId){
        return this.apiService.delete('DeleteContact', "oneorder",contactId);
    }
    getUserCalendar(username,accountId){
        var body=username+"/"+accountId;
        return this.apiService.get("getUserCalendar/", "oneorder", body);
    }

    getCustomerFinancialInformation(username,companyCode){
        var body=username+"/"+companyCode;
        return this.apiService.get("get_receivable_business/", "quadro", body);
    }

    downloadFile(id) {
        return this.apiService.getBlob('download_file/' + id, 'oneorder');
    }
}