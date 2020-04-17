import { Component, OnInit, Input } from '@angular/core';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

@Component({
  selector: 'document-request-element',
  templateUrl: './document-request-element.page.html',
  styleUrls: ['./document-request-element.page.scss'],
})
export class DocumentRequestElementPage implements OnInit {

  @Input('documentRequest') documentReq: DocumentRequestModel;
  @Input('pageType') pageType: any;

  constructor(public router: Router, public dataService: DataService, public axService: AxService,
    public paramService:ParameterService,
    public alertController: AlertController, public toastController: ToastController, public loadingController: LoadingController) {

  }

  ngOnInit() {
  }

  deleteRequest() {
    this.presentAlertConfirmation("Delete Request", "Do you want to delete this request?", "delete");
  }
  submitRequest() {
    this.presentAlertConfirmation("Submit Request", "Do you want to submit this request?", "submit");
  }

  async deleteRequestCall() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.documentReq.IsDeleted = true;
    this.axService.updateDocumentRequest(this.documentReq).subscribe(res => {
      loading.dismiss();
      this.presentToast("Document Deleted");
    }, error => {
      this.documentReq.IsDeleted = false;
      this.presentToast("Connection Error");
    })
  }

  async submitRequestCall() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.documentReq.IsEditable = false;
    this.documentReq.Status = "SUBMITTED";
    this.axService.updateDocumentRequest(this.documentReq).subscribe(res => {
      loading.dismiss();      
      this.presentToast("Request Submitted successfully");
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }

  async presentAlertConfirmation(header, msg, type) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (type == "delete") {
              this.deleteRequestCall()
            } else {
              this.submitRequestCall();
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
  gotoRequestLinePage() {
    this.dataService.setDocumentDetails(this.documentReq);
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_document_request_line/worker');
    } else {
      this.router.navigateByUrl('document-request-header');
    }
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
              this.approveDocumentReqServiceCall(data.workflowRemarks)
            } else {
              this.rejectDocumentReqServiceCall(data.workflowRemarks);
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
  async approveDocumentReqServiceCall(workflowRemarks) {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();

    this.documentReq.Approved = true;
    this.documentReq.WorkflowRemarks = workflowRemarks;
    this.documentReq.ApproveWorker = this.paramService.emp.WorkerId;
    this.axService.UpdateHRRequestStatus(this.documentReq).subscribe(res => {
      loading.dismiss();
      this.presentToast("Request Approved successfully");
      this.documentReq.InApprovalState = true;
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }


  async rejectDocumentReqServiceCall(workflowRemarks) {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();

    this.documentReq.Rejected = true;
    this.documentReq.WorkflowRemarks = workflowRemarks;
    this.documentReq.RejectWorker = this.paramService.emp.WorkerId;
    this.axService.UpdateHRRequestStatus(this.documentReq).subscribe(res => {
      loading.dismiss();
      this.documentReq.InApprovalState = true;
      this.presentToast("Request Rejected");
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }
  approveRequest() {
    this.approvalAlertConfirmation("Approve Request", "Do you want to approve this Request?", "approve");

  }
  rejectRequest() {
    this.approvalAlertConfirmation("Reject Request", "Do you want to reject this Request?", "reject");
  }
}
