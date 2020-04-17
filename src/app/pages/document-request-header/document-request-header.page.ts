import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/providers/dataService/data.service';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AlertController } from '@ionic/angular';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';

@Component({
  selector: 'app-document-request-header',
  templateUrl: './document-request-header.page.html',
  styleUrls: ['./document-request-header.page.scss'],
})
export class DocumentRequestHeaderPage implements OnInit {
  documentReq: DocumentRequestModel = {} as DocumentRequestModel;
  sub: any;
  editable: boolean;
  pageType: any;
  colorList: any = [];

  constructor(public dataService: DataService, public axService: AxService, public router: Router, private activateRoute: ActivatedRoute,
    public alertController: AlertController, public paramService: ParameterService, ) {

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
    this.colorList = this.paramService.colorList;
  }


  ngOnInit() {
    this.sub = this.dataService.getDocumentDetails$.subscribe(res => {
      this.documentReq = res;
      this.editable = this.documentReq.IsEditable;
    })
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editRequestLine(){
    this.dataService.setDocumentDetails(this.documentReq);
    if (this.pageType == 'worker') {
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_document_request_line/worker');
    } else {
      this.router.navigateByUrl('document-request-line');
    }
  }

  addRequestLine() {
    this.dataService.setDocumentReqLineAddDetails(this.documentReq);
    if(this.pageType == 'manager'){
      this.router.navigateByUrl('/tab/tabs/manager-profile/manager_document_request_add/manager');
    }else{
      this.router.navigateByUrl("document-request-add");
    }
  }
}
