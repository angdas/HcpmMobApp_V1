import { Component, OnInit, ɵConsole, HostListener } from '@angular/core';

import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { DocumentRequestLine } from 'src/app/models/Document Request/documentRequestLine.model';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { LoadingController } from '@ionic/angular';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { AlertService } from 'src/app/providers/alert.service';

@Component({
  selector: 'app-document-request-add',
  templateUrl: './document-request-add.page.html',
  styleUrls: ['./document-request-add.page.scss'],
})
export class DocumentRequestAddPage implements OnInit {

  docRequestTypeList: DocumentRequestType[] = [];
  docReqAddressTypeList: DocumentAddressModel[] = [];

  documentList: DocumentRequestModel[] = [];
  sub: any;
  sub1: any;

  newDocReq: DocumentRequestModel = {} as DocumentRequestModel;
  newDocLine: DocumentRequestLine = {} as DocumentRequestLine;

  pageType: any;
  documentLineAdd: boolean;
  dataChangeNotSaved: boolean = false;

  constructor(public axService: AxService, public dataService: DataService, public paramService: ParameterService, public router: Router,
    public loadingController: LoadingController, public alertServ: AlertService,
    private activateRoute: ActivatedRoute) {

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.getDocumentRequestType();
    this.sub = this.dataService.getDocumentDetailsList$.subscribe(res => {
      this.documentList = res;
    })
    this.sub1 = this.dataService.getDocumentReqLineAdd$.subscribe(res => {
      if (res) {
        this.newDocReq = res;
        this.documentLineAdd = true;
      }
    })
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
      this.alertServ.AlertConfirmation('Warning', 'Changes was not Updated. Sure you want to leave this page?').subscribe(res => {
        ret = res;
      })
    }
    else ret = true;

    return ret;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.documentLineAdd) {
      this.sub1.unsubscribe();
      this.newDocReq = {} as DocumentRequestModel;
      this.newDocLine = {} as DocumentRequestLine;
    }

  }
  getDocumentRequestType() {
    this.axService.getDocRequestType().subscribe(res => {
      this.docRequestTypeList = res;
    }, error => {
      console.log(error)
    })

    this.axService.getDocumentRequestAddress().subscribe(res => {
      this.docReqAddressTypeList = res;
    }, error => {
      console.log(error)
    })
  }


  saveDocReq() {
    if (this.validator()) {
      if (this.documentLineAdd) {

        var sameReq = false;
        for (var i = 0; i < this.newDocReq.HRRequestLine.length; i++) {
          if (this.newDocReq.HRRequestLine[i].DocumentRequestTypeCode == this.newDocLine.DocumentRequestTypeCode) {
            this.alertServ.errorToast("HR request already applied for this type");
            sameReq = true;
            break;
          }
        }
        if (!sameReq) {
          this.newDocReq.HRRequestLine.push(this.newDocLine);
          this.updateDocRequest();
        }
      } else {
        this.newDocReq.Number = 0;
        this.newDocReq.Status = "CREATED";
        this.newDocReq.IsEditable = true;
        this.newDocReq.IsDeleted = false;
        this.newDocReq.Resumed = false;
        this.newDocReq.WorkflowRemarks = "";
        this.newDocReq.Error = false;
        this.newDocReq.ErrorMessage = "";
        this.newDocReq.HRRequestCode = "";
        this.newDocReq.DataArea = this.paramService.dataAreaObj.DataArea;

        this.newDocLine.DataArea = this.paramService.dataAreaObj.DataArea;

        this.newDocReq.HRRequestLine = [];
        this.newDocReq.HRRequestLine.push(this.newDocLine);
        this.newDocReq.WorkerId = this.paramService.emp.WorkerId;
        this.updateDocRequest();
      }

    }
  }

  async updateDocRequest() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.axService.updateDocumentRequest(this.newDocReq).subscribe(res => {
      loading.dismiss();
      console.log(res);
      /* 
        REFRESHING LIST
      
      */
      this.axService.getDocumentRequest(this.paramService.emp.WorkerId).subscribe(res => {
        loading.dismiss();
        this.documentList = res;
        this.dataService.setDocumentDetailsList(this.documentList);

        this.alertServ.AlertMessage("Success", "Document Request Submitted Successfully");
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request/manager");
        } else {
          this.router.navigateByUrl("document-request");
        }
      }, error => {

      })

      /*
              *************DON'T DELETE THIS***********************

      */
      //this.documentList.push(this.newDocReq);
      //this.dataService.setDocumentDetailsList(this.documentList);

    }, error => {
      loading.dismiss();
      this.alertServ.errorToast("Connection Error");
    })
  }

  validator() {
    if (!this.newDocLine.DocumentRequestTypeCode) {
      this.alertServ.errorToast("Document Request Type Cann't be blank");
    } else if (!this.newDocLine.DocumentRequestAddressCode) {
      this.alertServ.errorToast("Document Address Type Cann't be blank");
    } else {
      return true;
    }
    return false;
  }
}
