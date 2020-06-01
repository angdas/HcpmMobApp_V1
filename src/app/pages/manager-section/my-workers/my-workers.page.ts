import { Component, OnInit, Injector } from '@angular/core';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
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

  myWorkersDetails: EmployeeModel[] = [];

  workerLeaveList: LeaveAppTableContract[] = [];
  myworkerTimesheetList: TimesheetTableContact[] = [];
  workerDocumentList: DocumentRequestModel[] = [];

  leavePending: any = 0;
  timesheetPending: any = 0;
  hrReqPending: any = 0;

  
  constructor(injector: Injector) {
      super(injector);
    }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.myWorkersLeave();
    this.myWorkersTimesheet();
    this.myWorkersDocRequest();
  }

  myWorkersLeave() {
    this.apiService.GetMyWorkersLeaveApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.workerLeaveList = res;      
      this.leavePending = this.workerLeaveList.length;
    })
  }

  myWorkersTimesheet() {
    this.apiService.GetMyWorkersTimesheetApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.myworkerTimesheetList = res;
      this.timesheetPending = this.myworkerTimesheetList.length;
    })
  }

  myWorkersDocRequest() {
    this.apiService.GetMyWorkersDocRequest(this.dataSPYService.worker.WorkerId).subscribe(res => {
      console.log(res);
      this.workerDocumentList = res;      
      this.hrReqPending = this.workerDocumentList.length;
    })
  }
}
