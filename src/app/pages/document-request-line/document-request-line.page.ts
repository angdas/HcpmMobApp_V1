import { Component, OnInit, HostListener } from '@angular/core';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';

import { Router, ActivatedRoute } from '@angular/router';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/providers/alert.service';
@Component({
  selector: 'app-document-request-line',
  templateUrl: './document-request-line.page.html',
  styleUrls: ['./document-request-line.page.scss'],
})
export class DocumentRequestLinePage implements OnInit {

  documentApp: DocumentRequestModel = {} as DocumentRequestModel;
  sub: any;
  pageType: any;

  docRequestTypeList: DocumentRequestType[] = [];
  docReqAddressTypeList: DocumentAddressModel[] = [];
  dataChangeNotSaved: boolean = false;

  constructor(public axService: AxService, public dataService: DataService, private activateRoute: ActivatedRoute, public router: Router,
    public loadingController: LoadingController, public alertServ: AlertService) {

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.getRequestType();
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

  ionViewWillEnter() {
    this.getServiceData();
  }

  getServiceData() {
    this.sub = this.dataService.getDocumentDetails$.subscribe(res => {
      this.documentApp = res;
    })
  }

  getRequestType() {
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


  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  async saveDoc() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.axService.updateDocumentRequest(this.documentApp).subscribe(res => {
      loading.dismiss();
      console.log(res);

      this.alertServ.AlertMessage("Success", "Document request updated successfully")
      if (this.pageType == "manager") {
        this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request/manager");
      } else {
        this.router.navigateByUrl("document-request");
      }
    }, error => {
      loading.dismiss();
      this.alertServ.errorToast("Connection Error");
    })
  }
}
