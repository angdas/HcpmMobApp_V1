import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/providers/dataService/data.service';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
@Component({
  selector: 'leave-home-element',
  templateUrl: './leave-home-element.page.html',
  styleUrls: ['./leave-home-element.page.scss'],
})
export class LeaveHomeElementPage implements OnInit {

  @Input('leaveApp') leaveApp: LeaveAppTableContract;
  @Input('pageType') pageType: any;

  visible: boolean = false;
  constructor(public router: Router, public dataService: DataService, public axService: AxService,
    public paramService:ParameterService,
    public alertController: AlertController, public toastController: ToastController, public loadingController: LoadingController) { }

  ngOnInit() {

  }

  toggleCard() {
    this.visible = !this.visible;
  }
  gotoLinePage(leaveDetails) {
    this.dataService.setLeaveLineDetails(leaveDetails);

    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    } else {
      this.router.navigateByUrl('leave-line');
    }
  }

  resumtion() {
    this.leaveApp.ResumptionInitiated = true;
    this.dataService.setLeaveEditDetails(this.leaveApp);
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    } else {
      this.router.navigateByUrl('leave-edit');
    }
  }
  gotoEditPage(leaveDetails) {
    this.dataService.setLeaveEditDetails(leaveDetails);

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
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.axService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
      loading.dismiss();
      this.presentToast("Leave Deleted");
    }, error => {

      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }

  async submitLeaveCall() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.leaveApp.Status = "SUBMITTED";
    this.leaveApp.IsEditable = false;
    this.axService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
      loading.dismiss();
      this.presentToast("Leave Submitted");
    }, error => {
      this.presentToast("Connection Error");
    })
  }

  async presentAlertConfirmation(header, msg, type, i = null) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (type == "deleteLine") {
              if (this.leaveApp.LeaveApplicationLine.length == 1) {
                this.leaveApp.IsDeleted = true;
              } else {
                this.leaveApp.LeaveApplicationLine.splice(i, 1);
              }

              console.log(this.leaveApp)
              this.axService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
                this.presentToast("Leave Line Deleted");
              }, error => {
                this.presentToast("Connection Error");
              })

            } else if (type == "delete") {
              this.deleteLeaveCall();
            } else {
              this.submitLeaveCall();
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
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
              this.approveLeaveServiceCall(data.workflowRemarks)
            } else {
              this.rejectLeaveServiceCall(data.workflowRemarks);
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

  async approveLeaveServiceCall(workflowRemarks) {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.leaveApp.Approved = true;
    this.leaveApp.WorkflowRemarks = workflowRemarks;
    this.leaveApp.ApproveWorker = this.paramService.emp.WorkerId;
    this.axService.UpdateLeaveApplicationStatusWorker(this.leaveApp).subscribe(res => {
      loading.dismiss();
      this.leaveApp.InApprovalState = true;
      this.presentToast("Leave Approved successfully");
    }, error => {
      this.presentToast("Connection Error");
      loading.dismiss();
    })
  }
  async rejectLeaveServiceCall(workflowRemarks) {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.leaveApp.Rejected = true;
    this.leaveApp.WorkflowRemarks = workflowRemarks;
    this.leaveApp.RejectWorker = this.paramService.emp.WorkerId;
    this.axService.UpdateLeaveApplicationStatusWorker(this.leaveApp).subscribe(res => {
      loading.dismiss();
      this.leaveApp.InApprovalState = true;
      this.presentToast("Leave Rejected");
      console.log(res);
    }, error => {
      this.presentToast("Connection Error");
      loading.dismiss();
    })
  }
  approveLeave() {
    this.approvalAlertConfirmation("Approve Leave", "Do you want to approve this leave?", "approve");

  }
  rejectLeave() {
    this.approvalAlertConfirmation("Reject Leave", "Do you want to reject this leave?", "reject");
  }

}
