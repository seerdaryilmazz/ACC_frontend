import { Component, TemplateRef, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CustomerService } from '../customer.service';
import { Contact, PhoneNumber, Email } from './contact.model';

import { SelectedOrdersComponent } from '../../../shared/components/selected-orders/selected-orders.component';
import { ParameterService } from '../../../services/parameter.service';
import { ComponentEmailValidator } from '../../../shared/validators/component-email.validator';
import { TranslateService } from '../../../shared/translate/translate.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CalendarService } from '../../calendar/calendar.service';
import { UtilsService } from '../../../services/utils.service';
import { CustomRendererComponent } from '../../../shared/components/custom-renderer/custom-renderer.component';
import { CalendarEventComponent } from '../../../shared/components/calendar-event/calendar-event.component';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { TaskService } from '../../task/task.service';
import { PwGraphComponent } from './pw-graph/pw-graph.component';

@Component({
  selector: 'customer-detail-page',
  styleUrls: ['./customer-detail-page.component.scss'],
  templateUrl: './customer-detail-page.component.html',
})
export class CustomerDetailPageComponent implements OnInit {
  @Input('showDetail') showDetail = true;
  @Output() showDetailOutput = new EventEmitter();
  @ViewChild(SelectedOrdersComponent, { static: false }) selectedOrders: SelectedOrdersComponent;
  @ViewChild(PwGraphComponent, { static: false }) pwGraphComponent: PwGraphComponent;
  @ViewChild('calendarEventComp', {static: false}) calendarEventComp: CalendarEventComponent;
  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;
  @ViewChild('calendarInformation', { static: false }) calendarInformation: DialogComponent;
  @ViewChild('calendarDialog', { static: false }) calendarDialog: TemplateRef<any>;
  public alerts: any = [];
  public alertsCard: any = [];
  selectedContactId;
  public selectedEventId: string;
  methodType;
  userModel;
  userInformation;
  secureUrl;
  docType;
  financialInformationList;
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
  addNumber;
  buttonClicked = false;
  addEmail;
  businessSegmentTypes = [];
  userList = [];
  contactDepartments = [];
  contactTitles = [];
  phoneTypes = [];
  usageTypes = [];
  accounts;
  companyInfo;
  companyLocationInfo;
  companyContacts;
  agreements;
  selectedAgreement;
  opportunities;
  selectedOpportunity;
  relatedQuotes;
  dateRangeList = [];
  dateRangeValue = 30;
  dialogRef: any;
  contact = new Contact();
  phoneNumber = new PhoneNumber();
  email = new Email();
  selectedCompanyId;
  selectedLocationId;
  phoneEditClicked = false;
  mailEditClicked = false;
  editedPhoneIndex = -100;
  editedMailIndex = -100;
  useremail;
  genderList = [{ id: 'MALE', code: 'MALE', name: 'MALE' }, { id: 'FEMALE', code: 'FEMALE', name: 'FEMALE' }];
  showEmailError = false;
  showPhoneError = false;
  isCustomerEdit = true;
  public eventForm: FormGroup;
  nameControl: AbstractControl;
  surnameControl: AbstractControl;
  genderControl: AbstractControl;
  selectedAccount;
  relatedTask;
  customRendererComponent = CustomRendererComponent;

  allVisits;
  futureVisits;
  pastVisits;
  userName = '';
  mappedId;


  constructor(private dialogService: NbDialogService, private customerService: CustomerService, private parameterService: ParameterService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private taskService: TaskService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private calendarService: CalendarService,
    private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.businessSegmentTypes = this.parameterService.getParameter('BusinessSegmentTypes');
    this.userList = this.parameterService.getParameter('UserList');
    this.contactDepartments = this.parameterService.getParameter('ContactDepartments');
    this.contactTitles = this.parameterService.getParameter('ContactTitles');
    this.phoneTypes = this.parameterService.getParameter('PhoneTypes');
    this.usageTypes = this.parameterService.getParameter('UsageTypes');
    this.dateRangeList  = this.utilsService.getDateRangeList();
    this.email.usageType = this.usageTypes[1];
    this.phoneNumber.usageType = this.usageTypes[1];
    this.phoneNumber.numberType = this.phoneTypes[2];
    this.initializeContactForm();
    const userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.userName = userInfo.Username;
    this.useremail = userInfo.UserEmail;
    if (localStorage.getItem('selectedUserInfo')) {
      this.userInformation = JSON.parse(localStorage.getItem('selectedUserInfo'));
    }
  }

  backToList() {
    this.showDetailOutput.emit(false);
  }

  initializeContactForm() {
    this.eventForm = this.fb.group({
      'genderControl': new FormControl('',  [Validators.required]),
      'nameControl': new FormControl('', [Validators.required]),
      'surnameControl': new FormControl('', Validators.required),
        });
    this.nameControl = this.eventForm.controls['nameControl'];
    this.surnameControl = this.eventForm.controls['surnameControl'];
    this.genderControl = this.eventForm.controls['genderControl'];

  }

  getCompanyAndLocationInfo(companyId, locationId?) {
    this.selectedCompanyId = companyId;
    this.selectedLocationId = locationId;
    this.customerService.getCompanyLocationById(companyId, locationId).subscribe(result => {
      this.companyInfo = result;
      this.showDetail = true;
      this.companyContacts = result['CompanyContacts'];
      this.companyContacts.forEach(element => {
        if (element.department == null) {
          element.department = new Object();
        }
        if (element.title == null) {
          element.title = new Object();
        }
      });
      this.companyLocationInfo = result['CompanyLocation'];
      if (result['CompanyLocation']['mappedIds'].length > 0) {
        this.mappedId = result['CompanyLocation']['mappedIds'][0]['applicationLocationId'];
        // this.getCompanyFinancialInformation(this.useremail,this.companyId)
      }
    });
  }

  getCompanyInfo(companyId) {
    this.selectedCompanyId = companyId;
    this.companyLocationInfo = undefined;
    this.customerService.getCompanyById(companyId).subscribe(result => {
      this.companyInfo = result;
      this.showDetail = true;
      this.companyContacts = result['CompanyContacts'];
      const defaultLocation = this.companyInfo.Company.companyLocations.find(i => i.default);
      if (defaultLocation && defaultLocation.mappedIds.length > 0 ) {
        this.mappedId = defaultLocation.mappedIds[0].applicationLocationId;
      }
    });
  }

  getCompanyFinancialInformation(useremail, companyId) {
    this.financialInformationList = [];
    this.customerService.getCustomerFinancialInformation(useremail, companyId).subscribe(result => {
      this.financialInformationList = result;
      this.financialInformationList.forEach(fI => {
        fI.DEBIT_TOTAL =  this.formatMoney(fI.DEBIT_TOTAL);
        fI.DUE_EXPIRED_AMOUNT =  this.formatMoney(fI.DUE_EXPIRED_AMOUNT);
        fI.DUE_WAITING_AMOUNT =  this.formatMoney(fI.DUE_WAITING_AMOUNT);

      });
    });
  }

  getAgreements() {
    this.selectedAgreement = undefined;
    const payload = {
      accountId: this.selectedAccount.AccountId,
      page: 0,
      size: 10,
    };
    this.customerService.getAgreementsByAccountId(payload).subscribe(a => {
      this.agreements = a;
      this.agreements = this.agreements.sort((a, b) => {
        return this.getDate(a['endDate']).getTime() - this.getDate(b['endDate']).getTime();
      });
    });
  }

  getDate(date): Date {
    const parts = date.split(' ');
    const dateParts = parts[0].split('/');
    if (parts[1]) {
      const timeParts = parts[1].split(':');
      return new Date(dateParts[2], dateParts[1], dateParts[1], timeParts[1], timeParts[0]);
    }
    return new Date(dateParts[2], dateParts[1], dateParts[0]);
  }

  getOpportunities() {
    this.selectedOpportunity = undefined;
    const maxCreatedAt = new Date();
    const minCreatedAt = new Date();
    minCreatedAt.setDate(minCreatedAt.getDate() - this.dateRangeValue);
    const payload = {
      page: 0,
      size: 100,
      matchFilters: [
        {name: 'Account', val: this.selectedAccount.AccountId},
        {name: 'Status Code', val: 'CANCELED', not: true},
        {name: 'minCreateDate', val: this.datePipe.transform(minCreatedAt, 'dd/MM/yyyy')},
        {name: 'maxCreateDate', val: this.datePipe.transform(maxCreatedAt, 'dd/MM/yyyy')},
      ],
    };
    if (this.companyLocationInfo) {
      payload.matchFilters.push({name: 'Account Location', val: this.companyLocationInfo.id});
    }

    this.customerService.getOpportunitiesByQuery(payload).subscribe(o => {
      this.opportunities = o;
      this.opportunities = this.opportunities.sort((a, b) => {
        return this.getDate(a['createdAt']).getTime() - this.getDate(b['createdAt']).getTime();
      });
    });
  }

  getOpportunityDetail(e) {
    this.customerService.getOpportunityById(e.data.id).subscribe(o => {
      this.selectedOpportunity = o;
    });
  }

  getOpportunityRelatedQuotes(e) {
    if (e && this.selectedOpportunity) {
      const payload = {
        page: 0,
        quoteAttributeKey: 'opportunity',
        quoteAttributeValue: this.selectedOpportunity.id,
      };
      this.customerService.getQuotesByQuery(payload).subscribe(q => {
        this.relatedQuotes = q;
        this.relatedQuotes = this.relatedQuotes.sort((a, b) => {
          const A = a['createdAt'].substring(0, 10).split('/');
          const B = b['createdAt'].substring(0, 10).split('/');
          return new Date(A[0], A[1], A[2]).getTime() - new Date(B[0], B[1], B[2]).getTime();
        });
      });
    }
  }

  routeToCrm() {
    window.open(environment.oneorderUrl + 'ui/crm/opportunity/new?account=' + this.selectedAccount.AccountId);
  }

  getCurrencySign(currency) {
    if (currency === 'EUR')
      return '€';
    else if (currency === 'USD') {
      return '$';
    } else {
      return '₺';
    }
  }

  showAddContactModal() {
    this.isCustomerEdit = false;
    this.contact = new Contact();
    this.addEmail = false;
    this.addNumber = false;
    this.phoneNumber = new PhoneNumber();
    this.email = new Email();
    this.contact.companyLocation = this.companyLocationInfo;
    this.contact.company = this.companyInfo['Company'];
    this.dialogRef =  this.dialogService.open(this.dialog, { context: '' });
  }

  getLastVisitToCompany(userName, accountId) {
    this.pastVisits = [];
    this.futureVisits = [];
    this.customerService.getUserCalendar(userName, accountId).subscribe(result => {
      if (result) {
        this.allVisits = result;
        const now = new Date();
        this.allVisits.forEach(visit => {
          if (visit.calendar) {
            const visitDate = visit.calendar.startDate;
            const datePart = visitDate.split(' ')[0];
            const day = datePart.split('/')[0];
            const mount = datePart.split('/')[1];
            const year = datePart.split('/')[2];
            const visitTimeSpan = new Date(year + '-' + mount + '-' + day + 'T' + visitDate.split(' ')[1] + ':00').getTime();

            let externalParticipants = '';
            if (visit.calendar.externalParticipants) {
              for (let i = 0; i < visit.calendar.externalParticipants.length; i++) {
                externalParticipants += visit.calendar.externalParticipants[i].name;
                if (i !== visit.calendar.externalParticipants.length - 1) {
                  externalParticipants += ', ';
                }
              }
            }

            let internalParticipants = '';
            if (visit.calendar.internalParticipants) {
              for (let i = 0; i < visit.calendar.internalParticipants.length; i++) {
                internalParticipants += visit.calendar.internalParticipants[i].name;
                if (i !== visit.calendar.internalParticipants.length - 1) {
                  internalParticipants += ', ';
                }
              }
            }

            const tempVisit = {
              Date: this.datePipe.transform(year + '-' + mount + '-' + day, 'dd.MM.yyyy'),
              Location: visit.calendar.location,
              InternalParticipants: internalParticipants,
              ExternalParticipants: externalParticipants,
              Subject: visit.calendar.subject,
              Content : visit.calendar.content,
              Visit : visit,
            };
            if (now.getTime() >= visitTimeSpan) {
              this.pastVisits.push(tempVisit);
            } else {
              this.futureVisits.push(tempVisit);
            }
          }
        });
      }
    });
  }

  addEmailtoList() {
    if (this.mailEditClicked === false) {
      if (ComponentEmailValidator.validate(this.email.email.emailAddress)) {
        this.contact.emails.push(this.email);
        this.email = new Email();
        this.showEmailError = false;
        this.addEmail = false;

      } else {
        this.showEmailError = true;
      }
    } else {
      if (this.editedMailIndex > -1) {
        this.contact.emails[this.editedMailIndex] = this.email;
        this.email = new Email();
        this.showEmailError = false;
        this.mailEditClicked = false;
        this.addEmail = false;
      }
    }

  }

  deleteEmailFromList(email) {
    const index = this.contact.emails.indexOf(email);
    if (index > -1) {
      this.contact.emails.splice(index, 1);
    }
  }

  addPhoneNumberToList() {
    if (this.phoneEditClicked === false) {
      if (this.phoneNumber.phoneNumber.regionCode != null && this.phoneNumber.phoneNumber.countryCode != null
         && this.phoneNumber.phoneNumber.phone != null) {
        this.contact.phoneNumbers.push(this.phoneNumber);
        this.phoneNumber = new PhoneNumber();
        this.showPhoneError = false;
        this.addNumber = false;

      } else {
        this.showPhoneError = true;
      }
    } else {
      if (this.editedPhoneIndex > -1) {
        this.contact.phoneNumbers[this.editedPhoneIndex] = this.phoneNumber;
        this.phoneNumber = new PhoneNumber();
        this.showPhoneError = false;
        this.addNumber = false;
        this.phoneEditClicked = false;
      }
    }

  }

  deletePhoneNumberFromList(phoneNumber) {
    const index = this.contact.phoneNumbers.indexOf(phoneNumber);
    if (index > -1) {
      this.contact.phoneNumbers.splice(index, 1);
    }
  }

  editPhoneNumberFromList(phoneNumber) {
    this.phoneEditClicked = true;
    this.phoneNumber.default = phoneNumber.default;
    this.phoneNumber.numberType = this.phoneTypes.find(x => x.id === phoneNumber.numberType.id);
    this.phoneNumber.usageType = this.usageTypes.find(x => x.id === phoneNumber.usageType.id);

    this.phoneNumber.phoneNumber.countryCode = phoneNumber.phoneNumber.countryCode;
    this.phoneNumber.phoneNumber.phone = phoneNumber.phoneNumber.phone;
    this.phoneNumber.phoneNumber.regionCode = phoneNumber.phoneNumber.regionCode;
    this.addNumber = true;

    this.editedPhoneIndex = this.contact.phoneNumbers.indexOf(phoneNumber);
  }

  editMailFromList(mail) {
    this.mailEditClicked = true;
    this.email.default = mail.default;
    this.email.email.emailAddress = mail.email.emailAddress;

    this.email.usageType = this.usageTypes.find(x => x.id === mail.usageType.id);
    this.addEmail = true;
    this.editedMailIndex = this.contact.emails.indexOf(mail);
  }

  closeModal() {
    this.buttonClicked = false;
    this.dialogRef.close();
  }

  saveContact() {
    this.buttonClicked = true;
    if (this.contact.companyServiceTypes.length > 0 && this.contact.firstName != null && this.contact.lastName != null
      && this.contact.gender.code != null && this.contact.title.code != null && this.contact.title.code !== 0) {
      this.contact.gender = this.genderList.find(x => x.code === this.contact.gender.code);
      this.contact.department = this.contactDepartments.find(x => x.code === this.contact.department.code) || new Object();
      this.contact.title = this.contactTitles.find(x => x.code === this.contact.title.code) || new Object();
      if (this.contact['id']) {
        this.contact['fullname'] = undefined;
        this.customerService.editContact(this.contact).subscribe(() => {
          this.dialogRef.close();
          this.informationModal.dialogModalMessage = this.translateService.instant('EDIT_CONTACT_SUCCESS_MESSAGE');
          this.informationModal.openModal();
          this.getCompanyAndLocationInfo(this.selectedCompanyId, this.selectedLocationId);
        },
        () => {
          this.informationModal.dialogModalMessage = this.translateService.instant('EDIT_CONTACT_ERROR_MESSAGE');
          this.informationModal.openModal();
        });
      } else {
        this.customerService.saveContact(this.contact).subscribe(() => {
          this.dialogRef.close();
          this.informationModal.dialogModalMessage = this.translateService.instant('CREATE_CONTACT_SUCCESS_MESSAGE');
          this.informationModal.openYesButton = false;
          this.informationModal.openModal();
          this.getCompanyAndLocationInfo(this.selectedCompanyId, this.selectedLocationId);
        },
        () => {
          this.informationModal.dialogModalMessage = this.translateService.instant('CREATE_CONTACT_ERROR_MESSAGE');
          this.informationModal.openModal();
        });
      }
    }
  }

  deleteContactOpenModal(contactId) {
    this.selectedContactId = contactId;
    this.methodType = 'delete';
    this.informationModal.dialogModalMessage = this.translateService.instant('DELETE_CONTACT_DIALOG_MESSAGE');
    this.informationModal.openYesButton = true;
    this.informationModal.openModal();
  }

  deleteContact(e) {
    if (e === 'canRun') {
      this.customerService.deleteContact(this.selectedContactId).subscribe(() => {
        this.dialogRef.close();
        this.informationModal.openYesButton = false;
        this.informationModal.dialogModalMessage = this.translateService.instant('DELETE_CONTACT_SUCCESS_MESSAGE');
        this.informationModal.openModal();
        this.getCompanyAndLocationInfo(this.selectedCompanyId, this.selectedLocationId);
      });
    }
  }
  showEditDialog(contact) {
    this.isCustomerEdit = true;
    this.contact = contact;
    this.addEmail = false;
    this.addNumber = false;
    this.phoneNumber = new PhoneNumber();
    this.email = new Email();
    this.contact.company = this.companyInfo['Company'];
    this.dialogRef =  this.dialogService.open(this.dialog, { context: '' });
  }

  onChangeTab(event) {
    if (event.tabTitle === this.translateService.instant('ORDERS_UPPERCASE')) {
      this.selectedOrders.changeOrdersType(this.selectedOrders.selectedOrderType);
    } else if (event.tabTitle === this.translateService.instant('FINANCE')) {
      this.getCompanyFinancialInformation(this.useremail, this.mappedId);
    } else if (event.tabTitle === this.translateService.instant('VISITS_UPPERCASE')) {
      this.getLastVisitToCompany(this.userName, this.selectedAccount.AccountId);
    } else if (event.tabTitle === this.translateService.instant('AGREEMENTS')) {
      this.getAgreements();
    } else if (event.tabTitle === this.translateService.instant('OPPORTUNITIES')) {
      this.getOpportunities();
    } else if (event.tabTitle === this.translateService.instant('PW_GRAPH')) {
      this.pwGraphComponent.getOrders();
    }
  }

  onVisitClick(e) {
    if (e.data.Visit.id) {
      const id = e.data.Visit.id;
      this.calendarEventComp.onActivityClicked(id);
    }
  }

  renderServiceAreas = (serviceAreas) => {
    return serviceAreas.map(i => this.translateService.instant(i.name)).join(', ');
  }

  renderStartEndDate = (cell, row) => {
    return row['startDate'] + ' - ' + row['endDate'];
  }

  renderTurnover = (cell) => {
    return cell ? this.currencyPipe.transform(cell.amount, cell.currency.code) : null;
  }

  downloadDocument(e, document) {
    if (e) {
      this.customerService.downloadFile(document.documentId).subscribe((r: Blob) => {
        this.docType = r['type'];
        const blob = new Blob([r], {type: r['type']});
        const fileUrl = URL.createObjectURL(blob);
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
      });
    }
  }

  renderCreateDate = (cell, row) => {
    return cell.substring(0, 10);
  }

  updateCalendarEvent(e) {
    const {requestObject, selectedEvent} = e;
    if (selectedEvent && selectedEvent.activityAttributes && selectedEvent.activityAttributes.task) {
      this.taskService.getTodoTaskByNumber(selectedEvent.activityAttributes.task).subscribe(t => {
        this.relatedTask = t;
        if (this.relatedTask && ['OPEN', 'POSTPONED'].includes(this.relatedTask.TaskStatus)) {
          this.calendarInformation.dialogModalMessage = this.translateService.instant('COMPLETE_RELATED_TASK?', [this.relatedTask.TaskNumber]);
          this.calendarInformation.buttons = [
            {label: 'UPDATE_TASK_TOO', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject, true), class: 'btn-green'},
            {label: 'ONLY_UPDATE_ACTIVITY', click: () => this.updateEventAndRelatedTask(selectedEvent, requestObject), class: 'btn-gray'},
          ];
          this.calendarEventComp.dialogRef.close();
          this.calendarInformation.openModal();
        } else {
          this.updateEventAndRelatedTask(selectedEvent, requestObject);
        }
      });
    } else {
      this.updateEventAndRelatedTask(selectedEvent, requestObject);
    }
  }

  updateEventAndRelatedTask(selectedEvent, requestObject, updateTask = false) {
    if (this.calendarInformation) {
      this.calendarInformation.closeDialog();
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
        this.getLastVisitToCompany(this.userName, this.selectedAccount.AccountId);
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_SUCCESS');
        this.informationModal.openModal();
      } else {
        this.informationModal.dialogModalMessage = this.translateService.instant('ACTIVITY_UPDATE_ERROR2');
        this.informationModal.openModal();
      }
    });
    this.calendarEventComp.dialogRef.close();
  }

  formatMoney(amount, decimalCount = 2, decimal = ',', thousands = '.') {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    const j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
     + (decimalCount ? decimal + Math.abs(amount - Number(i)).toFixed(decimalCount).slice(2) : '');
  }

  deleteActivity(e) {
    this.calendarService.updateActivityStatus(e.selectedActivity.toString(), 'CANCELED').subscribe(result => {
      this.calendarEventComp.deleteModal.closeModal();
      if (result && result['result_code'] === 200) {
        this.getLastVisitToCompany(this.userName, this.selectedAccount.AccountId);
        this.calendarInformation.openYesButton = false;
        this.calendarInformation.dialogModalMessage = this.translateService.instant('ACTIVITY_DELETE_SUCCESS');
        this.calendarInformation.openModal();
      } else {
        this.alerts = [];
        this.alerts.push({
          type: 'danger',
          msg: this.translateService.instant('DELETE_ACTIVITY_ERROR_MESSAGE'),
        });
      }
    }, err => {
        this.eventForm.clearValidators();
        this.calendarEventComp.deleteModal.closeModal();

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


