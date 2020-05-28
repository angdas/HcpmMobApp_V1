import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { BasePage } from '../base/base.page';
import { environment } from 'src/environments/environment';
import { IonInput } from '@ionic/angular';
import { ClientConfigModel } from 'src/app/models/ClientConfig.model';

@Component({
  selector: 'app-settingsspy',
  templateUrl: './settingsspy.page.html',
  styleUrls: ['./settingsspy.page.scss'],
})
export class SettingsspyPage extends BasePage implements OnInit {

  @ViewChild('clientId', { static: false }) clientIdInput: IonInput;
  versionNumber: any;
  toggle: any;
  prefersDark: any;
  public clientConfig: ClientConfigModel = {} as ClientConfigModel;

  constructor(injector: Injector) {
    super(injector);
    this.menuCtrl.enable(false);        
    if(this.isHybrid()) {
      this.appVersion.getVersionNumber().then(res => {
        this.versionNumber = res;
      })
    }
  }

  ngOnInit() {
    
  }
  
  ionViewWillEnter() {
    if(this.dataSPYService.clientconfig != null) {
      this.clientConfig = this.dataSPYService.clientconfig;
    }    
    if(!this.dataSPYService.isAuthenticated){      
      this.clientIdInput.setFocus();
    }
  }

  async getClientUrl() {
    await this.showLoadingView({ showOverlay: true });
    this.dataSPYService.clientconfig = this.clientConfig;
    this.apiService.GetClientConfig(this.dataSPYService.clientconfig).subscribe((res: ClientConfigModel) => {      
      if (res.api) {
        this.dataSPYService.clientconfig = res;
        this.storageService.setClientConfiguration(this.dataSPYService.clientconfig);
        this.apiService.getERPconfig().subscribe(resErpConfig => {
          console.log(resErpConfig);
          this.dataSPYService.clientconfig.companyLogo = resErpConfig.CompanyLogo;
          this.storageService.setClientConfiguration(this.dataSPYService.clientconfig);  
          this.dismissLoadingView();        
          this.router.navigateByUrl('/loginspy');
        }, error => {
          this.dismissLoadingView();
          this.translate.get(error).subscribe(str => this.showToast(str));
        })
        
      } else {
        this.dismissLoadingView();
        this.translate.get('CLIENTID_INSTANCE_INCORRECT').subscribe(str => this.showToast(str));
      }
    }, error => {
      this.dismissLoadingView();
      this.translate.get(error).subscribe(str => this.showToast(str));
    })   
  }

  legalEntityChanged(){   
    window.dispatchEvent(new CustomEvent('worker:setDataArea', {detail: this.dataSPYService.workerDataArea}));
    this.translate.get('LEGAL_ENTITY_CHANGED').subscribe(str => this.showToast(str));  
  }

}
