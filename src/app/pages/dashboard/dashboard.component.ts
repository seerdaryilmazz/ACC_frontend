import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { PriorTasksComponent } from '../../shared/components/prior_tasks/prior-tasks.component';
import { CommunicationService } from '../../services/communication.service';
import { TranslateService } from '../../shared/translate/translate.service';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../_services';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;
  showDetail;
  solarValue: number;
  teams;
  selectedUserId;
  teamMemberLists = [];
  showTeamMembers = false;
  selectedLanguage;
  username;
  useremail;
  selectedMember;
  accountAndCalendarSize = { AccountSize: 0, CalendarSize: 0 };
  taskAndOrderSize = { OrderSize: 0, TaskSize: 0 };
  dateRangeValue = 30;
  dateRangeList = [];
  @ViewChild('priorTasks', { static: true }) priorTasksComponent: PriorTasksComponent;
  teamMemberListConfig = {
    displayKey: 'displayName',
    search: true,
    moreText: this.translateService.instant("more"),
    placeholder: this.translateService.instant("SELECT_ACCOUNT_OWNER"),
    noResultsFound: this.translateService.instant("NO_ACCOUNT_OWNER_FOUND"),
    searchPlaceholder: this.translateService.instant("SEARCH"),
    searchOnKey: 'displayName',
    limitTo: 2000
  };

 /*  mockUserJson = {
    "teams": [
      {
        "team": {
          "externalId": 22952,
          "id": 585,
          "name": "YNK",
          "type": "Team"
        },
        "users": [

          {
            displayName: "Mehmet Sökmez",
            email: "mehmet.sokmez@ekol.com",
            username: "mehmet.sokmez",
            id: 2
          },
          {
            displayName: "Haluk Yavuz",
            email: "haluk.yavuz@ekol.com",
            username: "haluk.yavuz",
            id: 3
          },
          {
            displayName: "İrfan Taşkın",
            email: "irfan.taskin@ekol.com",
            username: "irfan.taskin",
            id: 11
          },
          {
            displayName: "Konuralp Tarcan",
            email: "konuralp.tarcan@ekol.com",
            username: "konuralp.tarcan",
            id: 5
          },
          {
            displayName: "Volkan Turhan",
            email: "volkan.turhan@ekol.com",
            username: "volkan.turhan",
            id: 6
          },
          {
            displayName: "Sevilay Altmış",
            email: "sevilay.altmis@ekol.com",
            username: "sevilay.altmis",
            id: 7
          },
          {
            displayName: "Şenol Toprak",
            email: "senol.toprak@ekol.com",
            username: "senol.toprak",
            id: 8
          },
          {
            displayName: "Kurbet Çalı",
            email: "kurbet.cali@ekol.com",
            username: "kurbet.cali",
            id: 9
          },
          {
            displayName: "Vahit Cihan Büyüköztürk",
            email: "cihan.buyukozturk@ekol.com",
            username: "cihan.buyukozturk",
            id: 10
          },

          {
            displayName: "Ece Sider",
            email: "ece.sider@ekol.com",
            username: "ece.sider",
            id: 12
          }
        ]
      }
    ],
    "user": {
      displayName: "Seyhan Alver",
      email: "seyhan.alver@ekol.com",
      username: "seyhan.alver",
      id: 4
    }
  }; */

  allUsers;
  showOtherUsers = false;

  constructor(private dashboardService: DashboardService,
    private communicationService: CommunicationService,
    private translateService: TranslateService,
    private userService: UserService,
    private utilsService: UtilsService) {
  }

  ngOnInit() {
    //this.selectedMember = this.mockUserJson['teams'][0]['users'][0];
    this.selectedLanguage = localStorage.getItem("lang");
    this.dateRangeList = this.utilsService.getDateRangeList();
/*     this.apiService.checkUserIsAdmin().subscribe(result => {


      if (result['result_code'] == 200) {
        this.showOtherUsers = result['payload']['is_admin'];
      }

      if (this.showOtherUsers) {
        this.apiService.getUserInformation(result['payload']['admin_mail']).subscribe(result => {
          this.allUsers = result;

          if (!localStorage.getItem("UserInfo") || localStorage.getItem("UserInfo") == null || localStorage.getItem("UserInfo") == undefined) {
              localStorage.setItem("UserInfo", JSON.stringify(this.allUsers));
              localStorage.setItem('selectedUserInfo', JSON.stringify(this.allUsers['user']))
              this.selectedMember = this.allUsers['user'];
              this.communicationService.changeHeaderUsernameAndImage(this.selectedMember)
              this.selectedUserId = this.allUsers['user'].id;
              this.setTeamMembers(this.allUsers);
              this.getParameters();
         

          }
          else {
            this.selectedMember = JSON.parse(localStorage.getItem("selectedUserInfo"))
            this.setTeamMembers(JSON.parse(localStorage.getItem("UserInfo")));
            this.communicationService.changeHeaderUsernameAndImage(this.selectedMember);

            this.getParameters();
          }
        });
      }
      else {
        if (!localStorage.getItem("UserInfo") || localStorage.getItem("UserInfo") == null || localStorage.getItem("UserInfo") == undefined) {
          this.apiService.getUserInformation().subscribe(result => {
            if (!(result['error'])) {
              localStorage.setItem("UserInfo", JSON.stringify(result));
              localStorage.setItem('selectedUserInfo', JSON.stringify(result['user']))
              this.communicationService.changeHeaderUsernameAndImage(result['user']);
              this.selectedUserId = result['user'].id;
              this.setTeamMembers(result);
              this.getParameters();
            }
          });
        }
        else {
          this.selectedMember = JSON.parse(localStorage.getItem("selectedUserInfo"))
          this.communicationService.changeHeaderUsernameAndImage(this.selectedMember);

          this.setTeamMembers(JSON.parse(localStorage.getItem("UserInfo")));
          this.getParameters();
        }
      }
    }); */

        if (!localStorage.getItem('UserInfo') || localStorage.getItem('UserInfo') == null) {
          this.dashboardService.getUserInformation().subscribe(result => {
            if (!(result['error'])) {
              localStorage.setItem('UserInfo', JSON.stringify(result));
              localStorage.setItem('selectedUserInfo', JSON.stringify(result['user']));
              this.communicationService.changeHeaderUsernameAndImage(result['user']);
              this.selectedUserId = result['user'].id;
              this.setTeamMembers(result);
              this.getParameters();
            }
          });
        }
        else {
          this.selectedMember = JSON.parse(localStorage.getItem("selectedUserInfo"))
          this.communicationService.changeHeaderUsernameAndImage(this.selectedMember);
          this.setTeamMembers(JSON.parse(localStorage.getItem("UserInfo")));
          this.getParameters();
        }
  }

  getParameters() {
    if (!localStorage.getItem("Parameters")) {
    this.dashboardService.getAllParameters().subscribe(result => {
      if(result['ActivityScopes']!=null){
        localStorage.setItem("Parameters", JSON.stringify(result));
      }
    })
  }
}

  setTeamMembers(result) {
    this.teams = [];
    this.teamMemberLists = [];

    this.teamMemberLists.push(result['user'])
    this.teams = result["teams"];
    if (this.teams && this.teams.length > 0) {
      this.showTeamMembers = true;
      this.teams.forEach(team => {
        if(team.team.name=="Sales Turkey" && this.showOtherUsers){
             team["users"].forEach(user => {
          this.teamMemberLists.push(user);
        });
        } 
        else {
          team["users"].forEach(user => {
            this.teamMemberLists.push(user);
          });
        }
     
      });
      this.teamMemberLists = this.utilsService.uniquifyArrayByField(this.teamMemberLists, 'username');
      this.teamMemberLists.sort(function(a, b) {
        var textA = a.displayName.toUpperCase();
        var textB = b.displayName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    }
    if (localStorage.getItem('selectedUserInfo')) {
      this.selectedUserId = JSON.parse(localStorage.getItem('selectedUserInfo')).id
      this.username = JSON.parse(localStorage.getItem('selectedUserInfo')).username;
      this.useremail = JSON.parse(localStorage.getItem('selectedUserInfo')).email
    }
    else {

      this.username = JSON.parse(localStorage.getItem('UserInfo')).user.username;
      this.useremail = JSON.parse(localStorage.getItem('UserInfo')).user.email;
    }
    this.getUserDashboardCardCount(this.dateRangeValue);
  }

  getUserDashboardCardCount(dateRangeValue) {
    this.dashboardService.getAccountAndCalendarSize(this.username).subscribe(result => {
      this.accountAndCalendarSize.AccountSize = result["AccountSize"];
      this.accountAndCalendarSize.CalendarSize = result["CalendarSize"];
    });
    this.dashboardService.getTaskAndOrderSize(this.useremail, dateRangeValue).subscribe(result => {
      this.taskAndOrderSize.OrderSize = result["OrderSize"];
      this.taskAndOrderSize.TaskSize = result["TaskSize"];
    });
    this.priorTasksComponent.getUserPriorTasks(this.useremail, dateRangeValue);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changeSelectedUser(event) {
    if (event.value != null) {
      const selectedUserInfo = this.teamMemberLists.find(member => member.id === event.value.id);
      if (event.value.id !== 0 && selectedUserInfo) {
        localStorage.setItem('selectedUserInfo', JSON.stringify(selectedUserInfo));
        this.username = JSON.parse(localStorage.getItem('selectedUserInfo')).username;
        this.useremail = JSON.parse(localStorage.getItem('selectedUserInfo')).email;
        this.communicationService.changeHeaderUsernameAndImage(selectedUserInfo);
        this.dashboardService.getUserInformation().subscribe(r => {
          localStorage.setItem('selectedUserInfo', JSON.stringify(selectedUserInfo));
          this.userService.reloadNotifications();
        });
      } else {
        localStorage.removeItem('selectedUserInfo');
        this.username = JSON.parse(localStorage.getItem('UserInfo')).user.username;
        this.useremail = JSON.parse(localStorage.getItem('UserInfo')).user.email;
      }
      this.getUserDashboardCardCount(this.dateRangeValue);
    }
  }
}
