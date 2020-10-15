import { Component, OnInit, Input, ViewChild, TemplateRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TaskService } from '../../task.service';
import { RichTextViewComponent } from '../../../../shared/components/rich-text-view/rich-text-view.component';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { TranslateService } from '../../../../shared/translate/translate.service';
import { IgxDatePickerComponent, DateRangeType } from 'igniteui-angular';
import { NbDialogService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { CalendarEventComponent } from '../../../../shared/components/calendar-event/calendar-event.component';
import { CalendarService } from '../../../calendar/calendar.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../_services';

@Component({
  selector: 'todo-task-detail',
  templateUrl: './todo-task-detail.component.html',
  styleUrls: ['./todo-task-detail.component.scss'],
})
export class TodoTaskDetailComponent implements OnInit {
  @ViewChild('confirmationModal', { static: false }) confirmationModal: DialogComponent;
  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;
  @ViewChild('deadlineTemplate', { static: false }) deadlineTemplate: TemplateRef<any>;
  @ViewChild('descriptionTemplate', { static: false }) descriptionTemplate: TemplateRef<any>;
  @ViewChild('calendarEvent', { static: false }) calendarEvent: CalendarEventComponent;
  @ViewChild('datePicker', { static: false }) public datePicker: IgxDatePickerComponent;
  @Output() taskChanged = new EventEmitter<any>();

  task: any;
  relatedActivity: any;
  richTextViewer = RichTextViewComponent;
  newDescriptionContent;
  deadlineDialog;
  descriptionDialog;
  selectedUserInfo: any;
  isPostponeVisible: boolean;
  isCloseVisible: boolean;
  newDeadline;
  selectedEvent;
  descriptionPreviewConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: false,
    sanitize: true,
    toolbarPosition: 'top',
  };

  descriptionConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
    ],
  };

  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private userService: UserService,
    private dialogService: NbDialogService,
    private cdRef: ChangeDetectorRef,
    private taskService: TaskService) { }

  ngOnInit() {
    const taskNumber = this.route.snapshot.params['number'];
    this.getTaskByNumber(taskNumber);
    this.selectedUserInfo = JSON.parse(localStorage.getItem('selectedUserInfo'));
  }

  isVisible(button: string) {
    const t = this.task;
    switch (button) {
      case 'REOPEN':
        return t.TaskCreatedBy.email === this.selectedUserInfo.email && 'COMPLETED' === t.TaskStatus;
      case 'CANCEL':
        return t.TaskCreatedBy.email === this.selectedUserInfo.email && ['OPEN', 'POSTPONED'].includes(t.TaskStatus);
      case 'COMPLETE':
        return [t.TaskCreatedBy.email, t.TaskOwner.email].includes(this.selectedUserInfo.email) && ['OPEN', 'POSTPONED'].includes(t.TaskStatus);
      case 'POSTPONE':
        return [t.TaskCreatedBy.email, t.TaskOwner.email].includes(this.selectedUserInfo.email) && ['OPEN', 'POSTPONED'].includes(t.TaskStatus);
      case 'CLOSE':
        return t.TaskCreatedBy.email === this.selectedUserInfo.email && 'COMPLETED' === t.TaskStatus;
      case 'ACTIVITY':
        return ['OPEN', 'POSTPONED'].includes(t.TaskStatus) && [t.TaskCreatedBy.email, t.TaskOwner.email].includes(this.selectedUserInfo.email);
      default:
        return true;
    }
  }

  getTaskByNumber(number) {
    this.taskService.getTodoTaskByNumber(number).subscribe(r => {
      this.task = r;
      this.task.TaskDescriptions.sort((a, b) =>  new Date(b.ActionAt).getTime() - new Date(a.ActionAt).getTime());
      this.getRelatedActivity(this.task.TaskNumber);
    });
  }

  getRelatedActivity(taskNumber) {
    this.taskService.getRelatedActivityByTask(taskNumber).subscribe(a => {
      this.relatedActivity = a[0];
    });
  }

  userRowSelect(desc) {
    desc.data.translatedContent = this.translateService.instant(desc.data.Content, desc.data.TranslateParams);
    this.descriptionDialog = this.dialogService.open(this.descriptionTemplate, {'autoFocus': false, context: desc.data});
  }

  addDescription(content, translateParams?) {
    const newDesc = {
      Content: content,
      ActionAt: new Date().toISOString(),
      ActionBy: this.selectedUserInfo.displayName,
    };
    if (translateParams) {
      newDesc['TranslateParams'] = translateParams;
    }
    const updatedTask = {...this.task};
    updatedTask.TaskDescriptions = [...updatedTask.TaskDescriptions, newDesc];
    return updatedTask;
  }

  saveDescription() {
    const updatedTask = this.addDescription(this.newDescriptionContent);
    const callback = () => {
      this.informationModal.dialogModalMessage = this.translateService.instant('DESC_ADDED');
      this.informationModal.openModal();
      this.newDescriptionContent = undefined;
    };
    this.updateTask(updatedTask, undefined, callback);
  }

  cancelTask() {
    const updatedTask = this.addDescription('TASK_CANCELLED');
    updatedTask.TaskStatus = 'CANCELED';
    const notification: any = new Object();
    notification.User = [updatedTask.TaskOwner.email];
    const accountsDesc = updatedTask.TaskCustomerAccount ? ` ${updatedTask.TaskCustomerAccount.AccountName} müşterisi için açılan` : '';
    notification.Content = `${updatedTask.TaskNumber} nolu task${accountsDesc} ${this.translateService.instant(updatedTask.TaskSubject)} tipli task ${this.selectedUserInfo.displayName} tarafından ${this.datePipe.transform(new Date(), 'dd.MM.yyyy')} tarihinde iptal edilmiştir.`;
    this.updateTask(updatedTask, notification);
  }

  reopenTask() {
    const updatedTask = this.addDescription('TASK_REOPENED');
    updatedTask.TaskStatus = 'OPEN';
    updatedTask.TaskDeadline = this.newDeadline;
    const notification: any = new Object();
    notification.User = [updatedTask.TaskOwner.email];
    const accountsDesc = updatedTask.TaskCustomerAccount ? ` ${updatedTask.TaskCustomerAccount.AccountName} müşterisine ait` : '';
    notification.Content = `${updatedTask.TaskNumber} nolu${accountsDesc} ${this.translateService.instant(updatedTask.TaskSubject)} tipli task ${this.selectedUserInfo.displayName} tarafından ${this.datePipe.transform(new Date(), 'dd.MM.yyyy')} tarihinde tekrar açılmıştır. Yeni deadline: ${this.datePipe.transform(updatedTask.TaskDeadline, 'dd.MM.yyyy')}.`;
    this.updateTask(updatedTask, notification);
  }

  postponeTask() {
    const oldDeadline = new Date(this.task.TaskDeadline);
    const translateParams = [
      this.datePipe.transform(oldDeadline, 'dd.MM.yyyy'),
      this.datePipe.transform(this.newDeadline, 'dd.MM.yyyy'),
    ];
    const updatedTask = this.addDescription('TASK_POSTPONED', translateParams);
    updatedTask.TaskStatus = 'POSTPONED';
    updatedTask.TaskDeadline = this.newDeadline;
    const notification: any = new Object();
    notification.User = [updatedTask.TaskOwner.email, updatedTask.TaskCreatedBy.email];
    const accountsDesc = updatedTask.TaskCustomerAccount ? ` ${updatedTask.TaskCustomerAccount.AccountName} müşterinin` : '';
    notification.Content = `${updatedTask.TaskNumber} numaralı,${accountsDesc} ${this.translateService.instant(updatedTask.TaskSubject)} tipli taskı ertelendi. Eski deadline ${this.datePipe.transform(oldDeadline, 'dd.MM.yyyy')} , yeni deadline ${this.datePipe.transform(updatedTask.TaskDeadline, 'dd.MM.yyyy')}.`;
    this.updateTask(updatedTask, notification);
  }

  closeTask() {
    const updatedTask = this.addDescription('TASK_CLOSED');
    updatedTask.TaskStatus = 'CLOSED';
    const notification: any = new Object();
    notification.User = [updatedTask.TaskOwner.email];
    const accountsDesc = updatedTask.TaskCustomerAccount ? ` ${updatedTask.TaskCustomerAccount.AccountName} müşterisine ait` : '';
    notification.Content = `${updatedTask.TaskNumber} nolu,${accountsDesc} ${this.translateService.instant(updatedTask.TaskSubject)} tipli task ${this.selectedUserInfo.displayName} tarafından ${this.datePipe.transform(new Date(), 'dd.MM.yyyy')} tarihinde kapatılmıştır.` ;
    this.updateTask(updatedTask, notification);
  }

  completeTask(e) {
    if (e === 'canRun') {
      const updatedTask = this.addDescription('TASK_COMPLETED');
      updatedTask.TaskStatus = 'COMPLETED';
      const notification: any = new Object();
      notification.User = [updatedTask.TaskOwner.email, updatedTask.TaskCreatedBy.email];
      const accountsDesc = updatedTask.TaskCustomerAccount ? ` ${updatedTask.TaskCustomerAccount.AccountName} müşterisine ait,` : '';
      notification.Content = `${updatedTask.TaskNumber} nolu,${accountsDesc} ${this.translateService.instant(updatedTask.TaskSubject)} tipli task, ${this.selectedUserInfo.displayName} tarafından ${this.datePipe.transform(new Date(), 'dd.MM.yyyy')} tarihinde tamamlanmıştır.`;
      this.updateTask(updatedTask, notification);
    }
  }

  openDeadlineDialog(context) {
    const today = new Date();
    this.newDeadline = today;
    this.deadlineDialog = this.dialogService.open(this.deadlineTemplate, {'autoFocus': false, context: context});
    this.cdRef.detectChanges();
    this.datePicker.disabledDates = [{ type: DateRangeType.Before, dateRange: [today] }];
  }

  openConfirmationModal() {
    this.confirmationModal.dialogModalMessage = this.translateService.instant('TASK_WILL_BE_COMPLETED?');
    this.confirmationModal.openYesButton = true;
    this.confirmationModal.openModal();
  }

  updateTask(updatedTask, notification, callback?) {
    const updateData = {updatedTask};
    if (notification) {
      notification.Read = false;
      notification.Url = 'pages/task/todo/' + updatedTask.TaskNumber;
      notification.CreatedAt = new Date().toISOString();
      updateData['notification'] = notification;
    }
    this.taskService.editTodoTask(updateData).subscribe(r => {
      this.task = r;
      this.task.TaskDescriptions.sort((a, b) =>  new Date(b.ActionAt).getTime() - new Date(a.ActionAt).getTime());
      if (this.deadlineDialog) {
        this.deadlineDialog.close();
      }
      if (this.confirmationModal) {
        this.confirmationModal.closeDialog();
      }
      this.getRelatedActivity(this.task.TaskNumber);
      if (callback) {
        callback();
      }
      this.userService.reloadNotifications();
    }, err => {
        if (this.deadlineDialog) {
          this.deadlineDialog.close();
        }
        if (this.confirmationModal) {
          this.confirmationModal.closeDialog();
        }
        this.informationModal.dialogModalMessage = 'Error occurred: ' + err;
        this.informationModal.openModal();
    });
  }

  openCalenderEvent() {
    if (this.relatedActivity) {
      this.calendarEvent.onActivityClicked(this.relatedActivity.id);
    } else {
      const arg = {date: new Date()};
      this.calendarEvent.handleDateClick(arg, this.task.TaskCustomerAccount.AccountId);
    }
  }

  saveCalendarEvent(e) {
    const {requestObject} = e;
    this.calendarService.createActivity(requestObject, this.task.TaskNumber).subscribe(result => {
      if (result['result_code'] === 200) {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_CREATE_SUCCESS');
        this.informationModal.openModal();
        this.getRelatedActivity(this.task.TaskNumber);
      } else {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_CREATE_ERROR2');
        this.informationModal.openModal();
      }
    });
    this.calendarEvent.dialogRef.close();
  }

  updateCalendarEvent(e) {
    const {requestObject, selectedEvent} = e;
    if (selectedEvent && selectedEvent.activityAttributes && selectedEvent.activityAttributes.task) {
      if (['OPEN', 'POSTPONED'].includes(this.task.TaskStatus)) {
        this.confirmationModal.dialogModalMessage = this.translateService.instant('COMPLETE_RELATED_TASK?', [this.task.TaskNumber]);
        this.confirmationModal.buttons = [
          {label: 'UPDATE_TASK_TOO', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject, true), class: 'btn-green'},
          {label: 'ONLY_UPDATE_ACTIVITY', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject), class: 'btn-gray'},
        ];
        this.calendarEvent.dialogRef.close();
        this.confirmationModal.openModal();
      } else {
        this.updateEventAndRelatedTask(selectedEvent, requestObject);
      }
    }
  }

  updateEventAndRelatedTask(selectedEvent, requestObject, updateTask = false) {
    if (this.confirmationModal) {
      this.confirmationModal.closeDialog();
    }
    this.calendarService.updateActivity(selectedEvent.id, requestObject).subscribe(result => {
      if (result['result_code'] === 200) {
        if (updateTask) {
          this.completeTask('canRun');
        }
        this.calendarEvent.alerts = [];
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_SUCCESS');
        this.informationModal.openYesButton = false;
        this.informationModal.openModal();
      } else {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_ERROR2');
        this.informationModal.openModal();
      }
    });
    this.calendarEvent.dialogRef.close();
  }

  deleteActivity(e) {
    this.calendarService.updateActivityStatus(e.selectedActivity.id.toString(), 'CANCELED').subscribe(result => {
      this.calendarEvent.deleteModal.closeModal();
      if (result && result['result_code'] === 200) {
        this.getTaskByNumber(this.task.TaskNumber);
        this.informationModal.openYesButton = false;
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_DELETE_SUCCESS');
        this.informationModal.openModal();
      }
    }, err => {
      this.calendarEvent.deleteModal.closeModal();
    });
  }
}
