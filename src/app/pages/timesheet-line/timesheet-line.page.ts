import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/providers/dataService/data.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

import { Router } from '@angular/router';
import * as moment from 'moment';

import { Platform, ModalController } from '@ionic/angular';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { TimesheetProject } from 'src/app/models/timesheet/tsProject.interface';
import { TimesheetActivity } from 'src/app/models/timesheet/tsActivity.interface';

import { AxService } from 'src/app/providers/axservice/ax.service';
import { PopoverController } from '@ionic/angular';
import { TimesheetCategory } from 'src/app/models/timesheet/tsCategory.interface';
import { CommentPageForLine } from './comment/comment.page';

import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { Location } from '@angular/common';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';
import { Events } from 'src/app/providers/events/event.service';
import { SearchPage } from 'src/app/common/search/search.page';
@Component({
  selector: 'app-timesheet-line',
  templateUrl: './timesheet-line.page.html',
  styleUrls: ['./timesheet-line.page.scss'],
})
export class TimesheetLinePage implements OnInit {

  tsLine = new TimesheetLine();
  timesheetPeriodList: TimesheetPeriodDate[] = [];
  timesheetApp: TimesheetTableContact = {} as TimesheetTableContact;

  tsProject: TimesheetProject[] = [];
  tsCategory: TimesheetCategory[] = [];
  tsActivity: TimesheetProject[] = [];

  selectedProj: TimesheetProject = {} as TimesheetProject;

  projectActivityList: TimesheetProject[] = [];

  sub0: any;
  sub: any;
  sub1: any;

  timesheetUpdated: boolean = false;
  isEditable: boolean;


  
  constructor(public dataService: DataService, public paramService: ParameterService, public router: Router,
    public alertController: AlertController, public toastController: ToastController, public axService: AxService,
    public popoverController: PopoverController, public events: Events, private location: Location,
    public modalController:ModalController,
    public loadingController: LoadingController) {

  }


  ngOnInit() {
    this.getProjectList();
    setTimeout(() => {
      this.getTSLineData();
    }, 300);
  }

  getTSLineData() {
    this.sub0 = this.dataService.getTimesheetHeader$.subscribe(res => {
      this.timesheetApp = res;
      this.isEditable = this.timesheetApp.IsEditable;
    });

    this.sub = this.dataService.getTimesheetLine$.subscribe(res => {
      this.tsLine = res;

      for(let i = 1;i<8;i++){
        if(this.tsLine["Hours"+i]){
          this.tsLine['EnterHours' + i] = true;
        }else{
          this.tsLine["Hours"+i] = "";
        }
      }
      var projSelected: TimesheetProject = {} as TimesheetProject;
      projSelected.ProjId = this.tsLine.ProjId;
      projSelected.ProjDescription = this.tsLine.ProjDescription;
      this.getActivityList(projSelected);
    })

    this.sub1 = this.dataService.getTimesheetPeriodList$.subscribe(res => {
      this.timesheetPeriodList = res;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();

    if (this.timesheetUpdated) {
      this.dataService.setTimesheetHeader(this.timesheetApp);
      this.events.publish("timesheetAdded",true);
    } else {
      this.events.publish("timesheetAdded",false);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
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

  projSelected(project) {
    this.tsLine.ProjId = project.ProjId;
    this.tsLine.ProjDescription = project.ProjDescription;

    this.tsActivity = [];
    this.getActivityList(project);
  }

  getProjectList() {
    this.axService.getWorkerTimesheetProject(this.paramService.emp.WorkerId).subscribe(res => {
      this.projectActivityList = res;
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
      console.log(res);
    }, (error) => {
      console.log('Error - get worker project details: ' + error);
    })
  }
  getActivityList(tsProject: TimesheetProject) {
    var unique = {}
    for (var i = 0; i < this.projectActivityList.length; i++) {
      if (tsProject.ProjId == this.projectActivityList[i].ProjId) {
        this.tsActivity.push(this.projectActivityList[i]);
      }
    }
  }
  getCategory() {

  }

  async presentPopover(ev: any, hours, internalComment, externalComment, i) {
    ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: 50
          };
        }
      }
    };
    const popover = await this.popoverController.create({
      component: CommentPageForLine,
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
        console.log(dataReturned.data[0]);
        if (i == 1) {
          this.tsLine.Hours1 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment1 = dataReturned.data[1];
          this.tsLine.ExternalComment1 = dataReturned.data[2];
        } else if (i == 2) {
          this.tsLine.Hours2 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment2 = dataReturned.data[1];
          this.tsLine.ExternalComment2 = dataReturned.data[2];
        } else if (i == 3) {
          this.tsLine.Hours3 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment3 = dataReturned.data[1];
          this.tsLine.ExternalComment3 = dataReturned.data[2];
        } else if (i == 4) {
          this.tsLine.Hours4 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment4 = dataReturned.data[1];
          this.tsLine.ExternalComment4 = dataReturned.data[2];
        } else if (i == 5) {
          this.tsLine.Hours5 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment5 = dataReturned.data[1];
          this.tsLine.ExternalComment5 = dataReturned.data[2];
        } else if (i == 6) {
          this.tsLine.Hours6 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment6 = dataReturned.data[1];
          this.tsLine.ExternalComment6 = dataReturned.data[2];
        } else if (i == 7) {
          this.tsLine.Hours7 = Number(dataReturned.data[0]);
          this.tsLine.InternalComment7 = dataReturned.data[1];
          this.tsLine.ExternalComment7 = dataReturned.data[2];
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
      this.updateTimesheet();
    }
  }

  async updateTimesheet() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',

    });
    await loading.present();

    this.axService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
      loading.dismiss();
      console.clear();
      console.log(res);
      this.timesheetUpdated = true;

      this.presentAlertMessage();
    }, error => {
      loading.dismiss();
      console.log(error);
      this.errorToast("Connection Error");
    })
  }
  async presentAlertMessage() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Timesheet Updated Successfully',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {
            this.router.navigateByUrl("/timesheet-home");
          }
        }
      ]
    });

    await alert.present();
  }
  validator() {
    if (!this.tsLine.ProjId) {
      this.errorToast("Project Cannot Be blank");
    }
    else if (!this.tsLine.ProjActivityId) {
      this.errorToast("Activity Cannot Be blank");
    }
    // else if (!this.tsLine.CategoryId) {
    //   this.errorToast("Category Cannot Be blank");
    // }
    else {
      return true
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

  onEnter(index){
    for(let i=1;i<8;i++){
      if(i==index){
        this.tsLine['EnterHours'+i] = true;
      }
    }
  }
  checkHrs(i){
    return this.tsLine['EnterHours' + i];
  }
  convert(i){
    return Number(i)+1;
  }

}
