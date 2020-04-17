import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //LEAVE
  private leaveLineAddDetails = new BehaviorSubject<any>(0);
  getLeaveLineAddDetails$ = this.leaveLineAddDetails.asObservable();

  private leaveLineDetails = new BehaviorSubject<any>(0);
  getLeaveLineDetails$ = this.leaveLineDetails.asObservable();

  private leaveEditDetails = new BehaviorSubject<any>(0);
  getLeaveEditDetails$ = this.leaveEditDetails.asObservable();

  private leaveList = new BehaviorSubject<any>(0);
  getleaveList$ = this.leaveList.asObservable();


  //TIMESHEET

  private timesheetHeader = new BehaviorSubject<any>(0);
  getTimesheetHeader$ = this.timesheetHeader.asObservable();

  private timesheetList = new BehaviorSubject<any>(0);
  getTimesheetList$ = this.timesheetList.asObservable();

  private timesheetLine = new BehaviorSubject<any>(0);
  getTimesheetLine$ = this.timesheetLine.asObservable();

  private timesheetPeriodList = new BehaviorSubject<any>(0);
  getTimesheetPeriodList$ = this.timesheetPeriodList.asObservable();

  private timesheetAddLine = new BehaviorSubject<any>(0);
  gettimesheetAddLine$ = this.timesheetAddLine.asObservable();


  //DETAILS

  private myDetails = new BehaviorSubject<any>(0);
  getMyDetails$ = this.myDetails.asObservable();

  //DOCUMENT
  private documentDetails = new BehaviorSubject<any>(0);
  getDocumentDetails$ = this.documentDetails.asObservable();

  private documentDetailsList = new BehaviorSubject<any>(0);
  getDocumentDetailsList$ = this.documentDetailsList.asObservable();

  private documentReqLineAdd = new BehaviorSubject<any>(0);
  getDocumentReqLineAdd$ = this.documentReqLineAdd.asObservable();

  constructor() { }

  setDocumentReqLineAddDetails(data) {
    this.documentReqLineAdd.next(data);
  }

  setTimesheetAddLine(data) {
    this.timesheetAddLine.next(data);
  }

  setDocumentDetailsList(data) {
    this.documentDetailsList.next(data);
  }

  setDocumentDetails(data) {
    this.documentDetails.next(data);
  }

  setMyDetails(data) {
    this.myDetails.next(data);
  }
  setLeaveLineAddDetails(data) {
    this.leaveLineAddDetails.next(data);
  }

  setLeaveLineDetails(data) {
    this.leaveLineDetails.next(data);
  }

  setLeaveEditDetails(data) {
    this.leaveEditDetails.next(data);
  }

  setLeaveList(data) {
    this.leaveList.next(data);
  }

  setTimesheetHeader(data) {
    this.timesheetHeader.next(data);
  }

  setTimesheetLine(data) {
    this.timesheetLine.next(data);
  }

  settimesheetPeriodList(data) {
    this.timesheetPeriodList.next(data);
  }
  setTimesheetList(data) {
    this.timesheetList.next(data);
  }
}
