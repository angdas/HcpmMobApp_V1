import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-document-request',
  templateUrl: './document-request.page.html',
  styleUrls: ['./document-request.page.scss'],
})
export class DocumentRequestPage extends BasePage implements OnInit {

  public selectedTab = 'all';
  public pageType: any;
  public documentList: DocumentRequestModel[] = [];
  public workerDocumentList: DocumentRequestModel[] = [];

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    if (this.pageType == "worker") {
      this.GetMyWorkersDocRequest();
    } else {
      this.getDocumentRequest();
    }
  }

  ionViewWillEnter() {
    this.documentList = this.dataSPYService.documentList;
    this.workerDocumentList = this.dataSPYService.myWorkerDocumentList;
  }

  async GetMyWorkersDocRequest(){
    await this.showLoadingView({ showOverlay: true }); 
    this.apiService.GetMyWorkersDocRequest(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.myWorkerDocumentList = res;
      this.storageService.setMyWorkerDocumentList(res);
      this.workerDocumentList = res;      
      this.dismissLoadingView(); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  async getDocumentRequest() {
    await this.showLoadingView({ showOverlay: true }); 
    this.apiService.getDocumentRequest(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.documentList = res;
      this.storageService.setDocumentList(res);
      this.documentList = res;
      this.dismissLoadingView(); 
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  addRequest() {
    if(this.pageType == "manager"){
      this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request_add/manager");
    }else{
      this.router.navigateByUrl("document-request-add");
    } 
  }

  doRefresh(event) {
    setTimeout(() => {
      if(this.pageType=='worker'){
        this.GetMyWorkersDocRequest();
      }else{
        this.getDocumentRequest();        
      }    
      event.target.complete();
    }, 2000);
  }
}
