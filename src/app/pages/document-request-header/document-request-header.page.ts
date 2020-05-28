import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-document-request-header',
  templateUrl: './document-request-header.page.html',
  styleUrls: ['./document-request-header.page.scss'],
})
export class DocumentRequestHeaderPage extends BasePage implements OnInit {
  
  documentReq: DocumentRequestModel = {} as DocumentRequestModel;
  sub: any;
  editable: boolean;
  pageType: any;
  colorList: any = [];

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
      this.colorList = this.dataSPYService.colorList;
  }


  ngOnInit() {
    /*
    this.sub = this.dataService.getDocumentDetails$.subscribe(res => {
      this.documentReq = res;
      this.editable = this.documentReq.IsEditable;
    })*/
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editRequestLine(){

    //this.dataService.setDocumentDetails(this.documentReq);
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_document_request_line/worker');
    } else {
      this.router.navigateByUrl('document-request-line');
    }
  }

  addRequestLine() {
    
    //this.dataService.setDocumentReqLineAddDetails(this.documentReq);
    if (this.pageType == 'manager'){
      this.router.navigateByUrl('/tab/tabs/manager-profile/manager_document_request_add/manager');
    } else {
      this.router.navigateByUrl("document-request-add");
    }
  }
}
