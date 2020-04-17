import { Component, OnInit } from '@angular/core';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/providers/dataService/data.service';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { ToastController,LoadingController } from '@ionic/angular';
import { Events } from 'src/app/providers/events/event.service';
@Component({
  selector: 'app-document-request',
  templateUrl: './document-request.page.html',
  styleUrls: ['./document-request.page.scss'],
})
export class DocumentRequestPage implements OnInit {

  selectedTab = 'all';

  authenticated: boolean;
  pageType: any;
  documentList: DocumentRequestModel[] = [];
  workerDocumentList: DocumentRequestModel[] = [];

  constructor(public axService: AxService, public router: Router, public dataService: DataService,
    public paramService: ParameterService, public events: Events, public storageServ: StorageService,
    private activateRoute: ActivatedRoute, public loadingController: LoadingController,
    public toastController: ToastController) {


    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');

    this.events.subscribe("authenticated", res => {
      if (res) {
        this.authenticated = true;
      } else {
        this.authenticated = false;

        paramService.authenticated = false;
        storageServ.clearStorage();
        router.navigateByUrl("/home");
      }
    })
  }

  ngOnInit() {
    if (this.pageType == "worker") {
      this.GetMyWorkersDocRequest();
    } else {
      this.getDocumentRequest();
    }

  }
  ionViewWillEnter() {
    this.dataService.getDocumentDetailsList$.subscribe(res => {
      if (res) {
        this.documentList = res;
      }
    })
  }
  async GetMyWorkersDocRequest(){
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      duration: 4000
    });
    await loading.present();

    this.axService.GetMyWorkersDocRequest(this.paramService.emp.WorkerId).subscribe(res => {
      loading.dismiss();
      this.workerDocumentList = res;
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }
  async getDocumentRequest() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      duration: 4000
    });
    await loading.present();

    this.axService.getDocumentRequest(this.paramService.emp.WorkerId).subscribe(res => {
      loading.dismiss();
      this.documentList = res;
      this.dataService.setDocumentDetailsList(this.documentList);
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
