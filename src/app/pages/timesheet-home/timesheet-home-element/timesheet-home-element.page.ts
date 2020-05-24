import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { Events } from 'src/app/providers/events/event.service';
import { AlertService } from 'src/app/providers/alert.service';
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
    private alertServ: AlertService,
    public loadingController: LoadingController, public paramService: ParameterService) { }

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
    this.alertServ.AlertConfirmation("Submit Timesheet", "Are you sure you want to submit this timesheet?").subscribe(res => {
      if (res) {
        this.submitTimesheetService();
      }
    })
  }
  async ConfirmationForDelete(header, msg, type, i = null) {
    this.alertServ.AlertConfirmation(header, msg).subscribe(res => {
      if (res) {
        if (type == "line") {
          if (this.timesheetApp.TimesheetLine.length == 1) {
            this.timesheetApp.IsDeleted = true;
          } else {
            this.timesheetApp.TimesheetLine[i].IsDeleted = true;
            this.timesheetApp.TimesheetLine.splice(i, 1);
          }
          this.axService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
            this.alertServ.errorToast("Timesheet Line Deleted");
          }, error => {
            this.alertServ.errorToast("Connection Error");
          })
        } else {
          this.timesheetApp.IsDeleted = true;
          this.updateTimesheetService();
        }
      }
    })

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
        this.alertServ.errorToast("Timesheet Submitted Successfully")
      } else {
        this.alertServ.errorToast("Server error while submitting timesheet")
      }
    }, error => {
      loading.dismiss();
      this.alertServ.errorToast("Connection Error")
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
        this.alertServ.errorToast("Timesheet Deleted Successfully")
      }
    }, error => {
      loading.dismiss();
      this.alertServ.errorToast("Connection Error")
    })
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
    let inputArr = [
      {
        name: 'workflowRemarks',
        type: 'text',
        placeholder: 'Workflow Remarks'
      }
    ];
    this.alertServ.ApprovalAlertConfirmation(header, msg, inputArr).subscribe(res => {
      if (res) {
        if (type == "approve") {
          this.timesheetApp.Approved = true;
          this.timesheetApp.ApproveWorker = this.paramService.emp.WorkerId;
          this.approvalStatusServiceCall(res.workflowRemarks, "approve")
        } else {
          this.timesheetApp.Rejected = true;
          this.timesheetApp.RejectWorker = this.paramService.emp.WorkerId;
          this.approvalStatusServiceCall(res.workflowRemarks, "reject");
        }
      }
    })
  }



  async approvalStatusServiceCall(workflowRemarks, type) {
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
      if (type == "approve") {
        this.alertServ.errorToast("Timesheet Approved");
      } else {
        this.alertServ.errorToast("Timesheet Rejected");
      }

      console.log(res);
    }, error => {
      this.alertServ.errorToast("Connection Error");
      loading.dismiss();
    })
  }
}
