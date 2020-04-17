import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { StorageService } from 'src/app/providers/storageService/storage.service';

import { DataService } from 'src/app/providers/dataService/data.service';
import { IonSlides } from '@ionic/angular';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
import { WorkerPeriod } from 'src/app/models/timesheet/workerPeriod.model';
import { Events } from 'src/app/providers/events/event.service';

@Component({
  selector: 'app-timesheet-home',
  templateUrl: './timesheet-home.page.html',
  styleUrls: ['./timesheet-home.page.scss'],
})
export class TimesheetHomePage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  periodList: WorkerPeriod[] = [];
  selectedTab = 'all';
  showDetails: boolean = false;
  timesheetList: TimesheetTableContact[] = [];

  timesheetPeriodList: TimesheetPeriodDate[] = [];
  authenticated: boolean;

  myworkerTimesheetList: TimesheetTableContact[];
  pageType: any;
  selectedPeriod: WorkerPeriod;

  constructor(public router: Router, public paramService: ParameterService, public events: Events,
    public storageServ: StorageService, public axService: AxService, public dataService: DataService,
    private activateRoute: ActivatedRoute) {

    this.events.subscribe('timesheetAdded', (res) => {
      if (res) {
        this.dataService.getTimesheetList$.subscribe(res => {
          this.timesheetList = res;
        });
      }

    })

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');


    this.events.subscribe("authenticated", res => {
      if (res) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
        paramService.authenticated = false;
        storageServ.clearStorage();
        router.navigateByUrl("/home");
      }
    })
  }
  ngOnInit() {
    if (this.pageType == "worker") {
      this.getMyWorkersTimesheetApprovals();
    } else {
      this.getWorkerTimesheetPeriod(new Date());
    }
  }

  getMyWorkersTimesheetApprovals() {
    this.axService.GetMyWorkersTimesheetApprovals(this.paramService.emp.WorkerId).subscribe(res => {
      console.log(res);
      this.myworkerTimesheetList = res;
    })
  }


  getTimesheetPeriodDateList(startDate, endDate) {
    var sDate = new Date(moment(startDate).format("YYYY-MM-DD"));
    var eDate = new Date(moment(endDate).format("YYYY-MM-DD"));
    var period = [];
    let i = 0;
    for (var m = moment(sDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      i++;
      var periodObj: TimesheetPeriodDate = {} as TimesheetPeriodDate;
      periodObj.PeriodDate = new Date(m.format('YYYY-MM-DD'));
      periodObj.WorkingHours = 8;

      if (i < 8) {
        period.push(periodObj);
      }
    }
    return period;
  }
  getWorkerCurrentTimesheet(periodDate) {
    this.axService.getWorkerTimesheet(this.paramService.emp.WorkerId, periodDate).subscribe(res => {
      console.log(res);
      this.timesheetList = res;
      this.showDetails = true;
      this.timesheetPeriodList = this.getTimesheetPeriodDateList(this.selectedPeriod.PeriodFrom, this.selectedPeriod.PeriodTo)
      this.dataService.settimesheetPeriodList(this.timesheetPeriodList);
    }, (error) => {
      console.log(error);
    });
  }
  getWorkerTimesheetPeriod(periodDate) {
    this.axService.getWorkerPeriod(this.paramService.emp.WorkerId, periodDate).subscribe(res => {
      this.periodList = res;
      this.getCurrentPeriod();
    })
  }

  getCurrentPeriod() {
    var today = new Date();
    today.setDate(today.getDate() + 1);
    for (var i = 0; i < this.periodList.length; i++) {
      if (today > new Date(this.periodList[i].PeriodFrom) && today < new Date(this.periodList[i].PeriodTo)) {
        this.selectedPeriod = this.periodList[i];
        break;
      }
    }
  }
  addTimesheet() {
    this.dataService.setTimesheetList(this.timesheetList)
    this.router.navigateByUrl("timesheet-add/add");
  }
  doRefresh(event) {
    setTimeout(() => {
      if (this.pageType != "worker") {
        this.getWorkerCurrentTimesheet(new Date(this.selectedPeriod.PeriodFrom));
      } else {
        this.getMyWorkersTimesheetApprovals();
      }
      event.target.complete();
    }, 2000);
  }

  periodChanged(ev){
    this.selectedPeriod = ev.target.value;
    this.getWorkerCurrentTimesheet(new Date(this.selectedPeriod.PeriodFrom));
  }
}
