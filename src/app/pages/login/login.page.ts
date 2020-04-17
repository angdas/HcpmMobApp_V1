import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ToastController, MenuController } from '@ionic/angular';
import { LoginModel } from 'src/app/models/login.model';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { Events } from 'src/app/providers/events/event.service';

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
  savePass:boolean;
  constructor(public axservice: AxService, public router: Router, public toastController: ToastController,
    public storageServ: StorageService, public paramService: ParameterService, public dataService: DataService,
    private menuCtrl: MenuController,public event:Events) { 
      this.menuCtrl.enable(false);

      this.menuCtrl.enable(false);      
    }

  ngOnInit() {
    this.storageServ.getAllValuesFromStorage.subscribe(res=>{

    },error=>{

    },()=>{
      if(this.paramService.loginCredentials){
        this.loginModel = this.paramService.loginCredentials;
        this.savePass = true;
      }
    })
  }

  login() {
    this.loginSpinner = true;

    if(this.savePass){
      this.storageServ.setLoginCrendentials(this.loginModel);
    }
    this.axservice.userLogin(this.loginModel).subscribe(res => {
      this.loginSpinner = false;
      if (res) {
        this.event.publish('authenticated',true);
        this.storageServ.setAuthenticated(true);
        this.storageServ.setEmail(this.loginModel.Id);
        this.getWorkerDetails();
      } else {
        this.event.publish('authenticated',false);
        this.storageServ.setAuthenticated(false);
        this.errorToast("Invalid Credentials")
      }
    }, error => {
      this.loginSpinner = false;
      console.log(error);
    })
  }
  getWorkerDetails() {
    this.axservice.getWorkerDetails(this.paramService.email).subscribe((res:EmployeeModel) => {
      console.log(res);
      if(!res.Name){
        this.storageServ.setAuthenticated(false);
        this.errorToast("Worker not found");
        this.event.publish('authenticated',false);
      }else{
        this.dataService.setMyDetails(res);
        this.storageServ.setUserDetails(res);
        this.storageServ.setDataArea(res.WorkerEmployement[0]);
        this.event.publish("isManager",res.IsManager);
        if (res.IsManager) {
          this.router.navigateByUrl("/tab/tabs/manager-profile");
        } else {
          this.router.navigateByUrl("/myprofile")
        }
      }
    
    }, (error) => {
    
    })
  }


  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  showPasswordBtn() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordField.type = "text";
    } else {
      this.passwordField.type = "password"
    }
  }

  gotoSettings(){
    this.router.navigateByUrl("settings")
  }
}
