import { Component, OnInit, HostListener } from '@angular/core';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';

import { Router, ActivatedRoute } from '@angular/router';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
    public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) {

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
    if (this.dataChangeNotSaved) {
      return this.presentAlertMessage();
    } else {
      return true;
    }
  }

  presentAlertMessage() {
    let result = Observable.create(async (observer) => {
      const alert = await this.alertController.create({
        header: 'Warning',
        message: 'Changes was not Updated. Sure you want to leave this page?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              observer.next(true);
            }

          },
          {
            text: 'No',
            handler: () => {
              observer.next(false)
            }
          }
        ]
      });
      alert.present();
    })

    return result.pipe(map(res => res));
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

      this.presentAlert("Success", "Document request updated successfully").then(() => {
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_document_request/manager");
        } else {
          this.router.navigateByUrl("document-request");
        }
      })
    }, error => {
      loading.dismiss();
      this.errorToast("Connection Error");
    })
  }
  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    return await alert.present();
  }

  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
