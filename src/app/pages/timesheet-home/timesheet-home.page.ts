import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { IonSlides } from '@ionic/angular';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
import { WorkerPeriod } from 'src/app/models/timesheet/workerPeriod.model';
import { Events } from 'src/app/providers/events/event.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-timesheet-home',
  templateUrl: './timesheet-home.page.html',
  styleUrls: ['./timesheet-home.page.scss'],
})
export class TimesheetHomePage extends BasePage implements OnInit {

  @ViewChild('slides', { static: true }) slides: IonSlides;
  periodList: WorkerPeriod[] = [];
  selectedTab = 'all';
  showDetails: boolean = false;
  timesheetList: TimesheetTableContact[] = [];

  timesheetPeriodList: TimesheetPeriodDate[] = [];
  authenticated: boolean;

  public myworkerTimesheetList: TimesheetTableContact[];
  pageType: any;
  selectedPeriod: WorkerPeriod;

  constructor(injector: Injector,
    public router: Router, 
    public paramService: ParameterService, 
    public events: Events,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.events.subscribe('timesheetAdded', (res) => {
        if (res) {
          /*
          this.dataSPYService.getTimesheetList$.subscribe(res => {
            this.timesheetList = res;
          });*/
        }

    })

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    if (this.pageType == "worker") {
      this.getMyWorkersTimesheetApprovals();
    } else {
      this.getWorkerTimesheetPeriod(new Date());
    }
  }

  ionViewWillEnter() {
    this.myworkerTimesheetList = this.dataSPYService.myworkerTimesheetList;
    this.periodList = this.dataSPYService.periodList;
    this.timesheetList = this.dataSPYService.timesheetList;
  }

  async getMyWorkersTimesheetApprovals() {
    await this.showLoadingView({ showOverlay: true });   
    this.apiService.GetMyWorkersTimesheetApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.myworkerTimesheetList = res;
      this.storageService.setMyWorkerTimesheetList(res);
      this.myworkerTimesheetList = res;
      this.dismissLoadingView(); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
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

  async getWorkerCurrentTimesheet(periodDate) {
    await this.showLoadingView({ showOverlay: true });   
    this.apiService.getWorkerTimesheet(this.dataSPYService.worker.WorkerId, periodDate).subscribe(res => {      
      console.log(res);
      this.dataSPYService.timesheetList = res;
      this.storageService.setTimesheetList(res);
      this.timesheetList = res;
      this.dismissLoadingView();
      this.showDetails = true;
      this.timesheetPeriodList = this.getTimesheetPeriodDateList(this.selectedPeriod.PeriodFrom, this.selectedPeriod.PeriodTo);      
    }, (error) => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    });
  }

  async getWorkerTimesheetPeriod(periodDate) {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.getWorkerPeriod(this.dataSPYService.worker.WorkerId, periodDate).subscribe(res => {
      console.log(res);
      this.dataSPYService.periodList = res;
      this.storageService.setPeriodList(res);
      this.periodList = res;      
      this.getCurrentPeriod();
      this.dismissLoadingView();
    }, (error) => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
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
    this.dataSPYService.timesheetList = this.timesheetList;
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
