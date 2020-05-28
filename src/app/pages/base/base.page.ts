import { Component, OnInit, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, LoadingController, AlertController, ToastController, Platform, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSPYService } from 'src/app/services/data.spy.service';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { inject } from '@angular/core/testing';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { ApiService } from 'src/app/services/api.service';

export abstract class BasePage {

  public isErrorViewVisible: boolean;
  public isEmptyViewVisible: boolean;
  public isContentViewVisible: boolean;
  public isLoadingViewVisible: boolean;
  public isAuthViewVisible: boolean;
  public dataSPYService: DataSPYService;

  protected translate: TranslateService;
  protected modalCtrl: ModalController;
  protected router: Router;
  protected activatedRoute: ActivatedRoute;  
  protected storageService: StorageService;
  protected appVersion: AppVersion;
  protected menuCtrl: MenuController;
  protected apiService: ApiService;
  protected alertCtrl: AlertController;
  
  private loadingCtrl: LoadingController;
  private loader: any;  
  private toastCtrl: ToastController;
  private platform: Platform;
  private title: Title;
  private meta: Meta;
  private safariViewController: SafariViewController;
  private inAppBrowser: InAppBrowser;

  constructor(injector: Injector) {
    this.translate = injector.get(TranslateService);
    this.loadingCtrl = injector.get(LoadingController);
    this.modalCtrl = injector.get(ModalController);
    this.toastCtrl = injector.get(ToastController);
    this.alertCtrl = injector.get(AlertController);
    this.platform = injector.get(Platform);
    this.router = injector.get(Router);
    this.activatedRoute = injector.get(ActivatedRoute);
    this.title = injector.get(Title);
    this.meta = injector.get(Meta);
    this.safariViewController = injector.get(SafariViewController);
    this.inAppBrowser = injector.get(InAppBrowser);
    this.dataSPYService = injector.get(DataSPYService);
    this.storageService = injector.get(StorageService);
    this.appVersion = injector.get(AppVersion);
    this.menuCtrl = injector.get(MenuController);
    this.apiService = injector.get(ApiService);
  }

  async showLoadingView(params: { showOverlay: boolean }) {

    if (params.showOverlay) {
      const loadingText = await this.getTrans('LOADING');

      this.loader = await this.loadingCtrl.create({
        message: loadingText
      });

      return await this.loader.present();

    } else {

      this.isAuthViewVisible = false;
      this.isErrorViewVisible = false;
      this.isEmptyViewVisible = false;
      this.isContentViewVisible = false;
      this.isLoadingViewVisible = true;
    }

    return true;
  }

  getTrans(key: string | string[]) {
    return this.translate.get(key).toPromise();
  }

  showContentView() {

    this.isAuthViewVisible = false;
    this.isErrorViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = true;

    this.dismissLoadingView();
  }

  async dismissLoadingView() {
    if (!this.loader) { return; }

    try {
      return await this.loader.dismiss();
    } catch (error) {
      console.log('ERROR: LoadingController dismiss', error);
    }
  }

  async showToast(message: string) {

    const closeText = await this.getTrans('CLOSE');

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

  async showAlert(message: string) {

    const okText = await this.getTrans('OK');

    const alert = await this.alertCtrl.create({
      header: '',
      message: message,
      buttons: [okText]
    });

    return await alert.present();
  }

  isHybrid(): boolean {
    //console.log(this.platform.platforms());
    return this.platform.is('hybrid');
  }

  isCordova(): boolean {    
    return this.platform.is('cordova');
  }

  isIos(): boolean {    
    return this.platform.is('ios');
  }

  public setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  public async setMetaTags(config1: {
    title?: string,
    description?: string,
    image?: string,
    slug?: string
  }) {

    const str = await this.getTrans(['APP_NAME', 'APP_DESCRIPTION']);

    const config = {
      title: str.APP_NAME,
      description: str.APP_DESCRIPTION,
      image: this.appImageUrl,
      ...config1
    };

    let url = this.router.url;

    if (config.slug) {
      url = this.appUrl + '/' + config.slug;
    }

    this.meta.updateTag({
      property: 'og:title',
      content: config.title
    });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description
    });

    this.meta.updateTag({
      property: 'og:image',
      content: config.image
    });

    this.meta.updateTag({
      property: 'og:image:alt',
      content: config.title
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: config.title
    });

    this.meta.updateTag({
      name: 'twitter:text:title',
      content: config.title
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: config.image
    });

    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: config.title
    });
  }

  navigateToRelative(page: any, queryParams: any = {}) {
    return this.router.navigate([page], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }

  async openUrl(url: string) {

    if (!url) { return; }

    if (this.platform.is('cordova')) {

      try {

        const isAvailable = await this.safariViewController.isAvailable();

        if (isAvailable) {
          await this.safariViewController.show({
            url: url,
            toolbarColor: environment.androidHeaderColor,
          }).toPromise();
        } else {
          this.inAppBrowser.create(url, '_system');
        }
      } catch (error) {
        console.log(error);
      }

    } else if (this.platform.is('pwa')) {
      this.inAppBrowser.create(url, '_blank');
    } else {
      this.inAppBrowser.create(url, '_system');
    }

  }

  public get appImageUrl(): string {
    return environment.appImageUrl;
  }

  public get appUrl(): string {
    return environment.appUrl;
  }

}
