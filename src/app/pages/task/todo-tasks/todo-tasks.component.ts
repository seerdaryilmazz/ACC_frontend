import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorComponent } from '@kolkov/angular-editor';
import { NbDialogService } from '@nebular/theme';
import { DateRangeType, IgxDatePickerComponent } from 'igniteui-angular';
import { DropdownTreeviewComponent, TreeviewItem } from 'ngx-treeview';
import { ParameterService } from '../../../services/parameter.service';
import { UtilsService } from '../../../services/utils.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { TranslateService } from '../../../shared/translate/translate.service';
import { CalendarService } from '../../calendar/calendar.service';
import { TaskService } from '../task.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError, filter, debounceTime} from 'rxjs/operators';


const SPECIFIC_CUSTOMER_VISIT_DESC = 'Visit the {0} customer until {1} and enter the visit note after the visit.';
const SALES_LEAD_REDIRECTING_DESC = '{0} customer is assigned to you. Call the customer until {1}';
@Component({
  selector: 'ngx-todos',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss'],
})
export class TodoTasksComponent implements OnInit {
  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('datePicker', { static: false }) public datePicker: IgxDatePickerComponent;
  @ViewChild('informationModal', { static: false }) informationModal: DialogComponent;
  @ViewChild('ddtree', { static: false }) ddtree: DropdownTreeviewComponent;
  @ViewChild('editor', { static: false }) editor: AngularEditorComponent;

  accountsLoading = false;
  accountInput = new Subject<string>();
  accountOwners;
  buttonClicked = false;
  dialogRef: any;
  dialogRef2: any;
  selectedTask;
  endDateFilter: Date;
  startDateFilter: Date;
  statusFilter;
  subjectFilter;
  selectedUserInfo: any;
  taskUserAccountOptions: any;
  taskUserOptions: any;
  userHierarchy;
  taskSubjectOptions = [];
  taskStatuses = [];

  todoTaskForm: FormGroup;
  TaskCustomerAccount: AbstractControl;
  TaskSubject: AbstractControl;
  TaskCreatedBy: AbstractControl;
  TaskCreatedAt: AbstractControl;
  TaskOwners: AbstractControl;
  TaskDescription: AbstractControl;
  TaskDeadline: AbstractControl;

  todoTasks: any;
  searchQuery: string = '';
  statusesFilterConfig = {
    search: false,
    translate: true,
    placeholder: 'STATUS',
    moreText: this.translateService.instant('more'),
  };
  usersAccountsConfig = {
    displayKey: 'AccountName',
    search: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_CUSTOMER'),
    noResultsFound: this.translateService.instant('NO_RESULT'),
    searchPlaceholder: this.translateService.instant('SEARCH'),
    searchOnKey: 'AccountName',
    // limitTo: 5
  };
  subjectsConfig = {
    translate: true,
    moreText: this.translateService.instant('more'),
    placeholder: this.translateService.instant('SELECT_SUBJECT'),
    noResultsFound: this.translateService.instant('NO_RESULT'),
    // limitTo: 5
  };
  subjectsFilterConfig = {
    search: false,
    translate: true,
    placeholder: 'SUBJECT',
    moreText: this.translateService.instant('more'),
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
  usersConfig = {
    displayKey: 'desc',
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 500,
    searchOnKey: 'desc',
  };
  constructor(private dialogService: NbDialogService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public taskService: TaskService,
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    public router: Router,
    private parameterService: ParameterService,
    private calendarService: CalendarService,
    private utilsService: UtilsService) {
  }

  ngOnInit() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    this.startDateFilter = startDate;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    this.endDateFilter = endDate;
    this.taskService.getTaskSubjects().subscribe((r: any) => this.taskSubjectOptions = r);
    this.taskService.getTaskStatuses().subscribe((r: any) => this.taskStatuses = r);
    this.statusFilter = ['OPEN', 'POSTPONED'];
    this.selectedUserInfo = JSON.parse(localStorage.getItem('selectedUserInfo'));
    this.dashboardService.getUserInformation(false).subscribe(r => {
      this.userHierarchy = r;
      this.initUserAccountsAndHierarchy(true);
    });
    this.getTodoTasks();
  }

  initUserAccountsAndHierarchy(initialize = false) {
    const users = [];
    users.push(this.userHierarchy.user);
    if (this.userHierarchy.teams.length > 0) {
      this.userHierarchy.teams.forEach(team => team.users.forEach(user => users.push(user)));
      this.initDdTreeUserOptions();
    } else {
      const options: TreeviewItem[] = [];
      options.push(new TreeviewItem({
        text: this.userHierarchy.user.displayName,
        value: this.userHierarchy.user,
        checked: true,
      }));
      this.taskUserOptions = options;
    }
    if (initialize) {
      this.accountOwners = this.utilsService.uniquifyArrayByField(users, 'username').map(user => user.username);
    }
  }

  initDdTreeUserOptions() {
    const options: TreeviewItem[] = [];
    const managerDisplay = this.translateService.instant('(MANAGER)');
    this.userHierarchy.teams.forEach(item => {
      if (item.users.length > 0) {
        let treeItem = new TreeviewItem({
          text: item.team.name,
          value: item.team,
          checked: false,
        });

        const members = item.users.filter(u => u.teams.some(t => t.name.id === item.team.externalId));
        let children = [];
        children.push({
          text: 'DENEME',
          value: 'DENEME',
          checked: false,
        });
        if (members.length > 0) {
          if (members.find(m => m.id === this.selectedUserInfo.id) == null) {
            members.push(this.selectedUserInfo);
          }
          members.forEach(member => {
            const isManager = member.teams.some(t => t.name.id === item.team.externalId && t.level.code === 'MANAGER');
            const child = {
              text: member.displayName + (isManager ? ` ${managerDisplay}` : ''),
              value: member,
              checked: false,
            };
            children.push(child);
          });
          children = this.sortItems(children);
          treeItem['children'] = children;
        }

        if (item.team.children) {
          item.team.children.forEach(ch => {
            treeItem = this.recursionChildTeams(item, ch, treeItem);
          });
        }
        if (treeItem.children.length > 1) {
          treeItem.children.splice(treeItem.children.findIndex(c => c.text === 'DENEME'), 1);
          options.push(new TreeviewItem(treeItem, true));
        }
      }
    });
    this.taskUserOptions = options;
  }

  sortItems(children) {
    // sort by manager then alphabetic order
    return children.sort((a, b) => {
      const A = a.text.includes('(M)') || a.text.includes('(Y)') ? 0 : 1;
      const B = b.text.includes('(M)') || b.text.includes('(Y)') ? 0 : 1;
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return (A !== B ? A - B : textA.localeCompare(textB));
    });
  }

  recursionChildTeams(item, childTeam, treeViewItem: TreeviewItem) {
    const managerDisplay = this.translateService.instant('(MANAGER)');
    const members = item.users.filter(u => u.teams.some(t => t.name.id === childTeam.externalId));
    let teamUsers = [];
    // treeview comp yapısı gereği bir TreeViewItem'ın children field'ına boş array assign edilemiyor.
    // o yüzden manuel olarak burda eklenip en sonda takımın boş olma durumuna göre çıkarılacaktır.
    teamUsers.push({
      text: 'DENEME',
      value: 'DENEME',
      checked: false,
    });
    let subTeam = new TreeviewItem({
      text: childTeam.name,
      value: childTeam,
      checked: false,
    });

    if (treeViewItem['children'] == null) {
      treeViewItem['children'] = [subTeam];
    } else {
      treeViewItem['children'].push(subTeam);
    }
    members.forEach(member => {
      const isManager = member.teams.some(t => t.name.id === item.team.externalId && t.level.code === 'MANAGER');
      const child = {
        text: member.displayName + (isManager ? ` ${managerDisplay}` : ''),
        value: member,
        checked: false,
      };
      teamUsers.push(child);
    });
    teamUsers = this.sortItems(teamUsers);
    subTeam['children'] = teamUsers;
    if (childTeam.children) {
      childTeam.children.forEach(ch => {
        subTeam = this.recursionChildTeams(item, ch, subTeam);
      });
    }

    if (subTeam.children.length <= 1) {
      // sadece manuel eklediğimiz Deneme dışında başka child'ı olmayan treeviewitem silinir.
      treeViewItem.children.splice(treeViewItem.children.findIndex(c => c === subTeam), 1);
    } else {
      // manuel eklenen child burda çıkarılır.
      subTeam.children.splice(subTeam.children.findIndex(c => c.text === 'DENEME'), 1);
    }
    return treeViewItem;
  }

  initializeEventForm() {
    this.todoTaskForm = this.fb.group({
      TaskCustomerAccount: new FormControl(null, [Validators.required]),
      TaskSubject: new FormControl(null, [Validators.required]),
      TaskCreatedBy: new FormControl(null),
      TaskCreatedAt: new FormControl(null),
      TaskOwners: new FormControl([], [Validators.required]),
      TaskDescription: new FormControl(null, [Validators.required]),
      TaskDeadline: new FormControl(null, [Validators.required]),
    });

    // binds controls to local properties -> this.TaskCustomerAccount = this.todoForm.controls['TaskCustomerAccount']
    for (const key of Object.keys(this.todoTaskForm.controls)) {
      this[key] = this.todoTaskForm.controls[key];
    }

    this.todoTaskForm.clearValidators();
    this.initUserAccountsAndHierarchy();
    this.buttonClicked = false;

    this.loadAccounts();
  }

  loadAccounts() {
    this.taskUserAccountOptions = concat(
      of([]), // default items
      this.accountInput.pipe(
        distinctUntilChanged(),
        filter((input) => input != null && input.length > 2),
        debounceTime(100),
        tap(() => this.accountsLoading = true),
        switchMap(name => this.calendarService.getUserAccountsByQuery(
          {name, accountOwners: this.accountOwners, pageSize: 10000 }, false)
          .pipe(catchError(() => of([])), // empty list on error
            tap(() => this.accountsLoading = false))),
      ),
    );
  }

  newEventModalOpen() {
    this.initializeEventForm();
    this.TaskCreatedBy.setValue(this.selectedUserInfo);
    this.TaskDeadline.setValue(new Date());
    this.TaskCreatedAt.setValue(new Date());
    this.dialogRef = this.dialogService.open(this.dialog, {'autoFocus': false});
    this.cdRef.detectChanges();
    this.datePicker.disabledDates = [{ type: DateRangeType.Before, dateRange: [new Date()] }];
  }

  userRowSelect(event) {
    if (event) {
      this.selectedTask = event.data;
      this.router.navigate(['/pages/task/todo', event.data.TaskNumber]);
    }
  }

  onDeadlineChange() {
    this.setTaskDesc(true);
  }

  setTaskDesc(deadlineChanged?) {
    const condition = this.TaskCustomerAccount.value && this.TaskDeadline.value;
    if (condition && this.TaskSubject.value === 'SPECIFIC_CUSTOMER_VISIT') {
      const desc = this.translateService.instant(SPECIFIC_CUSTOMER_VISIT_DESC,
          [this.TaskCustomerAccount.value.AccountName, this.datePipe.transform(this.TaskDeadline.value, 'dd.MM.yyyy')]);
      this.TaskDescription.setValue(desc);
    } else if (condition && this.TaskSubject.value === 'SALES_LEAD_REDIRECTING') {
      const desc = this.translateService.instant(SALES_LEAD_REDIRECTING_DESC,
        [this.TaskCustomerAccount.value.AccountName, this.datePipe.transform(this.TaskDeadline.value, 'dd.MM.yyyy')]);
      this.TaskDescription.setValue(desc);
    } else {
      if (!deadlineChanged) {
        this.TaskDescription.setValue('');
      }
    }
  }

  onSubjectChange(event) {
    if (event) {
      this.setTaskDesc();
      if (event === 'LANE_SPECIFIC_CUSTOMER_VISIT') {
        this.TaskCustomerAccount.clearValidators();
      } else {
        if (this.TaskCustomerAccount.validator == null) {
          this.TaskCustomerAccount.setValidators([Validators.required]);
        }
        if (event === 'SALES_LEAD_REDIRECTING') {
          const date = new Date();
          let count = 0;
          while (count < 2) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0 && date.getDay() !== 6) {
              count++;
            }
          }
          this.TaskDeadline.setValue(date);
        }
      }
      this.TaskCustomerAccount.updateValueAndValidity();
    } else {
      this.TaskCustomerAccount.setValidators([Validators.required]);
    }
  }

  onUsersChange(event) {
    this.TaskOwners.setValue(event);
  }

  onAccountChange(event) {
    if (event) {
      this.setTaskDesc();
      const accOwner = event.AccountOwner;
      if (this.selectedUserInfo.username === accOwner) {
        // Reset all checks and set TaskOwner as selectedUser
        this.taskUserOptions.forEach(opt => {
          if (opt.children && opt.children.length > 0) {
            const recursion = (i) => {
              i.children.forEach(child => {
                if (child.children) {
                  recursion(child);
                }
                child.value.username === accOwner ? child.checked = true : child.checked = false;
              });
            };
            recursion(opt);

          } else {
            opt.checked = true;
            opt.disabled = false;
            opt.collapsed = false;
          }
        });
      } else {
        this.taskUserOptions.forEach(opt => {
          const recursion = (i) => {
            const isAccOwnerExistInTeam = i.children.some(item => {
              return item.value.username === accOwner;
            });
            if (isAccOwnerExistInTeam) {
              i.children.forEach(child => {
                child.value.username === accOwner ? child.checked = true : child.checked = false;
                if (child.children) {
                  recursion(child);
                }
              });
              i.checked = false;
            } else {
              i.children.forEach(child => {
                child.checked = false;
                if (child.children) {
                  recursion(child);
                }
              });
              i.checked = false;
            }
          };
          recursion(opt);
        });
      }
      this.ddtree.treeviewComponent.raiseSelectedChange();
    }
  }

  dateFilterChange(e) {
    this.startDateFilter = e['firstDate'];
    this.endDateFilter = e['secondDate'];
    this.getTodoTasks();
  }

  saveTodo() {
    this.buttonClicked = true;
    if (this.todoTaskForm.valid) {
      const todoModel: any = new Object();
      todoModel.TaskSubject = this.TaskSubject.value;
      todoModel.TaskCreatedAt = new Date().toISOString();
      todoModel.TaskStatus = 'OPEN';
      todoModel.TaskCreatedBy = {
        displayName: this.TaskCreatedBy.value.displayName,
        username: this.TaskCreatedBy.value.username,
        email: this.TaskCreatedBy.value.email,
        id: this.TaskCreatedBy.value.id,
      };
      todoModel.TaskCustomerAccount = this.TaskCustomerAccount.value;
      if (todoModel.TaskCustomerAccount) {
        todoModel.TaskCustomerAccount.AccentsStrippedName =
        todoModel.TaskCustomerAccount.AccountName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      todoModel.TaskOwners = this.utilsService.uniquifyArrayByField(this.TaskOwners.value, 'username').map(i => {
        return {
          displayName: i.displayName,
          email: i.email,
          id: i.id,
          username: i.username,
          sapNumber: i.sapNumber,
        };
      });
      todoModel.TaskDescriptions = [];
      todoModel.TaskDescriptions.push({
        Content: this.TaskDescription.value,
        ActionAt: new Date().toISOString(),
        ActionBy: this.TaskCreatedBy.value.displayName,
      });
      todoModel.TaskDeadline = this.TaskDeadline.value.toISOString();
      const accountsDesc = this.TaskCustomerAccount.value ? ` ${this.TaskCustomerAccount.value.AccountName} müşterisi için` : '';
      const notification = {
        Read: false,
        Content: `${this.TaskCreatedBy.value.displayName} tarafından${accountsDesc} ${this.translateService.instant(this.TaskSubject.value)} tipli TASK_NUMBER numaralı task açılmıştır. Deadline: ${this.datePipe.transform(this.TaskDeadline.value, 'dd.MM.yyyy')}`,
        CreatedAt: new Date().toISOString(),
      };
      this.taskService.saveTodoTask({task: todoModel, notification}).subscribe(r => {
        if (r['result_code'] === 200) {
          this.dialogRef.close();
          this.informationModal.dialogModalMessage = this.translateService.instant('RECORD_CREATE_SUCCESS');
          this.informationModal.openModal();
          this.getTodoTasks();
        } else {
          this.informationModal.dialogModalMessage = this.translateService.instant('Creation Error');
          this.informationModal.openModal();
        }
      });
    }
  }

  sortDates = (direction: any, a: any, b: any): number => {
    const x = a.split('.');
    const y = b.split('.');
    const first = Number(this.datePipe.transform(new Date(x[2], x[1], x[0]), 'yyyyMMdd'));
    const second = Number(this.datePipe.transform(new Date(y[2], y[1], y[0]), 'yyyyMMdd'));

    if (first < second) {
        return -1 * direction;
    }
    if (first > second) {
        return direction;
    }
    return 0;
  }

  getTodoTasks(query: string = '') {
    const params = {
      endDate: this.endDateFilter && new Date(this.endDateFilter.setHours(23, 59)).toISOString(),
      startDate: this.startDateFilter && new Date(this.startDateFilter.setHours(0, 0)).toISOString(),
      searchQuery: query,
      status: this.statusFilter,
      subject: this.subjectFilter,
    };
    this.selectedTask = undefined;
    this.taskService.getTodoTasks(params).subscribe(result => {
      this.todoTasks = result;
      this.todoTasks = this.todoTasks.sort((a, b) =>  new Date(a.TaskDeadline).getTime() - new Date(b.TaskDeadline).getTime());
    });
  }
}
