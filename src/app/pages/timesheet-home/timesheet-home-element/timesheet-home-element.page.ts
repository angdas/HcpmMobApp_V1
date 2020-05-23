import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { Platform} from '@ionic/angular';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { Events } from 'src/app/providers/events/event.service';
@Component({
  selector: 'timesheet-home-element',
  templateUrl: './timesheet-home-element.page.html',
  styleUrls: ['./timesheet-home-element.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetHomeElementPage implements OnInit {

  @Input('timesheetApp') timesheetApp: TimesheetTableContact;
  @Input('pageType') pageType: any;
  constructor(public dataService: DataService, public router: Router, public axService: AxService, public events: Events,
    public alertController: AlertController, public toastController: ToastController,
    public loadingController: LoadingController,public paramService:ParameterService) { }

  ngOnInit() {
    this.events.subscribe('timesheetUpdated', (res) => {
      this.dataService.getTimesheetHeader$.subscribe(res => {
        console.log(res);
        this.timesheetApp = res;
      });
    })
  }
  gotoHeaderPage() {
    this.dataService.setTimesheetHeader(this.timesheetApp);
    this.router.navigateByUrl("timesheet-header");
  }

  deleteLine(i) {
    this.ConfirmationForDelete("Delete Timesheet Line", "Are you sure you want to delete this timesheet line?", "line", i);
  }
  deleteHeader() {
    this.ConfirmationForDelete("Delete Timesheet", "Are you sure you want to delete this timesheet?", "header");
  }
  submitTimesheet() {
    this.ConfirmationForSubmit();
  }


  async ConfirmationForSubmit() {
    const alert = await this.alertController.create({
      header: "Submit Timesheet",
      message: "Are you sure you want to submit this timesheet?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.submitTimesheetService();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }
  async ConfirmationForDelete(header, msg, type, i = null) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (type == "line") {
              if (this.timesheetApp.TimesheetLine.length == 1) {
                this.timesheetApp.IsDeleted = true;
              } else {
                this.timesheetApp.TimesheetLine[i].IsDeleted = true;
                this.timesheetApp.TimesheetLine.splice(i, 1);
              }
              this.axService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
                this.presentToast("Timesheet Line Deleted");
              }, error => {
                this.presentToast("Connection Error");
              })
            } else {
              this.timesheetApp.IsDeleted = true;
              this.updateTimesheetService();
            }
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  async submitTimesheetService() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',

    });
    await loading.present();
    this.timesheetApp.Status = "SUBMITTED";
    this.timesheetApp.IsEditable = false;
    this.axService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
      loading.dismiss();
      if (res) {
        this.presentToast("Timesheet Submitted Successfully")
      } else {
        this.presentToast("Server error while submitting timesheet")
      }
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error")
    })
  }
  async updateTimesheetService() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',

    });
    await loading.present();

    this.axService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
      loading.dismiss();
      if (res) {
        this.presentToast("Timesheet Deleted Successfully")
      }
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error")
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  getHrs(timeSheetLine: TimesheetLine) {
    var hrs = timeSheetLine.Hours1 + timeSheetLine.Hours2 + timeSheetLine.Hours3 + timeSheetLine.Hours4 + timeSheetLine.Hours5
      + timeSheetLine.Hours6 + timeSheetLine.Hours7

    return hrs;
  }


  rejectTs() {
    this.approvalAlertConfirmation("Reject Timesheet", "Do you want to reject this timesheet?", "reject");
  }

  approveTs() {
    this.approvalAlertConfirmation("Approve Timesheet", "Do you want to approve this timesheet?", "approve");
  }

  async approvalAlertConfirmation(header, msg, type) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      inputs: [
        {
          name: 'workflowRemarks',
          type: 'text',
          placeholder: 'Workflow Remarks'
        },

      ],
      buttons: [
        {
          text: 'Yes',
          handler: (data) => {
            if (type == "approve") {
              this.timesheetApp.Approved = true;
              this.timesheetApp.ApproveWorker = this.paramService.emp.WorkerId;
              this.approvalStatusServiceCall(data.workflowRemarks,"approve")
            } else {
              this.timesheetApp.Rejected = true;
              this.timesheetApp.RejectWorker = this.paramService.emp.WorkerId;
              this.approvalStatusServiceCall(data.workflowRemarks,"reject");
            }
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }



  async approvalStatusServiceCall(workflowRemarks,type) {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.timesheetApp.WorkflowRemarks = workflowRemarks;
    this.axService.UpdateTSApplicationStatusWorker(this.timesheetApp).subscribe(res => {
      loading.dismiss();
      this.timesheetApp.InApprovalState = true;
      if(type=="approve"){
        this.presentToast("Timesheet Approved");
      }else{
        this.presentToast("Timesheet Rejected");
      }
      
      console.log(res);
    }, error => {
      this.presentToast("Connection Error");
      loading.dismiss();
    })
  }
}
