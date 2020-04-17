import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController, IonInput } from '@ionic/angular';

import { StorageService } from 'src/app/providers/storageService/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AxService } from 'src/app/providers/axservice/ax.service';

import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ClientConfigModel } from 'src/app/models/ClientConfig.model';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Events } from 'src/app/providers/events/event.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild('clientId', { static: false }) clientIdInput: IonInput;
  clientConfig: ClientConfigModel = {} as ClientConfigModel;

  versionNumber: any;

  toggle: any;
  prefersDark: any;
  authenticated: boolean;
  constructor(public paramServ: ParameterService, public router: Router, private storageService: StorageService, public axService: AxService,
    public events: Events, public alertController: AlertController, private activateRoute: ActivatedRoute, private appVersion: AppVersion,
    public loadingController: LoadingController, private menuCtrl: MenuController) {
    this.menuCtrl.enable(false);

    this.appVersion.getVersionNumber().then(res => {
      this.versionNumber = res;
    })

    this.events.subscribe("authenticated", res => {
      this.authenticated = res;
    })
  }

  ngOnInit() {
    if (this.paramServ.clientConfig)
      this.clientConfig = this.paramServ.clientConfig;

      console.log(this.clientConfig)
  }
  ionViewWillEnter() {
    this.clientIdInput.setFocus();
  }

  async getClientUrl() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();

    this.axService.GetClientConfig(this.clientConfig).subscribe((res: ClientConfigModel) => {
      console.log(res);
      loading.dismiss();
      if (!res.api) {
        this.presentAlert(res)
      } else {
        this.storageService.setClientConfig(this.clientConfig);
        this.axService.baseAddress = res.api;
        this.storageService.setURL(res.api);
        this.router.navigateByUrl("/login");
      }
    }, error => {
      loading.dismiss();

    })
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: "Error",
      message: msg,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
