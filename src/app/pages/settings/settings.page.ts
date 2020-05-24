import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController, IonInput } from '@ionic/angular';

import { StorageService } from 'src/app/providers/storageService/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AxService } from 'src/app/providers/axservice/ax.service';

import { LoadingController } from '@ionic/angular';
import { ClientConfigModel } from 'src/app/models/ClientConfig.model';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Events } from 'src/app/providers/events/event.service';
import { WorkerEmployementModel } from 'src/app/models/worker/WorkerEmployement.model';
import { AlertService } from 'src/app/providers/alert.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild('clientId', { static: false }) clientIdInput: IonInput;
  clientConfig: ClientConfigModel = {} as ClientConfigModel;
  workerEmployementList: WorkerEmployementModel[] = [];
  dataAreaObj:WorkerEmployementModel = {} as WorkerEmployementModel;

  versionNumber: any;

  toggle: any;
  prefersDark: any;
  authenticated: boolean;
  constructor(public paramServ: ParameterService, public router: Router, private storageService: StorageService, 
    public axService: AxService,
    public events: Events, private appVersion: AppVersion,
    public loadingController: LoadingController, private menuCtrl: MenuController,public alertServ:AlertService) {
    this.menuCtrl.enable(false);

    this.appVersion.getVersionNumber().then(res => {
      this.versionNumber = res;
    })

    this.events.subscribe("authenticated", res => {
      this.authenticated = res;
    })
  }

  ngOnInit() {
    this.clientConfig.instance = "LIVE";
    if (this.paramServ.clientConfig) {
      this.clientConfig = this.paramServ.clientConfig;
    }
  }
  ionViewWillEnter() {
    this.authenticated = this.paramServ.authenticated;
    if(this.authenticated){
      this.workerEmployementList = this.paramServ.workerEmpList;
      this.dataAreaObj = this.paramServ.dataAreaObj;
    }else{
      this.clientIdInput.setFocus();
    }
  }

  async getClientUrl() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      message: 'Please wait...',
    });
    await loading.present();

    this.axService.GetClientConfig(this.clientConfig).subscribe((res: ClientConfigModel) => {
      loading.dismiss();
      if (!res.api) {
        this.alertServ.AlertMessage("Error",res)
      } else {
        this.storageService.setClientConfig(this.clientConfig);
        this.axService.baseAddress = res.api;
        this.storageService.setURL(res.api);

        this.axService.getERPconfig().subscribe(res => {
          console.log(res);
          this.storageService.setCompanyLogo(res.CompanyLogo);
          this.paramServ.companyLogo = res.CompanyLogo;
          this.router.navigateByUrl("/login");
        })
      }
    }, error => {
      loading.dismiss();

    })
  }

  legalEntityChanged(){
    console.log(this.dataAreaObj)
    this.storageService.setDataArea(this.dataAreaObj);
    this.alertServ.AlertMessage("Success","Legal Entity Changed");
  }
}
