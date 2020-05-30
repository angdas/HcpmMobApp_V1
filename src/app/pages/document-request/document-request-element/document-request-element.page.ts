import { Component, OnInit, Input, Injector } from '@angular/core';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../../base/base.page';

@Component({
  selector: 'document-request-element',
  templateUrl: './document-request-element.page.html',
  styleUrls: ['./document-request-element.page.scss'],
})
export class DocumentRequestElementPage extends BasePage implements OnInit {

  @Input('documentRequest') documentReq: DocumentRequestModel;
  @Input('pageType') pageType: any;

  constructor(injector: Injector,
    public alertService: AlertService) {
      super(injector);
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
    await this.showLoadingView({ showOverlay: true });  
    this.documentReq.IsDeleted = true;
    this.apiService.updateDocumentRequest(this.documentReq).subscribe(res => {
      console.log(res);
      this.dismissLoadingView();   
      this.translate.get('HRREQ_DELETED').subscribe(str => this.showToast(str));  
    }, error => {
      this.documentReq.IsDeleted = false;
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  async submitRequestCall() {
    await this.showLoadingView({ showOverlay: true });  
    this.documentReq.IsEditable = false;
    this.documentReq.Status = "SUBMITTED";
    this.apiService.updateDocumentRequest(this.documentReq).subscribe(res => {
      console.log(res);
      this.dismissLoadingView();  
      this.translate.get('HRREQ_SUBMITTED').subscribe(str => this.showToast(str));  
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  async presentAlertConfirmation(header, msg, type) {
    this.alertService.AlertConfirmation(header, msg).subscribe(res => {
      if (res) {
        if (type == "delete") {
          this.deleteRequestCall()
        } else {
          this.submitRequestCall();
        }
      }
    })
  }

  gotoRequestLinePage() {
    this.dataSPYService.documentReq = this.documentReq;
    //this.dataService.setDocumentDetails(this.documentReq);
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_document_request_line/worker');
    } else {
      this.router.navigateByUrl('document-request-header');
    }
  }

  async approvalAlertConfirmation(header, msg, type) {
    let inputArr = [
      {
        name: 'workflowRemarks',
        type: 'text',
        placeholder: 'Workflow Remarks'
      },
    ];
    this.alertService.ApprovalAlertConfirmation(header, msg,inputArr).subscribe(res => {
      if (res) {
        if (type == "approve") {
          this.approveDocumentReqServiceCall(res.workflowRemarks)
        } else {
          this.rejectDocumentReqServiceCall(res.workflowRemarks);
        }
      }
    })
  }

  async approveDocumentReqServiceCall(workflowRemarks) {
    await this.showLoadingView({ showOverlay: true });  
    this.documentReq.Approved = true;
    this.documentReq.WorkflowRemarks = workflowRemarks;
    this.documentReq.ApproveWorker = this.dataSPYService.worker.WorkerId;
    this.apiService.UpdateHRRequestStatus(this.documentReq).subscribe(res => {
      console.log(res);
      this.documentReq.InApprovalState = true;
      this.dismissLoadingView(); 
      this.translate.get('HRREQ_APPROVED').subscribe(str => this.showToast(str)); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  async rejectDocumentReqServiceCall(workflowRemarks) {
    await this.showLoadingView({ showOverlay: true });  
    this.documentReq.Rejected = true;
    this.documentReq.WorkflowRemarks = workflowRemarks;
    this.documentReq.RejectWorker = this.dataSPYService.worker.WorkerId;
    this.apiService.UpdateHRRequestStatus(this.documentReq).subscribe(res => {
      console.log(res);
      this.documentReq.InApprovalState = true;
      this.dismissLoadingView(); 
      this.translate.get('HRREQ_REJECTED').subscribe(str => this.showToast(str)); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str)); 
    })
  }

  approveRequest() {
    this.approvalAlertConfirmation("Approve Request", "Do you want to approve this Request?", "approve");
  }

  rejectRequest() {
    this.approvalAlertConfirmation("Reject Request", "Do you want to reject this Request?", "reject");
  }

}
