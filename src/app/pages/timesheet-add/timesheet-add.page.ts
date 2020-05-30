import { Component, OnInit, ChangeDetectionStrategy, HostListener, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetProject } from 'src/app/models/timesheet/tsProject.interface';
import { PopoverController } from '@ionic/angular';
import { TimesheetCategory } from 'src/app/models/timesheet/tsCategory.interface';
import { CommentPage } from './comment/comment.page';
import { Location } from '@angular/common';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { SearchPage } from 'src/app/common/search/search.page';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-timesheet-add',
  templateUrl: './timesheet-add.page.html',
  styleUrls: ['./timesheet-add.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TimesheetAddPage extends BasePage implements OnInit {

  timesheetPeriodList: TimesheetPeriodDate[] = [];
  newTimesheet: TimesheetTableContact = {} as TimesheetTableContact;
  newLine: TimesheetLine = {} as TimesheetLine;
  timesheetList: TimesheetTableContact[] = [];
  tsProject: TimesheetProject[] = [];
  tsCategory: TimesheetCategory[] = [];
  tsActivity: TimesheetProject[] = [];
  projectActivityList: TimesheetProject[] = [];
  sub: any;
  sub0: any;
  sub1: any;
  pageType: any;
  dataChangeNotSaved: boolean = false;
  tsLineAdd: boolean;

  constructor(injector: Injector,    
    private alertService: AlertService,
    public popoverController: PopoverController,private activateRoute: ActivatedRoute,
    private location: Location) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
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
      this.alertService.AlertConfirmation('Warning', 'Changes was not Updated. Sure you want to leave this page?').subscribe(res => {
        ret = res;
      })
    }
    else ret = true;
    return ret;
  }

  ngOnInit() {
    this.getProjectList();
  }

  ionViewWillEnter() {
    this.timesheetList = this.dataSPYService.timesheetList;
    this.timesheetPeriodList = this.dataSPYService.timesheetPeriodList;
    //this.getnewLineData();
  }

  /*
  getnewLineData() {
    this.sub0 = this.dataService.getTimesheetList$.subscribe(res => {
      console.log(res);
      this.timesheetList = res;
    });

    this.sub1 = this.dataService.getTimesheetPeriodList$.subscribe(res => {
      this.timesheetPeriodList = res;
    })
  }
  */

  ngOnDestroy() {
    if (this.tsLineAdd) {
      //this.sub.unsubscribe();
      this.newLine = {} as TimesheetLine;
      this.newTimesheet = {} as TimesheetTableContact;
    }
    //this.sub1.unsubscribe();
    //this.sub0.unsubscribe();
  }


  projSelected(project) {
    this.newLine.ProjId = project.ProjId;
    this.newLine.ProjDescription = project.ProjDescription;
    this.tsActivity = [];
    this.getActivityList(project);
  }

  activitySelected(event) {
    var activity = event.detail.value;
    console.log(activity)
    this.newLine.ProjActivityId = activity.ProjActivityId;
    this.newLine.ProjActivityDescription = activity.ProjActivityDescription;
  }

  async getProjectList() {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.getWorkerTimesheetProject(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.projectActivityList = res;
      this.storageService.setProjectActivityList(res);
      this.projectActivityList = res;
      this.dismissLoadingView();         
      var unique = {}
      for (var i = 0; i < this.projectActivityList.length; i++) {
        var place = this.projectActivityList[i];
        unique[place.ProjId] = place;
      }
      for (var name in unique) {
        var place = unique[name];
        let project: TimesheetProject = {} as TimesheetProject;

        project.ProjId = place.ProjId;
        project.ProjDescription = place.ProjDescription;
        project.displayTxt = place.ProjId + " - " + place.ProjDescription
        this.tsProject.push(project);
      }
    }, (error) => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  getActivityList(tsProject: TimesheetProject) {
    for (var i = 0; i < this.projectActivityList.length; i++) {
      if (tsProject.ProjId == this.projectActivityList[i].ProjId) {
        this.tsActivity.push(this.projectActivityList[i]);
      }
    }
  }

  async presentPopover(ev: any, hours, internalComment, externalComment, i) {
    ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: 10
          };
        }
      }
    };
    const popover = await this.popoverController.create({
      component: CommentPage,
      componentProps: {
        "Hours": hours,
        "InternalComment": internalComment,
        "ExternalComment": externalComment
      },
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        if (i == 1) {
          this.newLine.Hours1 = Number(dataReturned.data[0]);
          this.newLine.InternalComment1 = dataReturned.data[1];
          this.newLine.ExternalComment1 = dataReturned.data[2];
        } else if (i == 2) {
          this.newLine.Hours2 = Number(dataReturned.data[0]);
          this.newLine.InternalComment2 = dataReturned.data[1];
          this.newLine.ExternalComment2 = dataReturned.data[2];
        } else if (i == 3) {
          this.newLine.Hours3 = Number(dataReturned.data[0]);
          this.newLine.InternalComment3 = dataReturned.data[1];
          this.newLine.ExternalComment3 = dataReturned.data[2];
        } else if (i == 4) {
          this.newLine.Hours4 = Number(dataReturned.data[0]);
          this.newLine.InternalComment4 = dataReturned.data[1];
          this.newLine.ExternalComment4 = dataReturned.data[2];
        } else if (i == 5) {
          this.newLine.Hours5 = Number(dataReturned.data[0]);
          this.newLine.InternalComment5 = dataReturned.data[1];
          this.newLine.ExternalComment5 = dataReturned.data[2];
        } else if (i == 6) {
          this.newLine.Hours6 = Number(dataReturned.data[0]);
          this.newLine.InternalComment6 = dataReturned.data[1];
          this.newLine.ExternalComment6 = dataReturned.data[2];
        } else if (i == 7) {
          this.newLine.Hours7 = Number(dataReturned.data[0]);
          this.newLine.InternalComment7 = dataReturned.data[1];
          this.newLine.ExternalComment7 = dataReturned.data[2];
        }
      }
    });

    popover.style.cssText = '--min-width: 85%;--border-radius:5px';
    return await popover.present();
  }

  openComment(event, hours, internalComment, externalComment, i) {
    this.presentPopover(event, hours, internalComment, externalComment, i);
  }

  saveTimesheet() {
    if (this.validator()) {
      if (this.pageType == "lineAdd") {
        /*
        this.sub = this.dataService.gettimesheetAddLine$.subscribe((res: TimesheetTableContact) => {
          this.newLine.Hours1 = Number(this.newLine.Hours1) || 0;
          this.newLine.Hours2 = Number(this.newLine.Hours2) || 0;
          this.newLine.Hours3 = Number(this.newLine.Hours3) || 0;
          this.newLine.Hours4 = Number(this.newLine.Hours4) || 0;
          this.newLine.Hours5 = Number(this.newLine.Hours5) || 0;
          this.newLine.Hours6 = Number(this.newLine.Hours6) || 0;
          this.newLine.Hours7 = Number(this.newLine.Hours7) || 0;

          res.TimesheetLine.push(this.newLine);
          this.tsLineAdd = true;
          this.newTimesheet = res;
          this.updateTimesheet();
        })*/        
        this.newLine.Hours1 = Number(this.newLine.Hours1) || 0;
        this.newLine.Hours2 = Number(this.newLine.Hours2) || 0;
        this.newLine.Hours3 = Number(this.newLine.Hours3) || 0;
        this.newLine.Hours4 = Number(this.newLine.Hours4) || 0;
        this.newLine.Hours5 = Number(this.newLine.Hours5) || 0;
        this.newLine.Hours6 = Number(this.newLine.Hours6) || 0;
        this.newLine.Hours7 = Number(this.newLine.Hours7) || 0;
        this.newTimesheet = this.dataSPYService.timesheet;
        this.newTimesheet.TimesheetLine.push(this.newLine);
        this.tsLineAdd = true;
        this.updateTimesheet();
      } else {
        this.newTimesheet.Number = 0;
        this.newTimesheet.IsEditable = true;
        this.newTimesheet.WorkerId = this.dataSPYService.worker.WorkerId;
        this.newTimesheet.TimesheetLine = [];
        this.newTimesheet.TimesheetCode = "";
        this.newTimesheet.Status = "CREATED";
        this.newTimesheet.DataArea = this.dataSPYService.workerDataArea;
        this.newTimesheet.PeriodFrom = this.timesheetPeriodList[0].PeriodDate;
        this.newTimesheet.PeriodTo = this.timesheetPeriodList[6].PeriodDate;

        this.newLine.Hours1 = Number(this.newLine.Hours1) || 0;
        this.newLine.Hours2 = Number(this.newLine.Hours2) || 0;
        this.newLine.Hours3 = Number(this.newLine.Hours3) || 0;
        this.newLine.Hours4 = Number(this.newLine.Hours4) || 0;
        this.newLine.Hours5 = Number(this.newLine.Hours5) || 0;
        this.newLine.Hours6 = Number(this.newLine.Hours6) || 0;
        this.newLine.Hours7 = Number(this.newLine.Hours7) || 0;
        this.newLine.DataArea = this.dataSPYService.workerDataArea;

        this.newTimesheet.TimesheetLine.push(this.newLine);
        this.updateTimesheet();
      }

    }
  }

  async updateTimesheet() {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.updateWorkerTimesheet(this.newTimesheet).subscribe(res => {
      console.log(res);
      if (res) {
        if (!this.tsLineAdd) {
          this.newTimesheet.IsEditable = true;
          this.timesheetList.push(this.newTimesheet);
        }
        this.apiService.getWorkerTimesheet(this.dataSPYService.worker.WorkerId, this.timesheetPeriodList[0].PeriodDate).subscribe(res => {
          console.log(res);
          this.dataChangeNotSaved = false;
          this.dataSPYService.timesheetList = res;
          this.storageService.setTimesheetList(res);
          this.timesheetList = res;
          this.dismissLoadingView(); 
        }, (error) => {
          this.dismissLoadingView(); 
          this.translate.get(error).subscribe(str => this.showToast(str)); 
        });
      }
      this.dismissLoadingView(); 
      if (!this.tsLineAdd) {
        this.dataSPYService.timesheet = this.newTimesheet;
        this.dataSPYService.timesheetPeriodList = this.timesheetPeriodList;
        this.router.navigateByUrl("timesheet-header");
      } else {
        this.location.back();
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  validator() {
    if (!this.newLine.ProjId) {
      this.translate.get('PROJ_BLANK').subscribe(str => this.showToast(str)); 
    }
    else {
      return true
    }
    return false;
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: SearchPage,
      componentProps: {
        'searchList': this.tsProject,
        'bindLabel': 'displayTxt',
      }
    });
    await modal.present();
    modal.onDidDismiss().then(dataReturned => {
      console.log(dataReturned);
      if (dataReturned.data) {
        this.projSelected(dataReturned.data)
      }
    })
  }

  onEnter(index) {
    for (let i = 1; i < 8; i++) {
      if (i == index) {
        this.newLine['EnterHours' + i] = true;
      }
    }
  }

  checkHrs(i) {
    return this.newLine['EnterHours' + i];
  }

  convert(i) {
    return Number(i) + 1;
  }

}
