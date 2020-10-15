import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { EventActivity } from '../../dto/event';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorComponent } from '@kolkov/angular-editor';
import { NbDialogService, NbToastrService, NbToastRef, NbDialogRef } from '@nebular/theme';
import { CalendarService } from '../../../pages/calendar/calendar.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ParameterService } from '../../../services/parameter.service';
import { TranslateService } from '../../translate/translate.service';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';
import { DropdownComponent } from '../dropdown/dropdown.component';

const TOAST_MSG = {
  updated : 'NOTE_UPDATED_SUCCESSFULLY',
  saved: 'NOTE_SAVED_SUCCESSFULLY',
  deleted: 'NOTE_DELETED_SUCCESSFULLY',
};

const ACTIVITY_STATUS = {
  COMPLETED: { id: 'COMPLETED', code: 'COMPLETED', name: 'Completed' },
  OPEN: { id: 'OPEN', code: 'OPEN', name: 'Open' },
};

@Component({
  selector: 'calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent implements OnInit {
  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('noteDeleteDialog', { static: false }) noteDeleteDialog: TemplateRef<any>;
  @ViewChild('editor', { static: false }) editor: AngularEditorComponent;
  @ViewChild('deleteModal', { static: false }) deleteModal: DialogComponent;
  @ViewChild('dd', { static: false }) dd: DropdownComponent;
  @Output() onSaveCalendarEvent = new EventEmitter<any>();
  @Output() onUpdateCalendarEvent = new EventEmitter<any>();
  @Output() onDeleteCalendarEvent = new EventEmitter<any>();


  public buttonClicked = false;
  public activityForm: FormGroup;
  public noteForm: FormGroup;
  activityTitleControl: AbstractControl;
  activityLocationControl: AbstractControl;
  activityDescControl: AbstractControl;
  activityTypeControl: AbstractControl;
  activitySegmentControl: AbstractControl;
  activityScopeControl: AbstractControl;
  activityToolControl: AbstractControl;
  intPartControl: AbstractControl;
  extPartControl: AbstractControl;
  selectedAccControl: AbstractControl;
  startDateControl: AbstractControl;
  endDateControl: AbstractControl;
  shareWithAll: AbstractControl;
  selectedActivity: any;
  today;
  flipped: boolean = false;
  relatedTask;
  userInformation;
  userModel;
  dialogRef: any;
  noteDeleteDialogRef: NbDialogRef<any>;
  toastRef: NbToastRef;
  viewOnly: boolean;
  public alerts: any = [];
  public alertsCard: any = [];
  public userAccounts: any = [];
  calendarInternalParticipants: any;
  calendarExternalParticipants: any;
  calendarEventTypes: any = [];
  calendarScopeTypes: any = [];
  calendarToolTypes: any = [];
  calendarSegmentTypes: any = [];
  noteTypes: any = [];
  userList = [];
  editorConfig: AngularEditorConfig = {
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
  segmentTypeConfig = {
    displayKey: 'name',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('Select_Segment'),
    noResultsFound: this.translateService.instant('Segment_not_found'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'name',
    limitTo: 5,
  };
  eventTypeConfig = {
    displayKey: 'code',
    search: false,
    translate: true,
    placeholder: this.translateService.instant('Activity_Type'),
  };
  toolTypeConfig = {
    displayKey: 'code',
    search: false,
    translate: true,
    placeholder: this.translateService.instant('Tool'),
  };
  scopeConfig = {
    displayKey: 'code',
    search: false,
    translate: true,
    placeholder: this.translateService.instant('Scope'),
    height: '100px',
  };
  userTypeConfig = {
    displayKey: 'code',
    search: true,
    translate: true,
    moreText: this.translateService.instant('more'),
    placeholder: 'Kullanıcı Seçiniz',
    noResultsFound: this.translateService.instant('NO_RESULT'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'name',
  };
  userAccountsConfig = {
    displayKey: 'AccountName',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_ACCOUNT'),
    noResultsFound: this.translateService.instant('NO_ACCOUNT_FOUND'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'AccountName',
    // limitTo: 5
  };
  internalParticipantsConfig = {
    displayKey: 'name',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_INTERNAL_PARTICIPANT'),
    noResultsFound: this.translateService.instant('NO_INTERNAL_PARTICIPANT'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'name',
  };

  externalParticipantsConfig = {
    displayKey: 'name',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_EXTERNAL_PARTICIPANT'),
    noResultsFound: this.translateService.instant('NO_EXTERNAL_PARTICIPANT'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'name',
  };
  noteTypeConfig = {
    displayKey: 'code',
    translate: true,
    placeholder: this.translateService.instant('SELECT_NOTE_TYPE'),
    noResultsFound: this.translateService.instant('NO_RESULT'),
  };

  constructor(private dialogService: NbDialogService,
    private calendarService: CalendarService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public router: Router,
    private toastrService: NbToastrService,
    private titleCase: TitleCasePipe,
    private parameterService: ParameterService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initializeNoteForm();
    this.initializeActivityForm();
    if (localStorage.getItem('selectedUserInfo')) {
      this.userInformation = JSON.parse(localStorage.getItem('selectedUserInfo'));
    }
    this.getAllUserAccounts();
    this.getInternalParticipantsList();
    this.calendarToolTypes = this.parameterService.getParameter('ActivityTools');
    this.calendarScopeTypes = this.parameterService.getParameter('ActivityScopes');
    this.calendarSegmentTypes = this.parameterService.getParameter('BusinessSegmentTypes');
    this.calendarEventTypes = this.parameterService.getParameter('CalendarEventTypes');
    this.noteTypes = this.parameterService.getParameter('NoteTypes').filter(i => i.code !== 'SPOT_PDF_NOTE');
    this.userList = this.parameterService.getParameter('UserList');
  }

  initializeActivityForm() {
    this.activityForm = this.fb.group({
      'activityTitleControl': new FormControl('', [Validators.required]),
      'activityTypeControl': new FormControl(null, [Validators.required]),
      'activitySegmentControl': new FormControl([], Validators.required),
      'activityScopeControl': new FormControl(null, Validators.required),
      'activityToolControl': new FormControl(null, Validators.required),
      'activityLocationControl': new FormControl('', Validators.required),
      'intPartControl': new FormControl([], Validators.required),
      'extPartControl': new FormControl([]),
      'selectedAccControl': new FormControl(null, Validators.required),
      'startDateControl': new FormControl('', Validators.required),
      'endDateControl': new FormControl('', Validators.required),
      'activityDescControl': new FormControl(''),
      'shareWithAll': new FormControl(null),
    });

    for (const key of Object.keys(this.activityForm.controls)) {
      this[key] = this.activityForm.controls[key];
    }

    this.alerts = [];
    this.alertsCard = [];
    this.buttonClicked = false;
    this.selectedActivity = undefined;
    this.cdRef.detectChanges();
  }

  initializeNoteForm() {
    this.noteForm = this.fb.group({
      'type': new FormControl('', [Validators.required]),
      'content': new FormControl('', [Validators.required]),
      'createDate': new FormControl(),
      'createdBy': new FormControl(),
      'id': new FormControl(),
    });
  }

  handleDateClick(arg, initialAccountId?) {
    this.viewOnly = false;
    this.initializeNoteForm();
    this.initializeActivityForm();
    this.today = new Date();
    this.flipped = false;
    const selectedActivityStartDate = new Date(arg.date.getFullYear(), arg.date.getMonth(),
      arg.date.getDate(), this.today.getHours(), this.today.getMinutes());
    const selectedActivityEndDate = new Date(arg.date.getFullYear(), arg.date.getMonth(),
      arg.date.getDate(), this.today.getHours() + 1, this.today.getMinutes());
    this.startDateControl.setValue(selectedActivityStartDate);
    this.endDateControl.setValue(selectedActivityEndDate);
    this.calendarExternalParticipants = [];
    if (initialAccountId) {
      this.selectedAccControl.setValue(this.userAccounts.find(r => r.AccountId === initialAccountId));
      this.getExternalParticipants(this.selectedAccControl.value).subscribe(r => this.calendarExternalParticipants = r);
    }
    this.cdRef.detectChanges();
    this.dialogRef = this.dialogService.open(this.dialog);
  }

  onActivityClicked(id, viewOnly = false, fullCalendarEvent?) {
    this.initializeNoteForm();
    this.initializeActivityForm();
    this.flipped = false;
    this.calendarService.getCalendarActivityById(id).subscribe(result => {
      if (result.toString().includes('not found')) {
        this.alerts = [];
        this.alerts.push({
          type: 'danger',
          msg: this.translateService.instant('ACTIVITY_ERROR'),
        });
      } else if (result !== undefined && result != null && result['tool'].code !== undefined &&
        this.activityTitleControl.value !== result['tool'].code != null) {
        this.today = new Date();
        this.viewOnly = viewOnly;
        this.editorConfig.editable = !viewOnly;
        this.activityTitleControl.setValue(result['calendar'].subject);
        this.selectedActivity = result;
        if (this.selectedActivity.notes) {
          this.selectedActivity.notes = this.selectedActivity.notes.sort((a, b) =>
            this.getDate(b.createDate).getTime() - this.getDate(a.createDate).getTime());
        }

        const startD = result['calendar'].startDate.split(' ', 1)[0].split('/');
        const startT = result['calendar'].startDate.split(' ', 2)[1].split(':');
        this.startDateControl.setValue(new Date(startD[2], startD[1] - 1, startD[0], startT[0], startT[1]));
        this.shareWithAll.setValue(result['calendar'].shareWithAll);
        this.startDateChange();

        if (result['calendar'].endDate != null) {
          const endD = result['calendar'].endDate.split(' ', 1)[0].split('/');
          const endT = result['calendar'].endDate.split(' ', 2)[1].split(':');
          this.endDateControl.setValue(new Date(endD[2], endD[1] - 1, endD[0], endT[0], endT[1]));
        }
        this.activityLocationControl.setValue(result['calendar'].location);
        this.activityDescControl.setValue(result['calendar'].content);

        // fill scope, tool and the others
        this.activityTypeControl.setValue(this.calendarEventTypes.find(x => x.code === result['type']['code']));
        this.activityScopeControl.setValue(this.calendarScopeTypes.find(x => x.code === result['scope'].code));
        this.activityToolControl.setValue(this.calendarToolTypes.find(x => x.code === result['tool'].code));

        const selectedSegmentTypes = [];
        result['serviceAreas'].forEach(element => {
          selectedSegmentTypes.push(this.calendarSegmentTypes.find(x => x.code === element.code));
        });
        this.activitySegmentControl.setValue(selectedSegmentTypes);

        if (viewOnly) {
          result['account']['AccountName'] = result['account']['name'];
          this.selectedAccControl.setValue(result['account']);
        } else {
          const account = this.userAccounts.find(x => x.AccountId === result['account'].id);
          this.selectedAccControl.setValue(account);
        }

        const selectedInternalParticipants = [];
        result['calendar'].internalParticipants.forEach(element => {
          selectedInternalParticipants.push(this.calendarInternalParticipants.find(x => x.id === element.id));
        });
        this.intPartControl.setValue(selectedInternalParticipants);

        if (result['calendar'].externalParticipants) {
          this.getExternalParticipants(this.selectedAccControl.value).subscribe(r => {
            this.calendarExternalParticipants = r;
            const selectedExternalParticipants = [];
            result['calendar'].externalParticipants.forEach(element => {
              selectedExternalParticipants.push(this.calendarExternalParticipants.find(x => x.id === element.id));
            });
            this.extPartControl.setValue(selectedExternalParticipants);
          });
        }

        // open the dialog and show the related event
        this.dialogRef = this.dialogService.open(this.dialog);
      } else if (result === undefined && result == null && result['tool'].code === undefined &&
        this.activityTitleControl.value !== result['tool'].code == null) {
        this.alerts = [];
        this.alerts.push({
          type: 'danger',
          msg: this.translateService.instant('ACTIVITY_ERROR'),
        });
      }
    }, error => {
      this.alerts = [];
      this.alerts.push({
        type: 'danger',
        msg: error.message,
      });
    });
  }

  toggleFlipCard() {
    this.flipped = !this.flipped;
    this.buttonClicked = false;
  }

  scopeChange(e) {
    if (e && e.value && e.value.code === 'INTERNAL' ) {
      this.extPartControl.setValue([]);
    }
  }

  startDateChange() {
    if (this.today && this.startDateControl.value && this.today > this.startDateControl.value) {
      this.shareWithAll.setValue(false);
    }
  }

  checkTime() {
    return this.startDateControl.value.getTime() < this.endDateControl.value.getTime();
  }

  close() {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
    this.alertsCard.splice(this.alertsCard.indexOf(alert), 1);
  }

  saveActivity() {
    this.buttonClicked = true;
    this.alertsCard = [];
    if (this.validateActivity()) {
      const calendar: any = new Object();
      calendar.onlyWithOrganizer = true;
      calendar.shareWithAll = this.shareWithAll.value;

      this.userModel = this.mapUser(this.userInformation);
      calendar.organizer = this.userModel;
      calendar.internalParticipants = [];
      this.intPartControl.value.forEach(contact => calendar.internalParticipants.push(contact));
      calendar.externalParticipants = [];
      this.extPartControl.value.forEach(contact => calendar.externalParticipants.push(contact));
      calendar.subject = this.activityTitleControl.value;
      let startDate = this.datePipe.transform(this.startDateControl.value, 'dd/MM/yyyy HH:mm');
      startDate = startDate + ' Europe/Istanbul';
      if (this.startDateControl.value.getMinutes() < 10 && this.startDateControl.value.getHours() < 10) {
        startDate = startDate.replace(startDate.split(' ')[1], '0' + this.startDateControl.value.getHours() +
          ':' + '0' + this.startDateControl.value.getMinutes());
      } else if (this.startDateControl.value.getHours() < 10) {
        startDate = startDate.replace(startDate.split(' ')[1], '0' + this.startDateControl.value.getHours() +
          ':' + this.startDateControl.value.getMinutes());
      } else if (this.startDateControl.value.getMinutes() < 10) {
        startDate = startDate.replace(startDate.split(' ')[1], this.startDateControl.value.getHours() +
          ':' + '0' + this.startDateControl.value.getMinutes());
      }
      calendar.startDate = startDate;
      let endDate = this.datePipe.transform(this.endDateControl.value, 'dd/MM/yyyy HH:mm');
      endDate = endDate + ' Europe/Istanbul';
      if (this.endDateControl.value.getMinutes() < 10 && this.endDateControl.value.getHours() < 10) {
        endDate = endDate.replace(endDate.split(' ')[1], '0' + this.endDateControl.value.getHours() +
          ':' + '0' + this.endDateControl.value.getMinutes());
      } else if (this.endDateControl.value.getHours() < 10) {
        endDate = endDate.replace(endDate.split(' ')[1], '0' + this.endDateControl.value.getHours() +
          ':' + this.endDateControl.value.getMinutes());
      } else if (this.endDateControl.value.getMinutes() < 10) {
        endDate = endDate.replace(endDate.split(' ')[1], this.endDateControl.value.getHours() +
          ':' + '0' + this.endDateControl.value.getMinutes());
      }
      calendar.location = this.activityLocationControl.value;
      calendar.endDate = endDate;
      calendar.subject = this.activityTitleControl.value;
      calendar.content = this.activityDescControl.value;
      const requestObject = new EventActivity();

      requestObject.account = { id: this.selectedAccControl.value.AccountId, name: this.selectedAccControl.value.AccountName };
      requestObject.calendar = calendar;
      requestObject.createdBy = this.userInformation.id;
      requestObject.scope = this.activityScopeControl.value;
      requestObject.serviceAreas = this.activitySegmentControl.value;
      requestObject.tool = this.activityToolControl.value;
      requestObject.type = this.activityTypeControl.value;
      requestObject.status = ACTIVITY_STATUS.OPEN;
      this.calendarService.validateCalendar(requestObject).subscribe(r => {
        if (r['args']) {
          requestObject.status = ACTIVITY_STATUS.COMPLETED;
        }
      });

      if (this.selectedActivity) {
        calendar.calendarId = this.selectedActivity.calendar.calendarId;
        requestObject.notes = this.selectedActivity.notes;
        this.onUpdateCalendarEvent.emit({ selectedEvent: this.selectedActivity, requestObject });
      } else {
        this.onSaveCalendarEvent.emit({ requestObject });
      }
    } else {
      this.alertsCard.push({
        type: 'danger',
        msg: this.selectedActivity ? this.translateService.instant('ACTIVITY_UPDATE_ERROR') : this.translateService.instant('ACTIVITY_CREATE_ERROR'),
      });
    }
  }

  validateActivity() {
    return this.checkTime() && this.activityForm.valid && this.areParticipantsValid();
  }

  areParticipantsValid() {
    if (this.shareWithAll.value) {
      const invalidParticipants = [];
      if (this.extPartControl.value) {
        this.extPartControl.value.forEach(item => {
          if (!item.emailAddress) {
            invalidParticipants.push(item.name);
          }
        });
      }
      if (this.intPartControl.value) {
        this.intPartControl.value.forEach(item => {
          if (!item.emailAddress) {
            invalidParticipants.push(item.name);
          }
        });
      }
      if (invalidParticipants.length > 0) {
        this.alertsCard.push({
          type: 'danger',
          msg: `User(s)/Contact(s): ` + invalidParticipants.join(', ') + ` do not have email information.`,
        });
        return false;
      }
    }
    return true;
  }

  mapUser(user) {
    return {
      id: user.id,
      name: user.displayName,
      username: user.username,
      emailAddress: user.email,
    };
  }

  taskNumberClick() {
    this.dialogRef.close();
    this.router.navigate(['/pages/task/todo/' + this.selectedActivity.activityAttributes.task]);
  }

  getNewSelectedAccount(selectedAccount) {
    this.extPartControl.setValue([]);
    if (selectedAccount.value && selectedAccount.value.AccountCompanyId) {
      this.getExternalParticipants(selectedAccount.value).subscribe(r => {
        this.calendarExternalParticipants = r;
      });
    }
  }

  getExternalParticipants(selectedAccount): Observable<Response> {
    return forkJoin([
      this.calendarService.getCompanyContacts(selectedAccount.AccountCompanyId),
      this.calendarService.getAccountContacts(selectedAccount.AccountId),
    ]).pipe(map((r: any[]) => {
      const companyContacts = r[0];
      const accountContacts = r[1];
      const contacts = companyContacts.filter(cc => accountContacts.find(i => i.companyContactId === cc.id));
      return contacts.map(contact => this.mapContact(contact));
    }));
  }

  mapContact(contact) {
    let formattedEmail = null;
    contact['emails'].filter(i => i.usageType.code === 'WORK').every(item => {
      if (item.email) {
        formattedEmail = item.email.emailAddress;
        return true;
      }
    });
    return {
      id: contact.id,
      name: (this.titleCase.transform(contact.firstName) + ' ' + this.titleCase.transform(contact.lastName)),
      emailAddress: formattedEmail,
    };
  }

  deleteActivityModal() {
    this.deleteModal.dialogModalMessage = this.translateService.instant('DELETE_ACTIVITY_DIALOG_MESSAGE');
    this.deleteModal.openYesButton = true;
    this.dialogRef.close();
    this.deleteModal.openModal();
  }

  deleteActivity(e) {
    if (e === 'canRun') {
      this.onDeleteCalendarEvent.emit({ selectedActivity: this.selectedActivity });
    }
  }

  getAllUserAccounts() {
    this.calendarService.getUserAccounts(this.userInformation.username).subscribe(result => {
      this.userAccounts = result;
    });
  }
  getInternalParticipantsList() {
    this.calendarService.getInternalParticipants().subscribe(result => {
      this.calendarInternalParticipants = result;
      this.calendarInternalParticipants = this.calendarInternalParticipants.map(i => this.mapUser(i));
    });
  }

  saveNote() {
    this.buttonClicked = true;
    if (this.noteForm.valid) {
      this.calendarService.saveNote(this.noteForm.value).subscribe((note: any) => {
        const savedNote = JSON.parse(JSON.stringify(note));
        const activityNotes = JSON.parse(JSON.stringify(this.selectedActivity.notes)) || [];
        const index = activityNotes.findIndex(n => n.noteId === note.id);
        let toastMsg;

        savedNote.noteId = note.id;
        if (index !== -1) {
          savedNote.id = activityNotes[index].id;
          activityNotes[index] = savedNote;
          toastMsg = TOAST_MSG.updated;
        } else {
          savedNote.id = undefined;
          savedNote.createDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') + ' Europe/Istanbul';
          activityNotes.push(savedNote);
          toastMsg = TOAST_MSG.saved;
        }
        this.updateActivityNotes(activityNotes, toastMsg);
      });
    }
  }

  updateActivityNotes(activityNotes, toastMsg) {
    this.calendarService.updateNotes(this.selectedActivity.id, activityNotes).subscribe(r => {
      this.showToast(toastMsg);
      this.resetNote();
      this.selectedActivity.notes = r;
      this.selectedActivity.notes = this.selectedActivity.notes.sort((a, b) =>
        this.getDate(b.createDate).getTime() - this.getDate(a.createDate).getTime());
    });
  }

  showToast(message) {
    this.toastRef = this.toastrService.show(this.translateService.instant(message),
    this.translateService.instant('ALERT'),
      { status: 'success', duration: 3000 });
  }

  confirmNoteDelete() {
    this.noteDeleteDialogRef = this.dialogService.open(this.noteDeleteDialog, {'autoFocus': false});
  }

  deleteNote() {
    this.noteDeleteDialogRef.close();
    const activityNotes = JSON.parse(JSON.stringify(this.selectedActivity.notes)) || [];
    const index = activityNotes.findIndex(note => note.noteId === this.noteForm.get('id').value);
    if (index !== -1) {
      activityNotes.splice(index, 1);
      this.updateActivityNotes(activityNotes, TOAST_MSG.deleted);
    }
  }

  resetNote() {
    this.dd.resetValues();
    this.noteForm.reset();
    this.buttonClicked = false;
  }

  editNote(e: Event, note) {
    e.stopPropagation();
    this.calendarService.getNote(note.noteId).subscribe((n: any) => {
      this.noteForm.patchValue(n);
      this.noteForm.get('type').setValue(this.noteTypes.find(t => t.code === n['type']['code']));
    });
  }

  getDate(date): Date {
    const parts = date.split(' ');
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');
    return new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1]);
  }
}
