import { Component } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { StorageService } from './providers/storageService/storage.service';
import { AxService } from './providers/axservice/ax.service';
import { LoadingController } from '@ionic/angular';
import { EmployeeModel } from './models/worker/worker.interface';
import { DataService } from './providers/dataService/data.service';
import { Events } from './providers/events/event.service';
import { LoginModel } from './models/login.model';
import { DataSPYService } from './services/data.spy.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //---New----
  private loader = null;
  //--------
  public selectedIndex = 0;

  constructor(public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storageService: StorageService,
    private statusBar: StatusBar,
    public loadingController: LoadingController,
    public events: Events,
    public axService: AxService,
    public dataService: DataService,
    private dataSPYService: DataSPYService,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    this.initializeApp();

    this.platform.backButton.subscribeWithPriority(9999, () => {
      console.log("backbutton")
    });
  }

  initializeApp() {
    //----New----
    this.setupEvents();
    this.initializeAppData();
    //---------
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

  //-----------New--------------
  async initializeAppData() {
    await this.showLoadingView();
    this.initializeStorage();
    this.dismissLoadingView();
  }

  async initializeStorage() {
    this.storageService.getIsAuthenticated().then(res => {
      if (res == true) {
        this.dataSPYService.isAuthenticated = res;
        this.storageService.getUser().then(resUser => {
          this.dataSPYService.user = resUser;
        });
        this.storageService.getWorkerDataArea().then(resDataArea => {
          this.dataSPYService.workerDataArea = resDataArea;
        });
        this.storageService.getWorker().then(resWorker => {
          if (resWorker == null) {
            this.goTo('/settingsspy');
          } else {
            this.dataSPYService.worker = resWorker;
            if (this.dataSPYService.worker.IsManager == true) {
              this.goTo('/tab/tabs/manager-profile');
            } else {
              this.goTo('/myprofile');
            }
          }
        });
        this.storageService.getLeaveBalance().then(resLeaveBalance => {
          this.dataSPYService.leaveBalance = resLeaveBalance;
        })
      } else {
        this.dataSPYService.isAuthenticated = false;
        this.goTo('/settingsspy')
      }

      this.storageService.getClientConfiguration().then(resConfig => {
        this.dataSPYService.clientconfig = resConfig;
      });
    });

    this.dataSPYService.supportedLangs = environment.supportedLangs;
    this.storageService.getLang().then(res => {
      if (res != null) {
        this.dataSPYService.lang = res;
        this.translate.setDefaultLang(res);
        this.setupLanguage();
      } else {
        this.getLangFromEnv();
      }
    }, error => {
      this.getLangFromEnv();
    });

  }

  getLangFromEnv() {
    this.dataSPYService.lang = environment.defaultLang;
    this.translate.setDefaultLang(environment.defaultLang);
    this.setupLanguage();
    this.storageService.setLang(environment.defaultLang);
  }

  setupEvents() {
    window.addEventListener('user:login', (e: CustomEvent) => {
      this.userLogin(e.detail);
    });

    window.addEventListener('user:logout', (e: CustomEvent) => {
      this.userLogout();
    });

    window.addEventListener('worker:login', (e: CustomEvent) => {
      this.workerLogin(e.detail);
    });

    window.addEventListener('worker:logout', (e: CustomEvent) => {
      this.workerLogout(e.detail);
    });

    window.addEventListener('worker:setDataArea', (e: CustomEvent) => {
      this.workerDataAreaSet(e.detail);
    });
  }

  async setupLanguage() {
    if (this.dataSPYService.lang === 'ar') {
      document.dir = 'rtl';
    } else {
      document.dir = 'ltr';
    }
  }

  async userLogin(user: LoginModel) {
    this.dataSPYService.isAuthenticated = true;
    this.storageService.setIsAuthenticated(true);
    this.dataSPYService.user = user;
    this.storageService.setUser(user);
  }

  async workerLogin(worker: EmployeeModel) {
    this.dataSPYService.worker = worker;
    this.storageService.setWorker(worker);
  }

  async workerDataAreaSet(dataArea: string) {
    this.dataSPYService.workerDataArea = dataArea;
    this.storageService.setWorkerDataArea(dataArea);
  }

  async workerLogout(worker: EmployeeModel) {
    this.dataSPYService.isAuthenticated = false;
    this.storageService.setIsAuthenticated(false);
    this.dataSPYService.user = null;
    this.storageService.setUser(null);
    this.dataSPYService.worker = null;
    this.storageService.setWorker(null);
    this.dataSPYService.workerDataArea = null;
    this.storageService.setWorkerDataArea(null);
    this.dataSPYService.leaveBalance = null;
    this.storageService.setLeaveBalance(null);
    this.goTo('/');
  }

  async userLogout(ev: any = {}) {
    try {
      if (!ev.silent) {
        const str = await this.translate.get('LOGOUT_CONFIRMATION').toPromise();
        await this.showConfirm(str);
      }
      await this.showLoadingView();
      this.dataSPYService.isAuthenticated = false;
      this.storageService.setIsAuthenticated(false);
      this.dataSPYService.user = null;
      this.storageService.setUser(null);
      this.dataSPYService.worker = null;
      this.storageService.setWorker(null);
      this.dataSPYService.workerDataArea = null;
      this.storageService.setWorkerDataArea(null);
      this.dataSPYService.leaveBalance = null;
      this.storageService.setLeaveBalance(null);

      this.goTo('/loginspy');
      this.dismissLoadingView();
      this.translate.get('LOGGED_OUT').subscribe(str => this.showToast(str));
    } catch (err) {
      this.dismissLoadingView();
    }
  }

  async showToast(message: string) {
    const closeText = await this.translate.get('CLOSE').toPromise();
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'tabs-bottom',
      buttons: [{
        text: closeText,
        role: 'cancel',
      }]
    });

    return await toast.present();
  }

  showConfirm(message: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const str = await this.translate.get(['OK', 'CANCEL']).toPromise();
      const confirm = await this.alertCtrl.create({
        header: '',
        message: message,
        buttons: [{
          text: str.CANCEL,
          role: 'cancel',
          handler: () => reject(false),
        }, {
          text: str.OK,
          handler: () => resolve(true)
        }]
      });
      confirm.present();

    });
  }

  async showLoadingView() {
    const str = await this.translate.get('LOADING').toPromise();
    this.loader = await this.loadingController.create({
      message: str
    });

    return await this.loader.present();
  }

  dismissLoadingView() {
    if (this.loader) {
      this.loader.dismiss().catch((e: any) => console.log('ERROR CATCH: LoadingController dismiss', e));
    }
  }

  goTo(page: string) {
    this.router.navigate([page]);
  }

}
