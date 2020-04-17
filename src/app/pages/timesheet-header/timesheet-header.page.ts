import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/providers/dataService/data.service';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastController, AlertController } from '@ionic/angular';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
class HoursDateModel {
  hours: any;
  date: any;
}
@Component({
  selector: 'app-timesheet-header',
  templateUrl: './timesheet-header.page.html',
  styleUrls: ['./timesheet-header.page.scss'],
})
export class TimesheetHeaderPage implements OnInit {

  timesheetApp: TimesheetTableContact = {} as TimesheetTableContact;
  sub: any;
  sub1: any;
  colorList: any = [];
  tsHoursList: HoursDateModel[] = [];
  timesheetPeriodList: TimesheetPeriodDate[] = [];

  isEditable: boolean;

  constructor(public dataService: DataService, public paramService: ParameterService, public router: Router,
    public alertController: AlertController, public toastController: ToastController) {
    this.colorList = this.paramService.colorList;
  }

  ngOnInit() {

  }
  getLineHrs(k) {
    var index = Number(k) + 1;
    return 'Hours' + index
  }
  goBack() {
    if (this.paramService.isManager) {
      this.router.navigateByUrl("/tab/tabs/manager-profile/manager_timesheet_home/manager");
    } else {
      this.router.navigateByUrl("timesheet-home");
    }
  }
  addTimesheetLine() {
    this.dataService.setTimesheetAddLine(this.timesheetApp);
    this.router.navigateByUrl("timesheet-add/lineAdd");
  }
  ionViewWillEnter() {
    this.sub = this.dataService.getTimesheetHeader$.subscribe(res => {
      this.timesheetApp = res;
      this.isEditable = this.timesheetApp.IsEditable;
    });

    this.sub1 = this.dataService.getTimesheetPeriodList$.subscribe(res => {
      this.timesheetPeriodList = res;
      this.gettotalHrsByDays();
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
  }

  editProjectDetails(tsLine: TimesheetLine) {
    this.dataService.setTimesheetLine(tsLine);
    this.router.navigateByUrl("/timesheet-line");
  }
  getHrs(timeSheetLine: TimesheetLine) {
    var hrs = timeSheetLine.Hours1 + timeSheetLine.Hours2 + timeSheetLine.Hours3 + timeSheetLine.Hours4 + timeSheetLine.Hours5
      + timeSheetLine.Hours6 + timeSheetLine.Hours7

    return hrs;
  }

  gettotalHrsByDays() {
    var len = this.timesheetPeriodList.length;
    var i = 0;
    var totalHeaderHrs=0;
    while (i < len) {
      var sum = 0;
      this.timesheetApp.TimesheetLine.forEach(e => {
        sum += Number(e[this.getLineHrs(i)]);
      })
      totalHeaderHrs += sum;
      this.timesheetPeriodList[i].totalHrs = sum;
      i++;
    }
    this.timesheetApp.TotalHours = totalHeaderHrs;

    console.log(this.timesheetPeriodList)
  }
}
