import { Component, OnInit, Injector } from '@angular/core';
import { BasePage } from '../base/base.page';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginModel } from 'src/app/models/login.model';
import { environment } from 'src/environments/environment';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';

@Component({
  selector: 'app-loginspy',
  templateUrl: './loginspy.page.html',
  styleUrls: ['./loginspy.page.scss'],
})
export class LoginspyPage extends BasePage implements OnInit {

  public imgSrc: any;
  public loginModel: LoginModel = {} as LoginModel;
  public loginSpinner: boolean;

  constructor(injector: Injector,
    private sanitizer: DomSanitizer) { 
    super(injector);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.dataSPYService.clientconfig && this.dataSPYService.clientconfig.companyLogo) {
      this.imgSrc = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64," + this.dataSPYService.clientconfig.companyLogo);
    } else { //If company logo not found
      //this.imgSrc = environment.appImageUrl;
    }
    
    if(this.dataSPYService.user != null) {
      this.loginModel = this.dataSPYService.user;
    } 
  }

  async login() {
    this.loginSpinner = true;
    await this.showLoadingView({ showOverlay: true });    
    this.apiService.userLogin(this.loginModel).subscribe(res => {     
      this.loginSpinner = false;
      this.dismissLoadingView();
      if (res) {        
        window.dispatchEvent(new CustomEvent('user:login', {detail: this.loginModel}));        
        this.getWorkerDetails();
      } else {        
        this.translate.get('INVALID_CREDENTIALS').subscribe(str => this.showToast(str));        
      }
    }, error => {
      this.dismissLoadingView();    
      this.loginSpinner = false;
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  async getWorkerDetails() {
    await this.showLoadingView({ showOverlay: true });    
    this.apiService.getWorkerDetails(this.dataSPYService.user).subscribe( async (res) => {
      let worker: EmployeeModel = res;
      this.dismissLoadingView();        
      if(worker) {
        if(worker.WorkerEmployement == null || worker.WorkerEmployement.length == 0) {
          window.dispatchEvent(new CustomEvent('worker:logout', {detail: worker})); 
          this.translate.get('WORKER_EMPLOYMENT_NOTFOUND').subscribe(str => this.showToast(str));          
        } else {
          const transParams = { name: this.loginModel.Id };
          this.translate.get('LOGGED_IN_AS', transParams).subscribe(str => this.showToast(str));
          window.dispatchEvent(new CustomEvent('worker:login', {detail: worker})); 
          //--select data area
          if(this.dataSPYService.worker.WorkerEmployement.length == 1) {
            window.dispatchEvent(new CustomEvent('worker:setDataArea', {detail: this.dataSPYService.worker.WorkerEmployement[0].DataArea})); 
          } else if (this.dataSPYService.worker.WorkerEmployement.length > 1) {
            let inputArr = [];
            this.dataSPYService.worker.WorkerEmployement.forEach(el => {
              inputArr.push({
                name: 'radio',
                type: 'radio',
                label: el.DataArea,
                value: el,
              })                
            })
            const alert = await this.alertCtrl.create({
              header: 'Select Legal Entity',
              backdropDismiss: false,
              inputs: inputArr,
              buttons: [
                {
                  text: 'Ok',
                  handler: (data) => {
                    window.dispatchEvent(new CustomEvent('worker:setDataArea', {detail: data})); 
                    console.log(data);
                  }
                }
              ]
            });
            alert.present();
          }
          if (this.dataSPYService.worker.IsManager) {
            this.router.navigateByUrl("/tab/tabs/manager-profile");
          } else {
            this.router.navigateByUrl("/myprofile")
          }
        }        
      } else {
        window.dispatchEvent(new CustomEvent('worker:logout', {detail: worker})); 
        this.translate.get('WORKER_NOTFOUND').subscribe(str => this.showToast(str));  
      }
    }, (error) => {
      this.dismissLoadingView();   
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  gotoSettings() {
    this.router.navigateByUrl('/settingsspy');
  }

}
