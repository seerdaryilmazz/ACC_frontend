import { Component, TemplateRef, ViewChild, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../customer.service';
import { CustomerDetailPageComponent } from '../customer-detail/customer-detail-page.component';
import { UtilsService } from '../../../services/utils.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'ngx-customers-page',
  styleUrls: ['./customers-page.component.scss'],
  templateUrl: './customers-page.component.html',
  animations: [
    trigger(
      'slideAnimation',
      [
        transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateY(-50%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'})),
        ]),
        // transition(':leave', [  // :leave is alias to '* => void'
        //   animate('200ms ease-in', style({transform: 'translateY(-50%)'})),
        // ]),
      ],
    ),
  ],
})
export class CustomersPageComponent implements OnInit, AfterViewChecked {

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('searchInput', {static: false}) input: ElementRef;
  @ViewChild(CustomerDetailPageComponent,{ static: true }) customerDetailPageComponent: CustomerDetailPageComponent;

  showDetail = false;
  table1 = false;
  table2 = false;
  table3 = false;
  accounts = [];
  companyInfo;
  showCompanyLocations = false;
  companyLocations:any=[];
  showLocation =false;
  userName;
  currentPage = 1;
  totalCount = 0;
  checked = false;
  inputQuery = '';

  constructor(private dialogService: NbDialogService, private http: HttpClient, private service: CustomerService, private utilsService:UtilsService) {
  }

  ngOnInit() {
    var userInfo = this.utilsService.getUserInfoFromLocalStorage();
    this.userName = userInfo.Username;
    this.getAccountsByQuery(this.inputQuery);
  }

  ngAfterViewChecked() {
    if (this.input && !this.checked) {
      this.checked = true;
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          distinctUntilChanged(),
          filter(Boolean),
          debounceTime(200),
        ).subscribe((r) => {
          this.getAccountsByQuery(this.input.nativeElement.value);
        });
    }
  }

  getAccountsByQuery(input) {
    const query = {
      accountOwner: this.userName,
      pageSize: 10,
    };
    // input değişmiş mi?
    if (this.inputQuery !== input) {
      this.currentPage = 1;
      this.inputQuery = input;
    }
    query['page'] = this.currentPage - 1;
    query['name'] = this.inputQuery ? this.inputQuery : undefined;
    this.service.getAccountsByQuery(query).subscribe(result => {
      this.accounts = result['AccountList'];
      this.totalCount = result['TotalCount'];
    });
  }

  pageChange($event) {
    this.currentPage = $event;
    this.getAccountsByQuery(this.inputQuery);
  }

  getCompanyLocationsById(account) {
    this.customerDetailPageComponent.selectedAccount = account;
    if (this.companyLocations.find(x => x.company.id === account.AccountCompanyId)) {
      this.showLocation = !this.showLocation;
    } else {
      this.service.getCompanyLocationsById(account.AccountCompanyId).subscribe(result => {
        if (this.showLocation) {
          this.showLocation = !this.showLocation;
          this.showLocation = !this.showLocation;
        } else {
          this.showLocation = !this.showLocation;
        }
        this.companyLocations = result;
      });
    }
  }

  open() {
    this.dialogService.open(this.dialog, { context: 'this is some additional data passed to dialog' });
  }

  getCompanyLocationById(companyId,locationId){
    this.showDetail = true;
    this.customerDetailPageComponent.getCompanyAndLocationInfo(companyId,locationId);
    var accountId;
    this.accounts.forEach(account => {
      if(account.AccountCompanyId == companyId){
        accountId = account.AccountId
      }
    });
    //this.customerDetailPageComponent.getLastVisitToCompany(this.userName, accountId);
  }

  customerClick(account) {
    this.customerDetailPageComponent.selectedAccount = account;
    this.showDetail = true;
    this.customerDetailPageComponent.getCompanyInfo(account.AccountCompanyId);
  }
}
