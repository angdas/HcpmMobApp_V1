import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, MenuController } from '@ionic/angular';
import { LoginModel } from 'src/app/models/login.model';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { Events } from 'src/app/providers/events/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from 'src/app/providers/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('passwordField', { static: false }) passwordField: IonInput;

  loginModel: LoginModel = {} as LoginModel;

  showPassword: boolean;
  loginSpinner: boolean;
  savePass: boolean;

  imgSrc: any;
  constructor(public axservice: AxService, public router: Router,
    public storageServ: StorageService, public paramService: ParameterService, public dataService: DataService,
    public event: Events, private sanitizer: DomSanitizer, public alertServ: AlertService) {

  }

  ngOnInit() {
    this.storageServ.getAllValuesFromStorage.subscribe(res => {

    }, error => {

    }, () => {

      if (this.paramService.loginCredentials) {
        this.loginModel = this.paramService.loginCredentials;
        this.savePass = true;
      }
    })
  }
  ionViewWillEnter() {
    this.imgSrc = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64," + this.paramService.companyLogo);
  }

  login() {
    this.loginSpinner = true;

    if (this.savePass) {
      this.storageServ.setLoginCrendentials(this.loginModel);
    }
    this.axservice.userLogin(this.loginModel).subscribe(res => {
      this.loginSpinner = false;
      if (res) {
        this.event.publish('authenticated', true);
        this.storageServ.setAuthenticated(true);
        this.storageServ.setEmail(this.loginModel.Id);
        this.getWorkerDetails();
      } else {
        this.event.publish('authenticated', false);
        this.storageServ.setAuthenticated(false);
        this.alertServ.errorToast("Invalid Credentials")
      }
    }, error => {
      this.loginSpinner = false;
      console.log(error);
    })
  }
  getWorkerDetails() {
    this.axservice.getWorkerDetails(this.paramService.email).subscribe(async (res: EmployeeModel) => {
      console.log(res);
      if (!res.Name) {
        this.storageServ.setAuthenticated(false);
        this.alertServ.errorToast("Worker not found");
        this.event.publish('authenticated', false);
      } else {
        this.dataService.setMyDetails(res);
        this.storageServ.setUserDetails(res);
        this.paramService.isManager = res.IsManager;
        this.event.publish("isManager", res.IsManager);
        if (res.IsManager) {
          this.router.navigateByUrl("/tab/tabs/manager-profile");
        } else {
          this.router.navigateByUrl("/myprofile")
        }
      }

    }, (error) => {

    })
  }

  showPasswordBtn() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordField.type = "text";
    } else {
      this.passwordField.type = "password"
    }
  }

  gotoSettings() {
    this.router.navigateByUrl("settings")
  }
}
