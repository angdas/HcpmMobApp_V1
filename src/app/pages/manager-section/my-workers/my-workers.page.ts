import { Component, OnInit, Injector } from '@angular/core';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
import { BasePage } from '../../base/base.page';

@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
})
export class MyWorkersPage extends BasePage implements OnInit {

  public myWorkerLeaveList: LeaveAppTableContract[] = [];
  public myWorkerTimesheetList: TimesheetTableContact[] = [];
  public myWorkerDocumentList: DocumentRequestModel[] = [];
  public leavePending: any = 0;
  public timesheetPending: any = 0;
  public hrReqPending: any = 0;
  
  constructor(injector: Injector) {
      super(injector);
    }

  ngOnInit() {
    this.myWorkersLeave();
    this.myWorkersTimesheet();
    this.myWorkersDocRequest();
  }

  ionViewWillEnter(){
    this.myWorkerLeaveList = this.dataSPYService.myWorkerLeaveAppList;
    this.myWorkerTimesheetList = this.dataSPYService.myWorkerTimesheetList;
    this.myWorkerDocumentList = this.dataSPYService.myWorkerDocumentList;
  }

  myWorkersLeave() {
    this.apiService.GetMyWorkersLeaveApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.myWorkerLeaveAppList = res;
      this.storageService.setMyWorkerLeaveAppList(res);
      this.myWorkerLeaveList = res;      
      this.leavePending = this.myWorkerLeaveList.length;      
    })
  }

  myWorkersTimesheet() {
    this.apiService.GetMyWorkersTimesheetApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.myWorkerTimesheetList = res;
      this.storageService.setMyWorkerTimesheetList(res);
      this.myWorkerTimesheetList = res;
      this.timesheetPending = this.myWorkerTimesheetList.length;
    })
  }

  myWorkersDocRequest() {
    this.apiService.GetMyWorkersDocRequest(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.dataSPYService.myWorkerDocumentList = res;
      this.storageService.setMyWorkerDocumentList(res);
      this.myWorkerDocumentList = res;      
      this.hrReqPending = this.myWorkerDocumentList.length;
    })
  }
}
