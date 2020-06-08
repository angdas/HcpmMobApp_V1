import { Component, OnInit, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/providers/dataService/data.service';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { LoadingController } from '@ionic/angular';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../../base/base.page';
@Component({
  selector: 'leave-home-element',
  templateUrl: './leave-home-element.page.html',
  styleUrls: ['./leave-home-element.page.scss'],
})
export class LeaveHomeElementPage extends BasePage implements OnInit {

  @Input('leaveApp') leaveApp: LeaveAppTableContract;
  @Input('pageType') pageType: any;

  visible: boolean = false;
  constructor(injector: Injector,
    public loadingController: LoadingController,
    private alertService: AlertService) { 
      super(injector);
    }

  ngOnInit() {

  }

  toggleCard() {
    this.visible = !this.visible;
  }

  gotoLinePage(leaveDetails) {
    //this.dataService.setLeaveLineDetails(leaveDetails);
    this.dataSPYService.leaveApp = leaveDetails;
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    } else {
      this.router.navigateByUrl('leave-line');
    }
  }

  resumtion() {
    this.leaveApp.ResumptionInitiated = true;
    //this.dataService.setLeaveEditDetails(this.leaveApp);
    this.dataSPYService.leaveApp = this.leaveApp;
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    } else {
      this.router.navigateByUrl('leave-edit');
    }
  }

  gotoEditPage(leaveDetails) {
    //this.dataService.setLeaveEditDetails(leaveDetails);
    this.dataSPYService.leaveApp = leaveDetails;
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    } else {
      this.router.navigateByUrl('leave-edit');
    }
  }

  deleteLine(i) {
    this.presentAlertConfirmation("Delete Leave", "Are you sure you want to delete this leave line?", "deleteLine", i);
  }

  deleteLeave() {
    this.presentAlertConfirmation("Delete Leave", "Are you sure you want to delete this leave?", "delete");
  }
  submitLeave() {
    this.presentAlertConfirmation("Submit Leave", "Are you sure you want to submit this leave?", "submit");
  }

  async deleteLeaveCall() {
    this.leaveApp.IsDeleted = true;
    await this.showLoadingView({ showOverlay: true });    
    this.apiService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.translate.get('LEAVE_DELETED').subscribe(str => this.showToast(str));
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  async submitLeaveCall() {
    await this.showLoadingView({ showOverlay: true });    
    this.leaveApp.Status = "SUBMITTED";
    this.leaveApp.IsEditable = false;
    this.apiService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.translate.get('LEAVE_SUBMITTED').subscribe(str => this.showToast(str));
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  async presentAlertConfirmation(header, msg, type, i = null) {
    this.alertService.AlertConfirmation(header, msg).subscribe(async res => {
      if (res) {
        if (type == "deleteLine") {
          if (this.leaveApp.LeaveApplicationLine.length == 1) {
            this.leaveApp.IsDeleted = true;
          } else {
            this.leaveApp.LeaveApplicationLine.splice(i, 1);
          }
          console.log(this.leaveApp)
          await this.showLoadingView({ showOverlay: true });  
          this.apiService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
            this.dismissLoadingView(); 
            this.translate.get('LEAVE_LINE_DELETED').subscribe(str => this.showToast(str));
          }, error => {
            this.dismissLoadingView(); 
            this.translate.get(error).subscribe(str => this.showToast(str));
          })
        } else if (type == "delete") {
          this.deleteLeaveCall();
        } else {
          this.submitLeaveCall();
        }
      }
    })
  }

  async approvalAlertConfirmation(header, msg, type) {
    let inputArr = [
      {
        name: 'workflowRemarks',
        type: 'text',
        placeholder: 'Workflow Remarks'
      },
    ];
    this.alertService.ApprovalAlertConfirmation(header, msg, inputArr).subscribe(res => {
      if (res) {
        if (type == "approve") {
          this.approveLeaveServiceCall(res.workflowRemarks)
        } else {
          this.rejectLeaveServiceCall(res.workflowRemarks);
        }
      }
    })
  }

  async approveLeaveServiceCall(workflowRemarks) {
    await this.showLoadingView({ showOverlay: true }); 
    this.leaveApp.Approved = true;
    this.leaveApp.WorkflowRemarks = workflowRemarks;
    this.leaveApp.ApproveWorker = this.dataSPYService.worker.WorkerId;
    this.apiService.UpdateLeaveApplicationStatusWorker(this.leaveApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.leaveApp.InApprovalState = true;
      this.translate.get('LEAVE_APPROVED').subscribe(str => this.showToast(str));
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  async rejectLeaveServiceCall(workflowRemarks) {
    await this.showLoadingView({ showOverlay: true }); 
    this.leaveApp.Rejected = true;
    this.leaveApp.WorkflowRemarks = workflowRemarks;
    this.leaveApp.RejectWorker = this.dataSPYService.worker.WorkerId;
    this.apiService.UpdateLeaveApplicationStatusWorker(this.leaveApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.leaveApp.InApprovalState = true;
      this.translate.get('LEAVE_REJECTED').subscribe(str => this.showToast(str));
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  approveLeave() {
    this.approvalAlertConfirmation("Approve Leave", "Do you want to approve this leave?", "approve");
  }

  rejectLeave() {
    this.approvalAlertConfirmation("Reject Leave", "Do you want to reject this leave?", "reject");
  }

  colorRed(){
    return "color-red";
  }

}
