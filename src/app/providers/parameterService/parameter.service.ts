import { Injectable } from '@angular/core';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { LoginModel } from 'src/app/models/login.model';
import { ClientConfigModel } from 'src/app/models/ClientConfig.model';
import { WorkerEmployementModel } from 'src/app/models/worker/WorkerEmployement.model';


@Injectable({
  providedIn: 'root'
})
export class ParameterService {
  public proxyUser = 'DynaServices@omanflourmills.com';
  public baseUrl:any;

  public authenticated: boolean;
  public email: any;

  public token: string;
  public tokenExpiryDateTime: Date;  

  
  public joiningDate:Date;
  public emp:EmployeeModel;
  public isManager:boolean;
  public loginCredentials:LoginModel;
  public dataAreaObj:WorkerEmployementModel;
  public workerEmpList:WorkerEmployementModel[];
  public companyLogo:string;

  public colorList:any=[];


  public totalStorageVariables: number = 12;

  public clientConfig:ClientConfigModel = {} as ClientConfigModel;
 
  constructor() {
    this.colorList=[];
    this.colorList.push(
      {bgColor:'#7EB6FF', textColor:'#ffffff'},
      {bgColor:'#ea5d5d', textColor:'#ffffff'},
      {bgColor:'#5dea8a', textColor:'#ffffff'},
      {bgColor:'#b9886a', textColor:'#ffffff'},
      {bgColor:'#8097b0', textColor:'#ffffff'},
      {bgColor:'#DB7093', textColor:'#FFFFFF'},
      {bgColor:'#B452CD', textColor:'#FFFFFF'},
      {bgColor:'#c343e2', textColor:'#FFFFFF'},
      {bgColor:'#2bafb0', textColor:'#FFFFFF'},
      {bgColor:'#b02b9f', textColor:'#FFFFFF'},
    )

   
  }

}
