import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { ActivatedRoute } from '@angular/router';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-document-request-line',
  templateUrl: './document-request-line.page.html',
  styleUrls: ['./document-request-line.page.scss'],
})
export class DocumentRequestLinePage extends BasePage implements OnInit {

  public documentApp: DocumentRequestModel = {} as DocumentRequestModel;
  public pageType: any;
  public docRequestTypeList: DocumentRequestType[] = [];
  public docReqAddressTypeList: DocumentAddressModel[] = [];
  public dataChangeNotSaved: boolean = false;

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute, 
    public alertService: AlertService) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.getRequestTypeNAddress();
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
      this.alertService.AlertConfirmation('Warning', 'Changes are not Updated. Are you sure, you want to leave this page?').subscribe(res => {
        ret = res;
        if(ret) {
          this.updateDocRequest();
        }
      })
    }
    else ret = true;
    return ret;
  }

  ionViewWillEnter() {
    this.documentApp = this.dataSPYService.documentReq;
    //this.getServiceData();
  }

  /*
  getServiceData() {
    this.sub = this.dataService.getDocumentDetails$.subscribe(res => {
      this.documentApp = res;
    })
  }*/

  async getRequestTypeNAddress() {
    await this.showLoadingView({ showOverlay: true });    
    this.apiService.getDocRequestType().subscribe(res => {
      console.log(res)
      this.dataSPYService.docRequestTypeList = res;
      this.storageService.setDocRequestTypeList(res);
      this.docRequestTypeList = res;
      this.apiService.getDocumentRequestAddress().subscribe(res => {
        console.log(res)
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

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  async updateDocRequest() {
    await this.showLoadingView({ showOverlay: true });   
    this.apiService.updateDocumentRequest(this.documentApp).subscribe(res => {
      console.log(res);
      this.dismissLoadingView(); 
      this.dataChangeNotSaved = false;
      this.translate.get('HRREQ_UPDATED').subscribe(str => this.showToast(str));
      if (this.pageType == "manager") {
        this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request/manager");
      } else {
        this.router.navigateByUrl("document-request");
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));   
    })
  }
}
