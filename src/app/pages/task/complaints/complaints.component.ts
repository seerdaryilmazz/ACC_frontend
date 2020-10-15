import { Component, TemplateRef, ViewChild, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '../../../shared/translate/translate.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../calendar/calendar.service';
import { TaskService } from '../task.service';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../../../services/utils.service';
import { runInThisContext } from 'vm';


@Component({
  selector: 'complaints',
  styleUrls: ['./complaints.component.scss'],
  templateUrl: './complaints.component.html',
})
export class ComplaintsComponent implements OnInit, OnDestroy {

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('dialog2', { static: false }) dialog2: TemplateRef<any>;


  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;

  getUserAccountsSubs: Subscription;
  getComplaintsSubs:Subscription;
  showDetail = false;
  isNewComplaint = true;
  buttonClicked = false;
  complaintForm: FormGroup;
  complaintTitleControl: AbstractControl;
  complaintCustomerControl: AbstractControl;
  complaintTypeControl: AbstractControl;
  complaintDescControl: AbstractControl;
  complaintDueDateControl: AbstractControl;
  delayedOrders;
  searchQuery:string = '';
  complaintDueDate = new Date();
  dialogRef: any;
  dialogRef2: any;
  complaintTitle: any;
  complaintType: any;
  complintDesc: any;
  complaintCustomerAccount: any;
  selectedComplaintType;
  complaintDescription: any;
  selectedComplaint;
  useremail;
  users: any;
  userId: any;
  todayDate = new Date();
  userMail: any;
  userAccounts: any;
  relatedComplaints: any;
  complaintSolvedDescription ="";
  userTypeConfig = {
    displayKey: 'displayName',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_USER'), 
    noResultsFound: this.translateService.instant('NO_USER_FOUND'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'displayName',
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
  complaintTypes = [
    {
      name: "DAMAGE"
    },
    {
      name: "MISSING"
    },
  {   
    name: "OTHER"
  }
  ];
  constructor(private dialogService: NbDialogService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private calendarService: CalendarService,
    private taskService: TaskService,
    private datePipe: DatePipe,
    private utils: UtilsService) {
  }

  ngOnInit() {

    var userInfo = this.utils.getUserInfoFromLocalStorage();
    this.userId = userInfo.Username;
    this.userMail = userInfo.UserEmail;

    this.getComplaints(); 

    this.users = JSON.parse(localStorage.getItem("Parameters")).UserList;

    this.initializeEventForm();

    this.getAllUserAccounts();
  }

  ngOnDestroy() {
    //this.getUserAccountsSubs.unsubscribe();
    //this.getComplaintsSubs.unsubscribe();
  }

  initializeEventForm() {
    this.complaintForm = this.fb.group({
      'complaintTitleControl': new FormControl('', [Validators.required]),
      'complaintCustomerControl': new FormControl('', [Validators.required]),
      'complaintTypeControl': new FormControl('', Validators.required),
      'complaintDescControl': new FormControl('', [Validators.required]),
      'complaintDueDateControl': new FormControl('', [Validators.required]),
    });
    this.complaintTitleControl = this.complaintForm.controls['complaintTitleControl'];
    this.complaintCustomerControl = this.complaintForm.controls['complaintCustomerControl'];
    this.complaintTypeControl = this.complaintForm.controls['complaintTypeControl'];
    this.complaintDescControl = this.complaintForm.controls['complaintDescControl'];
    this.complaintDueDateControl = this.complaintForm.controls['complaintDueDateControl'];
    this.cdRef.detectChanges();

  }

  clearAllValidations() {
    this.complaintForm.clearValidators();
  }
  newEventModalOpen() {
    this.isNewComplaint = true;
    this.initializeEventForm();
    this.complaintTitle = "";
    this.complaintCustomerAccount = null;
    this.selectedComplaintType = 0;
    this.complaintDueDate = new Date();
    this.complaintDescription = "";
    this.complaintTitleControl.markAsUntouched();
    this.complaintCustomerControl.markAsUntouched();
    this.complaintTypeControl.markAsUntouched();
    this.complaintDescControl.markAsUntouched();
    this.buttonClicked = false;
    this.complaintDueDateControl = this.complaintForm.controls['complaintDueDateControl'];
    this.dialogRef = this.dialogService.open(this.dialog);
  }

  userRowSelect(event) {
    if (event) {
      this.selectedComplaint = event.data;
      this.showDetail = true;
    }
  }

  onComplaintStatusChanged(event){
    this.selectedComplaint.ComplaintSolved = event;
    if(event){
      this.dialogRef2 = this.dialogService.open(this.dialog2);
    }
    else {
      this.selectedComplaint.ComplaintSolvedDescription ="";
      this.complaintSolvedDescription = "";
      this.taskService.editComplaint(this.selectedComplaint).subscribe(result => {
        this.informationModal.dialogModalMessage = this.translateService.instant('COMPLAINT_EDITED_SUCCESSFULLY');
        this.informationModal.openModal();
        this.getComplaints();
        this.showDetail = false;
      });
    }
  }

  close() {
    this.clearAllValidations();
    this.buttonClicked = false;
    this.cdRef.detectChanges();
    this.dialogRef.close();
  }

  saveComplaintSolved(){
    this.selectedComplaint.ComplaintSolvedDescription = this.complaintSolvedDescription;
    this.taskService.editComplaint(this.selectedComplaint).subscribe(result => {
      this.dialogRef2.close();
      this.selectedComplaint.ComplaintSolvedDescription ="";
      this.complaintSolvedDescription = "";
      this.informationModal.dialogModalMessage = this.translateService.instant('COMPLAINT_EDITED_SUCCESSFULLY');
      this.informationModal.openModal();
      this.getComplaints();
      this.showDetail = false;
    });
  }


saveComplaint() {
  this.buttonClicked = true;

  if (this.complaintForm.valid && this.selectedComplaintType != undefined && this.selectedComplaintType != 0 && this.complaintCustomerAccount != undefined) {
    var complaintModel: any = new Object();
    complaintModel.UserEmail = this.userMail;
    complaintModel.ComplaintSubject = this.complaintTitle;
    complaintModel.ComplaintCustomerAccountName = this.complaintCustomerAccount.AccountName;
    complaintModel.ComplaintCustomerAccountId = this.complaintCustomerAccount.AccountId;
    complaintModel.ComplaintCustomerAccountCompanyId = this.complaintCustomerAccount.AccountCompanyId;
    complaintModel.ComplaintType = this.selectedComplaintType;
    complaintModel.ComplaintDescription = this.complaintDescription;
    complaintModel.ComplaintDueDate = this.complaintDueDate;
  
   
    if(this.selectedComplaint){

      complaintModel._id = this.selectedComplaint._id;
      complaintModel.ComplaintSolved = this.selectedComplaint.ComplaintSolved;
      complaintModel.ComplaintSolvedDescription = this.selectedComplaint.ComplaintSolvedDescription;
    }
    else {
      complaintModel._id = undefined;
      complaintModel.ComplaintSolved = false;
      complaintModel.ComplaintSolvedDescription = "";
    }
    // var cDueDate;
    // cDueDate = this.datePipe.transform(this.complaintDueDate, "dd/MM/yyyy");

    if(!(complaintModel._id)){
      this.taskService.saveComplaint(complaintModel).subscribe(result=> {
        this.dialogRef.close();
        this.informationModal.dialogModalMessage = this.translateService.instant('COMPLAINT_CREATED_SUCCESSFULLY');
        this.informationModal.openModal();
        this.getComplaints();
      });
    }
    else {
      this.taskService.editComplaint(complaintModel).subscribe(result=> {
        this.dialogRef.close();
        this.informationModal.dialogModalMessage = this.translateService.instant('COMPLAINT_EDITED_SUCCESSFULLY');
        this.informationModal.openModal();
        this.getComplaints();
        this.showDetail = false;
      });
    }
  
  }

  else {

  }

}
  getAllUserAccounts() {
    this.getUserAccountsSubs = this.calendarService.getUserAccounts(this.userId).subscribe(result => {
      this.userAccounts = result;
    });
  }


  onSearch(query=''){
    this.searchQuery = query
  }

  getComplaints() {
    this.selectedComplaint = undefined;
    this.getComplaintsSubs = this.taskService.getComplaint(this.userMail).subscribe(result => {
      this.relatedComplaints = result; 
      this.relatedComplaints = this.relatedComplaints.sort((a: any, b: any) => {
        return new Date(a.complaintDueDate).getTime() - new Date(b.complaintDueDate).getTime();
      }
      );
      this.relatedComplaints.forEach(element => {
        element.Priority = this.utils.calculatePriority(element.complaintDueDate);
        element.FormattedComplaintDueDate = this.datePipe.transform(element.ComplaintDueDate ,"dd.MM.yyyy");
        element.TranslatedComplaintType = this.translateService.instant(element.ComplaintType.toUpperCase());
      });
    });
  }

  showEditDialog(selectedComplaint){
    this.isNewComplaint = false;
    this.dialogRef = this.dialogService.open(this.dialog);
    this.complaintTitle = selectedComplaint.ComplaintSubject;
    this.complaintCustomerAccount = this.userAccounts.find(x=> x.AccountCompanyId == selectedComplaint.ComplaintCustomerAccountCompanyId);
    this.selectedComplaintType = selectedComplaint.ComplaintType;
    this.complaintDescription = selectedComplaint.ComplaintDescription;
    this.complaintDueDate = new Date(selectedComplaint.ComplaintDueDate);
  }
}




