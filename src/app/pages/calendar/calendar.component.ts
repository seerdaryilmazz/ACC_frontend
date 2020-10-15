import { Component, TemplateRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import trLocale from '@fullcalendar/core/locales/tr';
import { CalendarService } from './calendar.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '../../shared/translate/translate.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CalendarEventComponent } from '../../shared/components/calendar-event/calendar-event.component';
import { TaskService } from '../task/task.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-components',
  styleUrls: ['./calendar.component.scss'],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;
  @ViewChild('confirmationModal', { static: false }) confirmationModal: DialogComponent;
  @ViewChild('calendarEventComp', {static: false}) calendarEventComp: CalendarEventComponent;
  userInformation;
  selectedEvent;
  public alerts: any = [];
  public alertsCard: any = [];
  eventList: any = [];
  selectedLang;
  relatedTask;

  constructor(private calendarService: CalendarService,
    private taskService: TaskService,
    private datePipe: DatePipe,
    private translateService: TranslateService) {
  }

  calendarPlugins = [dayGridPlugin, interactionPlugin]; // important!
  calendarEvents = [];
  trLocale = trLocale;

  ngOnInit() {
    this.selectedLang = localStorage.getItem('lang');
    if (localStorage.getItem('selectedUserInfo')) {
      this.userInformation = JSON.parse(localStorage.getItem('selectedUserInfo'));
    }
    this.loadUserCalendar();
  }

  loadUserCalendar() {
    this.calendarService.getCalendar(this.userInformation.username).subscribe(result => {
      this.calendarEvents = [];
      this.eventList = [];
      result['content'].forEach(x => {
        if (x.calendar != null) {
          this.eventList.push(x);
        }
      });
      this.eventList.forEach(element => {
        // condition indicates that the events that are not selected to be shown on the calendar
        if (element.calendar !== undefined && element.calendar != null) {
          // convert the date to be shown on the calendar
          const title = element.calendar.subject;
          let startDate = element.calendar.startDate.split(' ', 1);
          const startHour = element.calendar.startDate.split(' ', 2)[1];
          startDate = startDate.toString().split('/')[2] + '-' + startDate.toString().split('/')[1] + '-' + startDate.toString().split('/')[0];
          // add the events to the list
          this.calendarEvents = this.calendarEvents.concat({ id: element.id, title: title + ' : ' + startHour, date: startDate });
        }
      });
    });
  }

  handleDateClick(arg) {
    this.calendarEventComp.handleDateClick(arg);
  }

  onEventClicked(e) {
    if (e.event._def.publicId) {
      const id = e.event._def.publicId;
      this.calendarEventComp.onActivityClicked(id);
    }
  }

  close() {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
    this.alertsCard.splice(this.alertsCard.indexOf(alert), 1);
  }

  saveCalendarEvent(e) {
    const {requestObject} = e;
    this.calendarService.createActivity(requestObject).subscribe(result => {
      if (result['result_code'] === 200) {
        this.calendarEventComp.alerts = [];
        this.loadUserCalendar();
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_CREATE_SUCCESS');
        this.informationModal.openModal();
      } else {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_CREATE_ERROR2');
        this.informationModal.openModal();
      }
    });
    this.calendarEventComp.dialogRef.close();
  }

  updateCalendarEvent(e) {
    const {requestObject, selectedEvent} = e;
    if (selectedEvent && selectedEvent.activityAttributes && selectedEvent.activityAttributes.task) {
      this.taskService.getTodoTaskByNumber(selectedEvent.activityAttributes.task).subscribe(t => {
        this.relatedTask = t;
        if (this.relatedTask && ['OPEN', 'POSTPONED'].includes(this.relatedTask.TaskStatus)) {
          this.confirmationModal.dialogModalMessage = this.translateService.instant('COMPLETE_RELATED_TASK?', [this.relatedTask.TaskNumber]);
          this.confirmationModal.buttons = [
            {label: 'UPDATE_TASK_TOO', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject, true), class: 'btn-green'},
            {label: 'ONLY_UPDATE_ACTIVITY', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject), class: 'btn-gray'},
          ];
          this.calendarEventComp.dialogRef.close();
          this.confirmationModal.openModal();
        } else {
          this.updateEventAndRelatedTask(selectedEvent, requestObject);
        }
      });
    } else {
      this.updateEventAndRelatedTask(selectedEvent, requestObject);
    }
  }

  updateEventAndRelatedTask(selectedEvent, requestObject, updateTask = false) {
    if (this.confirmationModal) {
      this.confirmationModal.closeDialog();
    }
    this.calendarService.updateActivity(selectedEvent.id, requestObject).subscribe(result => {
      if (result['result_code'] === 200) {
        if (updateTask) {
          this.relatedTask.TaskStatus = 'COMPLETED';
          const newDesc = {
            Content: 'TASK_COMPLETED',
            ActionAt: new Date().toISOString(),
            ActionBy: this.userInformation.displayName,
          };
          this.relatedTask.TaskDescriptions.push(newDesc);
          const notification: any = new Object();
          notification.User = [this.relatedTask.TaskOwner.email, this.relatedTask.TaskCreatedBy.email];
          notification.Url = 'pages/task/todo/' + this.relatedTask.TaskNumber;
          notification.CreatedAt = new Date().toISOString();
          const accountsDesc = this.relatedTask.TaskCustomerAccount ? ` ${this.relatedTask.TaskCustomerAccount.AccountName} müşterisine ait,` : '';
          notification.Content = `${this.relatedTask.TaskNumber} nolu,${accountsDesc} ${this.translateService.instant(this.relatedTask.TaskSubject)} tipli task, ${this.userInformation.displayName} tarafından ${this.datePipe.transform(new Date(), 'dd.MM.yyyy')} tarihinde tamamlanmıştır.`;
          this.taskService.editTodoTask({ updatedTask: this.relatedTask, notification }).subscribe(t => {
          });
        }
        this.calendarEventComp.alerts = [];
        this.loadUserCalendar();
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_SUCCESS');
        this.informationModal.openModal();
      } else {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_ERROR2');
        this.informationModal.openModal();
      }
    });
    this.calendarEventComp.dialogRef.close();
  }

  deleteActivity(e) {
    this.calendarService.updateActivityStatus(e.selectedActivity.id.toString(), 'CANCELED').subscribe(result => {
      this.calendarEventComp.deleteModal.closeModal();
      if (result && result['result_code'] === 200) {
        this.loadUserCalendar();
        this.informationModal.openYesButton = false;
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_DELETE_SUCCESS');
        this.informationModal.openModal();
      } else {
        this.alerts = [];
        this.alerts.push({
          type: 'danger',
          msg: this.translateService.instant('DELETE_ACTIVITY_ERROR_MESSAGE'),
        });
      }
    }, err => {
      this.calendarEventComp.deleteModal.closeModal();
      this.loadUserCalendar();
      let errorMessage = '';
      if (err.errorText === 'Activity can not be deleted.') {
        errorMessage = this.translateService.instant('ACTIVITY_DELETE_ERROR');
      } else {
        errorMessage = err.errorText;
      }
      this.alerts = [];
      this.alerts.push({
        type: 'danger',
        msg: errorMessage,
      });
    });
  }
}
