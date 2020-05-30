import { Component, OnInit, Input, ChangeDetectionStrategy, Injector } from '@angular/core';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { TimesheetLine } from 'src/app/models/timesheet/tsLineListContact.interface';
import { Events } from 'src/app/providers/events/event.service';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../../base/base.page';

@Component({
  selector: 'timesheet-home-element',
  templateUrl: './timesheet-home-element.page.html',
  styleUrls: ['./timesheet-home-element.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetHomeElementPage extends BasePage implements OnInit {

  @Input('timesheetApp') timesheetApp: TimesheetTableContact;
  @Input('pageType') pageType: any;
  constructor(injector: Injector, 
    public events: Events,
    private alertService: AlertService) { 
      super(injector);
    }

  ngOnInit() {
    this.events.subscribe('timesheetUpdated', (res) => {
      this.timesheetApp = this.dataSPYService.timesheet;
      /*
      this.dataService.getTimesheetHeader$.subscribe(res => {
        console.log(res);
        this.timesheetApp = res;
      });*/
    })
  }

  gotoHeaderPage() {
    this.dataSPYService.timesheet = this.timesheetApp;
    //this.dataService.setTimesheetHeader(this.timesheetApp);
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
    this.alertService.AlertConfirmation("Submit Timesheet", "Are you sure you want to submit this timesheet?").subscribe(res => {
      if (res) {
        this.submitTimesheetService();
      }
    })
  }

  async ConfirmationForDelete(header, msg, type, i = null) {
    this.alertService.AlertConfirmation(header, msg).subscribe(async res => {
      if (res) {
        if (type == "line") {
          await this.showLoadingView({ showOverlay: true });  
          if (this.timesheetApp.TimesheetLine.length == 1) {
            this.timesheetApp.IsDeleted = true;
          } else {
            this.timesheetApp.TimesheetLine[i].IsDeleted = true;
            this.timesheetApp.TimesheetLine.splice(i, 1);
          }
          this.apiService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
            console.log(res);
            this.dismissLoadingView(); 
            this.translate.get('TS_LINE_DELETED').subscribe(str => this.showToast(str)); 
          }, error => {
            this.dismissLoadingView(); 
            this.translate.get(error).subscribe(str => this.showToast(str)); 
          })
        } else {
          this.timesheetApp.IsDeleted = true;
          this.updateTimesheetService();
        }
      }
    })
  }

  async submitTimesheetService() {
    await this.showLoadingView({ showOverlay: true });  
    this.timesheetApp.Status = "SUBMITTED";
    this.timesheetApp.IsEditable = false;
    this.apiService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      if (res) {
        this.translate.get('TS_SUBMITTED').subscribe(str => this.showToast(str)); 
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }
  
  async updateTimesheetService() {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.updateWorkerTimesheet(this.timesheetApp).subscribe(res => {
      this.dismissLoadingView(); 
      if (res) {
        this.translate.get('TS_DELETED').subscribe(str => this.showToast(str)); 
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  getHrs(timeSheetLine: TimesheetLine) {
    var hrs = timeSheetLine.Hours1 + timeSheetLine.Hours2 + timeSheetLine.Hours3 + timeSheetLine.Hours4 + timeSheetLine.Hours5
      + timeSheetLine.Hours6 + timeSheetLine.Hours7;
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
    this.alertService.ApprovalAlertConfirmation(header, msg, inputArr).subscribe(res => {
      if (res) {
        if (type == "approve") {
          this.timesheetApp.Approved = true;
          this.timesheetApp.ApproveWorker = this.dataSPYService.worker.WorkerId;
          this.approvalStatusServiceCall(res.workflowRemarks, "approve")
        } else {
          this.timesheetApp.Rejected = true;
          this.timesheetApp.RejectWorker = this.dataSPYService.worker.WorkerId;
          this.approvalStatusServiceCall(res.workflowRemarks, "reject");
        }
      }
    })
  }

  async approvalStatusServiceCall(workflowRemarks, type) {
    await this.showLoadingView({ showOverlay: true });  
    this.timesheetApp.WorkflowRemarks = workflowRemarks;
    this.apiService.UpdateTSApplicationStatusWorker(this.timesheetApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.timesheetApp.InApprovalState = true;
      if (type == "approve") {
        this.translate.get('TS_APPROVED').subscribe(str => this.showToast(str)); 
      } else {
        this.translate.get('TS_REJECTED').subscribe(str => this.showToast(str)); 
      }      
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }
}
