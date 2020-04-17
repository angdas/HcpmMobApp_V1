import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { ParameterService } from './providers/parameterService/parameter.service';
import { StorageService } from './providers/storageService/storage.service';
import { AxService } from './providers/axservice/ax.service';
import { MenuController } from '@ionic/angular';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { EmployeeModel } from './models/worker/worker.interface';
import { DataService } from './providers/dataService/data.service';
import { Events } from './providers/events/event.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public selectedIndex = 0;

  authenticated: boolean = false;
  emp: EmployeeModel = {} as EmployeeModel;


  constructor(public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen, private storageService: StorageService, private menuCtrl: MenuController,
    public alertCtrl: AlertController,
    private statusBar: StatusBar, private parameterservice: ParameterService, public loadingController: LoadingController,
    public events: Events, public axService: AxService, public alertController: AlertController, public dataService: DataService
  ) {
    this.initializeApp();
    this.initializeStorageVariables();

    this.events.subscribe("authenticated", res => {
     
        this.authenticated = res;
      
    })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString('#283679');
    });
    this.checkDarkTheme();
  }

  checkDarkTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
    }
  }



  openPage(page) {
    if (page != '' && page) {
      this.router.navigateByUrl(page)
    } else {
      this.logout();
    }
  }

  async logout() {
    const confirm = await this.alertCtrl.create({
      header: "Logout",
      message: "Sure you want to logout?",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.events.publish('authenticated', false);
            this.parameterservice.authenticated = false;
            this.authenticated = false;
            this.storageService.clearStorage();
            this.storageService.setEmail("");
            this.router.navigateByUrl("/login");
          }
        }
      ]
    });
    confirm.present();
  }

  async initializeStorageVariables() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.storageService.getAllValuesFromStorage.subscribe((data) => { }, (error) => { loading.dismiss(); console.log(error) },
      () => {
        loading.dismiss();
        console.log(this.parameterservice)
        if (!this.parameterservice.baseUrl) {
          this.presentErrorAlert("Please configure your environment");
          this.router.navigateByUrl("/settings");
        } else {
          if (this.parameterservice.authenticated) {
            this.axService.getWorkerDetails(this.parameterservice.email).subscribe(res => {
              this.emp = res;
              this.dataService.setMyDetails(this.emp);
              this.storageService.setUserDetails(this.emp);

              this.storageService.setIsManager(this.emp.IsManager);
              this.events.publish('authenticated', true);
              this.events.publish("isManager", this.emp.IsManager);

              if (this.emp.IsManager) {
                this.router.navigateByUrl("/tab/tabs/manager-profile");
              } else {
                this.router.navigateByUrl("/myprofile")
              }

            }, error => {
              this.presentErrorAlert("Error Connecting To Server, Please Login Again");
              this.router.navigateByUrl("/login");
            })
          } else {
            this.events.publish('authenticated', false);
            this.router.navigateByUrl("/login");
          }
          //this.setMenuItems();
        }

      });
  }

  async presentErrorAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
