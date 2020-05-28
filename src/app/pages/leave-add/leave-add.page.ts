import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveAppLineContract } from 'src/app/models/leave/leaveAppLineContract.interface';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { BasePage } from '../base/base.page';
import { AlertService } from 'src/app/providers/alert.service';

@Component({
  selector: 'app-leave-add',
  templateUrl: './leave-add.page.html',
  styleUrls: ['./leave-add.page.scss'],
})
export class LeaveAddPage extends BasePage implements OnInit {

  selectedLeaveType: LeaveBalanceContract = {} as LeaveBalanceContract;
  public leaveTypeList: LeaveBalanceContract[] = [];
  leaveLine: LeaveAppLineContract = {} as LeaveAppLineContract;
  newLeave: LeaveAppTableContract = {} as LeaveAppTableContract;
  leaveList: LeaveAppTableContract[] = [];
  sub: any;
  sub1: any;
  pageType: any;
  leaveLineAdd: boolean;
  dataChangeNotSaved: boolean = false;

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute,
    private alertService: AlertService) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Select Date',
      color: 'primary'
    };
    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });
    myCalendar.present();
    myCalendar.onDidDismiss().then((dataReturned) => {
      this.leaveLine.StartDate = new Date(dataReturned.data.from.dateObj);
      this.leaveLine.EndDate = new Date(dataReturned.data.to.dateObj);
      console.log(dataReturned)
    })
  }


  ngOnInit() {
    /*
    this.sub = this.dataService.getleaveList$.subscribe(res => {
      this.leaveList = res;
    })

    this.sub1 = this.dataService.getLeaveLineAddDetails$.subscribe(res => {
      if (res) {
        this.newLeave = res;
        this.leaveLineAdd = true;
      }
    })*/
    this.leaveList = this.dataSPYService.leaveAppList;
    this.getLeaveType(new Date());

  }

  @HostListener('change', ['$event'])
  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.dataChangeNotSaved = true;
  }

  @HostListener('window:beforeunload')
  isDataSaved(): boolean {
    let ret;
    if (this.dataChangeNotSaved) {
      this.alertService.AlertConfirmation('Warning', 'Changes is not Updated. Do you want to leave this page?').subscribe(res => {
        ret = res;
      })
    }
    else ret = true;

    return ret;
  }

  submitLeave() {
    if (this.validator()) {
      if (this.leaveLineAdd) {
        this.leaveLine.ActualStartDate = this.leaveLine.StartDate;
        this.leaveLine.ActualEndDate = this.leaveLine.EndDate;
        this.leaveLine.Balance = this.selectedLeaveType.AbsenceDays;
        this.leaveLine.Hours = 0;
        this.leaveLine.DataArea = this.dataSPYService.workerDataArea;
        var sameLeave = false;
        for (var i = 0; i < this.newLeave.LeaveApplicationLine.length; i++) {
          if (this.newLeave.LeaveApplicationLine[i].AbsenceCode == this.leaveLine.AbsenceCode) {
            this.translate.get('LEAVE_EXIST').subscribe(str => this.showToast(str));
            sameLeave = true;
            break;
          }
        }
        if (!sameLeave) {
          this.newLeave.LeaveApplicationLine.push(this.leaveLine);
          this.updateLeaveDetails();
        }
      } else {
        this.newLeave.Number = 0;
        this.newLeave.Resumed = false;
        this.newLeave.ResumptionInitiated = false;
        this.newLeave.Status = "CREATED";
        this.newLeave.Remarks = "";
        this.newLeave.WorkflowRemarks = "";
        this.newLeave.LeaveApplicationLine = [];
        this.newLeave.DataArea = this.dataSPYService.workerDataArea;
        this.newLeave.WorkerId = this.dataSPYService.worker.WorkerId;

        this.leaveLine.ActualStartDate = this.leaveLine.StartDate;
        this.leaveLine.ActualEndDate = this.leaveLine.EndDate;
        this.leaveLine.DataArea = this.dataSPYService.workerDataArea;
        this.leaveLine.Balance = this.selectedLeaveType.AbsenceDays;
        this.leaveLine.Hours = 0;

        this.newLeave.LeaveApplicationLine.push(this.leaveLine);        

        this.updateLeaveDetails();
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.leaveLineAdd) {
      this.sub1.unsubscribe();
      this.leaveLine = {} as LeaveAppLineContract;
      this.newLeave = {} as LeaveAppTableContract;
    }
  }

  startDateSelected() {
    this.selectedLeaveType = {} as LeaveBalanceContract;
    this.getLeaveType(this.leaveLine.StartDate)
  }

  async updateLeaveDetails() {
    await this.showLoadingView({ showOverlay: true }); 
    this.apiService.updateEmplLeaveAppl(this.newLeave).subscribe(res => {      
      console.log(res);
      if (res.toUpperCase() == "TRUE") {
        if (!this.leaveLineAdd) {
          this.newLeave.IsEditable = true;
          this.leaveList.push(this.newLeave);
        }
        this.apiService.getLeaveDetails(this.dataSPYService.worker.WorkerId).subscribe(res => {
          console.log(res);
          this.dataSPYService.leaveAppList = res;
          this.storageService.setLeaveAppList(res);
          this.dismissLoadingView();          
        }, error => {
          this.dismissLoadingView(); 
          this.translate.get(error).subscribe(str => this.showToast(str));
        })
        this.translate.get('LEAVE_CREATED').subscribe(str => this.showAlert(str));
        this.newLeave = {} as LeaveAppTableContract;
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_leave_home/manager");
        } else {
          this.router.navigateByUrl("leave-home");
        }
      } else {
        this.showToast(res);
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  compareDate() {
    if (!this.leaveLine.StartDate || !this.leaveLine.EndDate) return false;
    return new Date(this.leaveLine.StartDate).getDate() == new Date(this.leaveLine.EndDate).getDate();
  }

  async getLeaveType(date) {
    await this.showLoadingView({ showOverlay: true });   
    this.apiService.getLeaveType(this.dataSPYService.worker.WorkerId, new Date(date)).subscribe(res => {
      console.log(res);
      this.dataSPYService.leaveBalance = res;
      this.storageService.setLeaveBalance(res);
      this.leaveTypeList = res;
      this.dismissLoadingView(); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  selectedLeave(value: LeaveBalanceContract) {
    this.leaveLine.AbsenceCode = value.AbsenceCode;
    this.leaveLine.AbsenceCodeDescription = value.AbsenceCodeDescription;
  }

  validator() {
    if (!this.leaveLine.StartDate) {
      this.translate.get('LEAVE_SD_BLANK').subscribe(str => this.showToast(str));
    } else if (!this.leaveLine.EndDate) {
      this.translate.get('LEAVE_ED_BLANK').subscribe(str => this.showToast(str));
    } else if (!this.leaveLine.AbsenceCode) {
      this.translate.get('LEAVE_TYPE_BLANK').subscribe(str => this.showToast(str));
    } else if ((this.leaveLine.StartDate == this.leaveLine.EndDate) && (!this.leaveLine.Hours)) {
      this.translate.get('LEAVE_HRS_BLANK').subscribe(str => this.showToast(str));
    } else {
      return true;
    }
    return false;
  }
}


