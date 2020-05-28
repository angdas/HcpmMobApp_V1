import { Component, OnInit, ɵConsole, HostListener, Injector } from '@angular/core';

import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { DocumentRequestLine } from 'src/app/models/Document Request/documentRequestLine.model';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-document-request-add',
  templateUrl: './document-request-add.page.html',
  styleUrls: ['./document-request-add.page.scss'],
})
export class DocumentRequestAddPage extends BasePage implements OnInit {

  public docRequestTypeList: DocumentRequestType[] = [];
  public docReqAddressTypeList: DocumentAddressModel[] = [];

  documentList: DocumentRequestModel[] = [];
  //sub: any;
  //sub1: any;

  newDocReq: DocumentRequestModel = {} as DocumentRequestModel;
  newDocLine: DocumentRequestLine = {} as DocumentRequestLine;

  pageType: any;
  documentLineAdd: boolean;
  dataChangeNotSaved: boolean = false;

  constructor(injector: Injector,
    public router: Router,
    public alertServ: AlertService,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.getDocumentRequestTypeNaddress();
    /*
    this.sub = this.dataService.getDocumentDetailsList$.subscribe(res => {
      this.documentList = res;
    })
    this.sub1 = this.dataService.getDocumentReqLineAdd$.subscribe(res => {
      if (res) {
        this.newDocReq = res;
        this.documentLineAdd = true;
      }
    })*/
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
    this.newDocReq = {} as DocumentRequestModel;
    this.newDocLine = {} as DocumentRequestLine;
    /*
    this.sub.unsubscribe();
    if (this.documentLineAdd) {
      this.sub1.unsubscribe();
      this.newDocReq = {} as DocumentRequestModel;
      this.newDocLine = {} as DocumentRequestLine;
    }*/
  }

  getDocumentRequestTypeNaddress() {
    this.apiService.getDocRequestType().subscribe(res => {
      this.dataSPYService.docRequestTypeList = res;
      this.storageService.setDocRequestTypeList(res);
      this.docRequestTypeList = res;
      console.log(res);
    }, error => {
      this.translate.get(error).subscribe(str => this.showToast(str));
    })

    this.apiService.getDocumentRequestAddress().subscribe(res => {
      this.dataSPYService.docReqAddressTypeList = res;
      this.storageService.setDocReqAddressTypeList(res);
      this.docReqAddressTypeList = res;
      console.log(res);
    }, error => {
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }


  saveDocReq() {
    if (this.validator()) {
      if (this.documentLineAdd) {
        var sameReq = false;
        for (var i = 0; i < this.newDocReq.HRRequestLine.length; i++) {
          if (this.newDocReq.HRRequestLine[i].DocumentRequestTypeCode == this.newDocLine.DocumentRequestTypeCode) {
            this.translate.get('HRREQ_EXIST').subscribe(str => this.showToast(str));
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
        this.newDocReq.DataArea = this.dataSPYService.workerDataArea;
        this.newDocReq.HRRequestLine = [];
        this.newDocReq.HRRequestLine.push(this.newDocLine);
        this.newDocReq.WorkerId = this.dataSPYService.worker.WorkerId;
        this.newDocLine.DataArea = this.dataSPYService.workerDataArea;
        this.updateDocRequest();
      }
    }
  }

  async updateDocRequest() {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.updateDocumentRequest(this.newDocReq).subscribe(res => {      
      console.log(res);
      this.apiService.getDocumentRequest(this.dataSPYService.worker.WorkerId).subscribe(res => {
        console.log(res);
        this.dataSPYService.documentList = res;
        this.storageService.setDocumentList(res);        
        this.documentList = res;
        this.dismissLoadingView();
        this.translate.get('HRREQ_SUBMITTED').subscribe(str => this.showAlert(str));
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request/manager");
        } else {
          this.router.navigateByUrl("document-request");
        }
      }, error => {
        this.dismissLoadingView(); 
        this.translate.get(error).subscribe(str => this.showToast(str));
      })
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  validator() {
    if (!this.newDocLine.DocumentRequestTypeCode) {
      this.translate.get('HRREQ_TYPE_BLANK').subscribe(str => this.showToast(str));
    } else if (!this.newDocLine.DocumentRequestAddressCode) {
      this.translate.get('HRREQ_ADDRESS_BLANK').subscribe(str => this.showToast(str));
    } else {
      return true;
    }
    return false;
  }
}
