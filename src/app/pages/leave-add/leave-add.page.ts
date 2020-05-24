import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AxService } from 'src/app/providers/axservice/ax.service';

import { LoadingController, ModalController } from '@ionic/angular';

import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

import { LeaveAppLineContract } from 'src/app/models/leave/leaveAppLineContract.interface';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';

import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';

import { startWith, map } from 'rxjs/operators';
import { AlertService } from 'src/app/providers/alert.service';

@Component({
  selector: 'app-leave-add',
  templateUrl: './leave-add.page.html',
  styleUrls: ['./leave-add.page.scss'],
})
export class LeaveAddPage implements OnInit {

  selectedLeaveType: LeaveBalanceContract = {} as LeaveBalanceContract;
  leaveTypeList: LeaveBalanceContract[] = [];

  leaveLine: LeaveAppLineContract = {} as LeaveAppLineContract;
  newLeave: LeaveAppTableContract = {} as LeaveAppTableContract;
  leaveList: LeaveAppTableContract[] = [];

  sub: any;
  sub1: any;
  pageType: any;
  leaveLineAdd: boolean;


  dataChangeNotSaved: boolean = false;


  constructor(public dataService: DataService, public router: Router,
    public alertServ: AlertService, public axService: AxService, public paramService: ParameterService,
    public loadingController: LoadingController, private activateRoute: ActivatedRoute, public modalController: ModalController) {

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }





  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Select Date',
      color: 'primary'
    };

    let myCalendar = await this.modalController.create({
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
    this.sub = this.dataService.getleaveList$.subscribe(res => {
      this.leaveList = res;
    })

    this.sub1 = this.dataService.getLeaveLineAddDetails$.subscribe(res => {
      if (res) {
        this.newLeave = res;
        this.leaveLineAdd = true;
      }
    })
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
      this.alertServ.AlertConfirmation('Warning', 'Changes was not Updated. Sure you want to leave this page?').subscribe(res => {
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

        this.leaveLine.DataArea = this.paramService.dataAreaObj.DataArea;
        var sameLeave = false;
        for (var i = 0; i < this.newLeave.LeaveApplicationLine.length; i++) {
          if (this.newLeave.LeaveApplicationLine[i].AbsenceCode == this.leaveLine.AbsenceCode) {
            this.alertServ.errorToast("Leave already applied for this leave type");
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
        this.newLeave.DataArea = this.paramService.dataAreaObj.DataArea;


        this.leaveLine.ActualStartDate = this.leaveLine.StartDate;
        this.leaveLine.ActualEndDate = this.leaveLine.EndDate;
        this.leaveLine.DataArea = this.paramService.dataAreaObj.DataArea;
        this.leaveLine.Balance = this.selectedLeaveType.AbsenceDays;
        this.leaveLine.Hours = 0;

        this.newLeave.LeaveApplicationLine.push(this.leaveLine);
        this.newLeave.WorkerId = this.paramService.emp.WorkerId;

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

    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();

    this.axService.updateEmplLeaveAppl(this.newLeave).subscribe(res => {
      loading.dismiss();
      console.log(res);
      if (res.toUpperCase() == "TRUE") {
        if (!this.leaveLineAdd) {
          this.newLeave.IsEditable = true;
          this.leaveList.push(this.newLeave);
        }
        /*

        ********************************DON'T DELETE THIS

        */

        this.axService.getLeaveDetails(this.paramService.emp.WorkerId).subscribe(res => {
          this.dataService.setLeaveList(res);
          console.log(res);
        }, error => {
        })

        //this.dataService.setLeaveList(this.leaveList);
        this.alertServ.AlertMessage("Success", "Leave Created Successfully")
        this.newLeave = {} as LeaveAppTableContract;
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_leave_home/manager");
        } else {
          this.router.navigateByUrl("leave-home");
        }
      } else {
        this.alertServ.errorToast(res)
      }
    }, error => {
      loading.dismiss();
      this.alertServ.errorToast("Error Connecting to server, Please Try Again")
    })
  }
  compareDate() {
    if (!this.leaveLine.StartDate || !this.leaveLine.EndDate) return false;

    return new Date(this.leaveLine.StartDate).getDate() == new Date(this.leaveLine.EndDate).getDate();
  }

  getLeaveType(date) {
    this.axService.getLeaveType(this.paramService.emp.WorkerId, new Date(date)).subscribe(res => {
      console.log(res);
      this.leaveTypeList = res;
    }, error => {
      console.log(error);
    })
  }

  selectedLeave(value: LeaveBalanceContract) {
    this.leaveLine.AbsenceCode = value.AbsenceCode;
    this.leaveLine.AbsenceCodeDescription = value.AbsenceCodeDescription;
  }

  validator() {
    if (!this.leaveLine.AbsenceCode) {
      this.alertServ.errorToast("Leave Type Cann't be blank");
    } else if (!this.leaveLine.StartDate) {
      this.alertServ.errorToast("Start Date Cann't be blank");
    } else if (!this.leaveLine.EndDate) {
      this.alertServ.errorToast("End Date Cann't be blank");
    } else if ((this.leaveLine.StartDate == this.leaveLine.EndDate) && (!this.leaveLine.Hours)) {
      this.alertServ.errorToast("Hours Cann't be blank");
    } else {
      return true;
    }
    return false;
  }
}


