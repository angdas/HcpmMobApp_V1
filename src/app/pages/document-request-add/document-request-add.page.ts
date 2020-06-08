import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  public documentList: DocumentRequestModel[] = [];
  public newDocReq: DocumentRequestModel = {} as DocumentRequestModel;
  public newDocLine: DocumentRequestLine = {} as DocumentRequestLine;
  public pageType: any;
  public documentLineAdd: boolean;
  public dataChangeNotSaved: boolean = false;

  constructor(injector: Injector,
    public router: Router,
    public alertServ: AlertService,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.getDocumentRequestTypeNaddress();
    this.documentList = this.dataSPYService.documentList;
    //this.newDocReq = this.dataSPYService.documentReq;
    //this.documentLineAdd = true;
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
      this.alertServ.AlertConfirmation('Warning', 'Changes are not Updated. Are you sure, you want to leave this page?').subscribe(res => {
        ret = res;
        if(ret) {
          this.updateDocRequest();
        }
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

  async getDocumentRequestTypeNaddress() {
    await this.showLoadingView({ showOverlay: true });  
    this.apiService.getDocRequestType().subscribe(res => {
      console.log(res);
      this.dataSPYService.docRequestTypeList = res;
      this.storageService.setDocRequestTypeList(res);
      this.docRequestTypeList = res;
      this.apiService.getDocumentRequestAddress().subscribe(res => {
        console.log(res);
        this.dataSPYService.docReqAddressTypeList = res;
        this.storageService.setDocReqAddressTypeList(res);
        this.docReqAddressTypeList = res;    
        this.dismissLoadingView();   
      }, error => {
        this.dismissLoadingView(); 
        this.translate.get(error).subscribe(str => this.showToast(str)); 
      })
    }, error => {
      this.dismissLoadingView(); 
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
        this.dataChangeNotSaved = false;
        this.dismissLoadingView();
        this.translate.get('HRREQ_CREATED').subscribe(str => this.showToast(str));
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
