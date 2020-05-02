import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AxService } from 'src/app/providers/axservice/ax.service';

import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';

import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

import { LeaveAppLineContract } from 'src/app/models/leave/leaveAppLineContract.interface';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';

import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';

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





  constructor(public dataService: DataService, public router: Router, public toastController: ToastController,
    public alertController: AlertController, public axService: AxService, public paramService: ParameterService,
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
            this.errorToast("Leave already applied for this leave type");
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
        this.presentAlert("Success", "Leave Created Successfully").then(() => {
          this.newLeave = {} as LeaveAppTableContract;
          if (this.pageType == "manager") {
            this.router.navigateByUrl("/tab/tabs/manager-profile/manager_leave_home/manager");
          } else {
            this.router.navigateByUrl("leave-home");
          }
        })
      } else {
        this.presentAlert("Error", res)
      }
    }, error => {
      loading.dismiss();
      this.presentAlert("Error", "Error Connecting to server, Please Try Again")
    })
  }
  compareDate() {
    if (!this.leaveLine.StartDate || !this.leaveLine.EndDate) return false;

    return new Date(this.leaveLine.StartDate).getDate() == new Date(this.leaveLine.EndDate).getDate();
  }

  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    return await alert.present();
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
      this.errorToast("Leave Type Cann't be blank");
    } else if (!this.leaveLine.StartDate) {
      this.errorToast("Start Date Cann't be blank");
    } else if (!this.leaveLine.EndDate) {
      this.errorToast("End Date Cann't be blank");
    } else if ((this.leaveLine.StartDate == this.leaveLine.EndDate) && (!this.leaveLine.Hours)) {
      this.errorToast("Hours Cann't be blank");
    } else {
      return true;
    }
    return false;
  }
  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}


