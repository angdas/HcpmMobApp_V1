import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { ParameterService } from '../parameterService/parameter.service';
import { Observable } from 'rxjs';
import { LoginModel } from 'src/app/models/login.model';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { ClientConfigModel } from 'src/app/models/ClientConfig.model';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { WorkerPeriod } from 'src/app/models/timesheet/workerPeriod.model';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { DocumentRequestType } from 'src/app/models/Document Request/documentRequestType.model';
import { DocumentAddressModel } from 'src/app/models/Document Request/documentAddress.model';
import { TimesheetProject } from 'src/app/models/timesheet/tsProject.interface';
import { TimesheetPeriodDate } from 'src/app/models/timesheet/tsPeriodDate.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage, private parameterservice: ParameterService) {
    console.log('Hello StorageserviceProvider Provider');
  }

  getAllValuesFromStorage = Observable.create((observer) => {
    let variables = 0;

    this.storage.get('hcpmAuthenticated').then((data) => {
      this.parameterservice.authenticated = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmEmail').then((data) => {
      this.parameterservice.email = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmToken').then((data) => {
      this.parameterservice.token = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmTokenExpiryDateTime').then((data) => {
      this.parameterservice.tokenExpiryDateTime = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('employee').then((data) => {
      this.parameterservice.emp = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmIsManager').then((data) => {
      this.parameterservice.isManager = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmClientConfig').then((data) => {
      this.parameterservice.clientConfig = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmLoginCredentials').then((data) => {
      this.parameterservice.loginCredentials = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmBaseURL').then((data) => {
      this.parameterservice.baseUrl = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })


    this.storage.get('hcpmBaseURL').then((data) => {
      this.parameterservice.baseUrl = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmDataArea').then((data) => {
      this.parameterservice.dataAreaObj = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

    this.storage.get('hcpmCompanyLogo').then((data) => {
      this.parameterservice.companyLogo = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmWorkerEmployementList').then((data) => {
      this.parameterservice.workerEmpList = data;
      observer.next(data);
      variables++;
      if (variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })

  })

  setCompanyLogo(companylogo) {
    this.storage.set('hcpmCompanyLogo', companylogo);
    this.parameterservice.companyLogo = companylogo;
  }
  setDataArea(dataArea) {
    this.storage.set('hcpmDataArea', dataArea);
    this.parameterservice.dataAreaObj = dataArea;
  }

  setClientConfig(clientConfig) {
    this.storage.set('hcpmClientConfig', clientConfig);
    this.parameterservice.clientConfig = clientConfig;
  }

  setURL(url) {
    this.storage.set('hcpmBaseURL', url);
    this.parameterservice.baseUrl = url;
  }

  setLoginCrendentials(loginCred) {
    this.storage.set('hcpmLoginCredentials', loginCred);
    this.parameterservice.loginCredentials = loginCred;
  }

  setIsManager(isManager: boolean) {
    this.storage.set('hcpmIsManager', isManager);
    this.parameterservice.isManager = isManager;
  }

  setAuthenticated(authenticated: boolean) {
    this.storage.set('hcpmAuthenticated', authenticated);
    this.parameterservice.authenticated = authenticated;
  }

  setEmail(user: string) {
    this.storage.set('hcpmEmail', user);
    this.parameterservice.email = user;
  }

  setToken(token: string) {
    this.storage.set('hcpmToken', token);
    this.parameterservice.token = token;
  }

  setTokenExpiryDateTime(tokenExpiryDateTime: Date) {
    this.storage.set('hcpmTokenExpiryDateTime', tokenExpiryDateTime);
    this.parameterservice.tokenExpiryDateTime = tokenExpiryDateTime;
  }

  setUserDetails(user: any) {
    this.storage.set('employee', user);
    this.parameterservice.emp = user;
  }

  setEmployementList(employementList) {
    this.storage.set('hcpmWorkerEmployementList', employementList);
    this.parameterservice.workerEmpList = employementList;
  }

  clearStorage() {
    let companyLogo = this.parameterservice.companyLogo
    this.storage.clear();
    if (this.parameterservice.loginCredentials) {
      this.setLoginCrendentials(this.parameterservice.loginCredentials);
      this.setURL(this.parameterservice.baseUrl);
    }
    if (this.parameterservice.clientConfig) {
      this.setClientConfig(this.parameterservice.clientConfig);
    }
    this.setCompanyLogo(companyLogo);
  }


  //----------new------------
  async setClientConfiguration(clientConfig: ClientConfigModel) {
    return this.storage.set('spyClientConfig', clientConfig);
  }

  async getClientConfiguration(): Promise<ClientConfigModel> {
    return this.storage.get('spyClientConfig');
  }

  async setIsAuthenticated(isAuthenticated: boolean) {
    return this.storage.set('spyIsAuthenticated', isAuthenticated);
  }

  async getIsAuthenticated(): Promise<boolean> {
    return this.storage.get('spyIsAuthenticated');
  }

  async setUser(user: LoginModel) {
    return this.storage.set('spyUser', user);
  }

  async getUser(): Promise<LoginModel> {
    return this.storage.get('spyUser');
  }

  getLang(): Promise<string> {
    return this.storage.get('spyLang');
  }

  setLang(val: string) {
    return this.storage.set('spyLang', val);
  }

  async setWorker(worker: EmployeeModel) {
    return this.storage.set('spyWorker', worker);
  }

  async getWorker(): Promise<EmployeeModel> {
    return this.storage.get('spyWorker');
  }

  getWorkerDataArea(): Promise<string> {
    return this.storage.get('spyDataArea');
  }

  setWorkerDataArea(val: string) {
    return this.storage.set('spyDataArea', val);
  }

  getLeaveBalance(): Promise<LeaveBalanceContract[]> {
    return this.storage.get('spyLeaveBalance');
  }

  setLeaveBalance(val: LeaveBalanceContract[]) {
    return this.storage.set('spyLeaveBalance', val);
  }

  getLeaveAppList(): Promise<LeaveAppTableContract[]> {
    return this.storage.get('spyLeaveAppList');
  }

  setLeaveAppList(val: LeaveAppTableContract[]) {
    return this.storage.set('spyLeaveAppList', val);
  }

  getMyWorkerLeaveAppList(): Promise<LeaveAppTableContract[]> {
    return this.storage.get('spyMyWorkerLeaveAppList');
  }

  setMyWorkerLeaveAppList(val: LeaveAppTableContract[]) {
    return this.storage.set('spyMyWorkerLeaveAppList', val);
  }

  getTimesheetList(): Promise<TimesheetTableContact[]> {
    return this.storage.get('spyTimesheetList');
  }

  setTimesheetList(val: TimesheetTableContact[]) {
    return this.storage.set('spyTimesheetList', val);
  }

  getPeriodList(): Promise<WorkerPeriod[]> {
    return this.storage.get('spyPeriodList');
  }

  setPeriodList(val: WorkerPeriod[]) {
    return this.storage.set('spyPeriodList', val);
  }

  getMyWorkerTimesheetList(): Promise<TimesheetTableContact[]> {
    return this.storage.get('spymyWorkerTimesheetList');
  }

  setMyWorkerTimesheetList(val: TimesheetTableContact[]) {
    return this.storage.set('spymyWorkerTimesheetList', val);
  }

  getDocumentList(): Promise<DocumentRequestModel[]> {
    return this.storage.get('spyDocumnetList');
  }

  setDocumentList(val: DocumentRequestModel[]) {
    return this.storage.set('spyDocumnetList', val);
  }

  getMyWorkerDocumentList(): Promise<DocumentRequestModel[]> {
    return this.storage.get('spymyWorkerDocumentList');
  }

  setMyWorkerDocumentList(val: DocumentRequestModel[]) {
    return this.storage.set('spymyWorkerDocumentList', val);
  }

  getDocRequestTypeList(): Promise<DocumentRequestType[]> {
    return this.storage.get('spyDocumentRequestTypeList');
  }

  setDocRequestTypeList(val: DocumentRequestType[]) {
    return this.storage.set('spyDocumentRequestTypeList', val);
  }

  getDocReqAddressTypeList(): Promise<DocumentAddressModel[]> {
    return this.storage.get('spyDocReqAddressTypeList');
  }

  setDocReqAddressTypeList(val: DocumentAddressModel[]) {
    return this.storage.set('spyDocReqAddressTypeList', val);
  }

  getProjectActivityList(): Promise<TimesheetProject[]> {
    return this.storage.get('spyProjectActivityList');
  }

  setProjectActivityList(val: TimesheetProject[]) {
    return this.storage.set('spyProjectActivityList', val);
  }

  getTimesheetPeriodList(): Promise<TimesheetPeriodDate[]> {
    return this.storage.get('spyTimesheetPeriodList');
  }

  setTimesheetPeriodList(val: TimesheetPeriodDate[]) {
    return this.storage.set('spyTimesheetPeriodList', val);
  }
}
