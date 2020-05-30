import { Component, OnInit, Injector } from '@angular/core';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { Router } from '@angular/router';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
import { BasePage } from '../base/base.page';

class HoursDateModel {
  hours: any;
  date: any;
}
@Component({
  selector: 'app-timesheet-header',
  templateUrl: './timesheet-header.page.html',
  styleUrls: ['./timesheet-header.page.scss'],
})
export class TimesheetHeaderPage extends BasePage implements OnInit {

  timesheetApp: TimesheetTableContact = {} as TimesheetTableContact;
  sub: any;
  sub1: any;
  colorList: any = [];
  tsHoursList: HoursDateModel[] = [];
  timesheetPeriodList: TimesheetPeriodDate[] = [];
  isEditable: boolean;

  constructor(injector: Injector,
    public router: Router) {
      super(injector);
      this.colorList = this.dataSPYService.colorList;
  }

  ngOnInit() {

  }

  getLineHrs(k) {
    var index = Number(k) + 1;
    return 'Hours' + index
  }

  goBack() {
    if (this.dataSPYService.worker.IsManager) {
      this.router.navigateByUrl("/tab/tabs/manager-profile/manager_timesheet_home/manager");
    } else {
      this.router.navigateByUrl("timesheet-home");
    }
  }

  addTimesheetLine() {
    this.dataSPYService.timesheet = this.timesheetApp;
    //this.dataService.setTimesheetAddLine(this.timesheetApp);
    this.router.navigateByUrl("timesheet-add/lineAdd");
  }

  ionViewWillEnter() {
    this.timesheetApp = this.dataSPYService.timesheet;
    this.isEditable = this.timesheetApp.IsEditable;
    this.timesheetPeriodList = this.dataSPYService.timesheetPeriodList;
    this.gettotalHrsByDays();
    /*
    this.sub = this.dataService.getTimesheetHeader$.subscribe(res => {
      this.timesheetApp = res;
      this.isEditable = this.timesheetApp.IsEditable;
    });

    this.sub1 = this.dataService.getTimesheetPeriodList$.subscribe(res => {
      this.timesheetPeriodList = res;
      this.gettotalHrsByDays();
    });
    */
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
    //this.sub1.unsubscribe();
  }

  editProjectDetails(tsLine: TimesheetLine) {
    this.dataSPYService.timesheetLine = tsLine;
    //this.dataService.setTimesheetLine(tsLine);
    this.router.navigateByUrl("/timesheet-line");
  }

  getHrs(timeSheetLine: TimesheetLine) {
    var hrs = timeSheetLine.Hours1 + timeSheetLine.Hours2 + timeSheetLine.Hours3 + timeSheetLine.Hours4 + timeSheetLine.Hours5
      + timeSheetLine.Hours6 + timeSheetLine.Hours7;
    return Number(hrs.toFixed(1)); ;
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
