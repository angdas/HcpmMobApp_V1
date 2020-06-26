import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/worker/worker.interface';
import { LoginModel } from '../models/login.model';
import { ClientConfigModel } from '../models/ClientConfig.model';
import { LeaveBalanceContract } from '../models/leave/leaveBalanceContract.interface';
import { LeaveAppTableContract } from '../models/leave/leaveAppTableContact.interface';
import { TimesheetTableContact } from '../models/timesheet/tsTableContract.interface';
import { WorkerPeriod } from '../models/timesheet/workerPeriod.model';
import { DocumentRequestModel } from '../models/Document Request/documentRequest.model';
import { DocumentRequestType } from '../models/Document Request/documentRequestType.model';
import { DocumentAddressModel } from '../models/Document Request/documentAddress.model';
import { TimesheetProject } from '../models/timesheet/tsProject.interface';
import { TimesheetPeriodDate } from '../models/timesheet/tsPeriodDate.interface';
import { TimesheetLine } from '../models/timesheet/tsLineListContact.interface';

@Injectable({
  providedIn: 'root'
})
export class DataSPYService {
  if(arg0: boolean) {
    throw new Error("Method not implemented.");
  }

  public clientconfig: ClientConfigModel;
  public isAuthenticated: boolean;
  public user: LoginModel;
  public worker: EmployeeModel;
  public lang: string;
  public supportedLangs: string[];
  public workerDataArea: string;
  public leaveBalance: LeaveBalanceContract[];
  public leaveAppList: LeaveAppTableContract[];
  public myWorkerLeaveAppList: LeaveAppTableContract[];
  public timesheetList: TimesheetTableContact[];
  public periodList: WorkerPeriod[];
  public timesheetPeriodList: TimesheetPeriodDate[];
  public myWorkerTimesheetList: TimesheetTableContact[];
  public projectActivityList: TimesheetProject[];
  public documentList: DocumentRequestModel[];
  public myWorkerDocumentList: DocumentRequestModel[];
  public docRequestTypeList: DocumentRequestType[];
  public docReqAddressTypeList: DocumentAddressModel[];
  public colorList: any=[];
  public isNewLeaveLine:boolean;

  public leaveApp: LeaveAppTableContract;
  public documentReq: DocumentRequestModel;
  public timesheet: TimesheetTableContact;
  public timesheetLine: TimesheetLine;

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
      {bgColor:'#b02b9f', textColor:'#FFFFFF'}
    );
  }
}
