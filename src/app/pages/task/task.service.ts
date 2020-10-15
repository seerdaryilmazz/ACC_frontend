import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable()
export class TaskService {
    constructor(private apiService: ApiService) {}

    getTaskSubjects() {
        return this.apiService.get('get_task_subjects', 'quadro');
    }

    getTaskStatuses() {
        return this.apiService.get('get_task_statuses', 'quadro');
    }

    getDelayedOrders(useremail: string,dateRangeValue){
        var parameters = useremail+"?dateRange="+dateRangeValue; 
        return this.apiService.get("delayed_orders/", "quadro",parameters);
    }

    getProblematicOrders(useremail: string,dateRangeValue){
        var parameters = useremail+"?dateRange="+dateRangeValue; 
        return this.apiService.get("problematic_orders/", "quadro",parameters);
    }

    getExpenseOrders(useremail: string,dateRangeValue){
        var parameters = useremail+"?dateRange="+dateRangeValue; 
        return this.apiService.get("expense_orders/", "quadro",parameters);
    }

    getAllTaskTypeCount(useremail: string,dateRange){
        var parameter = useremail + "/" + dateRange

        return this.apiService.get("get_all_task_type_count/", "quadro",parameter);
    }

    getNewLocationOrders(username: string, useremail: string) {
        return this.apiService.get('get_new_location_orders/', 'quadro', username + '/' + useremail);
    }

    saveComplaint(complaintBody: any) {
        return this.apiService.post("save_complaint", "quadro", "",complaintBody);
    }
    editComplaint(complaintBody: any) {
        return this.apiService.post("edit_complaint", "quadro", "",complaintBody);
    }
    getComplaint(userMail) {
        return this.apiService.get("get_complaints/", "quadro", userMail);
    }
    getTodoTasks(body: any) {
        return this.apiService.post("get_todo_tasks", "quadro", "", body);
    }
    getTodoTaskByNumber(number: string) {
        return this.apiService.get("get_todo_task_by_taskNumber/", "quadro", number);
    }
    saveTodoTask(todoTaskBody: any) {
        return this.apiService.post("save_todo_task", "quadro", "", todoTaskBody);
    }
    editTodoTask(todoTaskBody: any) {
        return this.apiService.post("edit_todo_task", "quadro", "", todoTaskBody);
    }
    deleteTodo(todoId) {
        return this.apiService.get("delete_todo/", "quadro", todoId);
    }
    getRelatedActivityByTask(taskNumber) {
        return this.apiService.get('get_related_activity_by_task/', 'oneorder', taskNumber);
    }
}