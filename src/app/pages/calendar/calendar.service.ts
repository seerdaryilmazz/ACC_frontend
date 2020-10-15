import { ApiService } from '../../services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CalendarService{
    constructor(private apiService:ApiService) {}

    getCalendar(id:string) {
        return this.apiService.get("getUserCalendar/", "oneorder",id);
    }
    getCalendarActivityById(id: string) {
        return this.apiService.get("getCalendarEventById/", "oneorder", id);
    }
    getUserAccounts(userName) {
        return this.apiService.get("get_accounts_by_account_owner_name_for/", "oneorder", userName);
    }
    getUserAccountsByQuery(data, toggleSpinner?) {
        return this.apiService.post("get_accounts_by_query", "oneorder", "", data, toggleSpinner);
    }
    getMyInformation() {
        return this.apiService.get("get_my_information", "oneorder", "");
    }
    getInternalParticipants() {
        return this.apiService.get("getInternalParticipants", "oneorder", "");
    }
    getCompanyContacts(id:string){
        return this.apiService.get("getCompanyContacts/", "oneorder", id);
    }
    getAccountContacts(id) {
        return this.apiService.get('getAccountContacts/', 'oneorder', id);
    }

    updateActivity(activityId,obj) {
        return this.apiService.post("updateActivity/", "oneorder",  activityId, obj);
    }
    createActivity(obj, taskNumber?) {
        let url = 'createActivity';
        if (taskNumber) {
            url += '?task=' + taskNumber;
        }
        return this.apiService.post(url, "oneorder", "", obj);
    }
    deleteActivity(eventId) {
        return this.apiService.delete("DeleteActivity","oneorder",eventId);
    }
    updateActivityStatus(id, status) {
        return this.apiService.get('update_activity_status/' + id + '/' + status, 'oneorder');
    }
    saveNote(note) {
        return this.apiService.post('save_note/', 'oneorder', note.id ? note.id : '', note);
    }
    getNote(noteId) {
        return this.apiService.get('get_note/', 'oneorder', noteId);
    }
    updateNotes(activityId, notes) {
        return this.apiService.post('update_notes_activity/', 'oneorder', activityId, notes);
    }
    validateCalendar(activity) {
        return this.apiService.post('validate_calendar', 'oneorder', '', activity);
    }
}
