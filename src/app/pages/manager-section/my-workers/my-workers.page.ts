import { Component, OnInit } from '@angular/core';

import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { TimesheetTableContact } from 'src/app/models/timesheet/tsTableContract.interface';
import { DocumentRequestModel } from 'src/app/models/Document Request/documentRequest.model';
@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
})
export class MyWorkersPage implements OnInit {

  myWorkersDetails: EmployeeModel[] = [];

  workerLeaveList: LeaveAppTableContract[] = [];
  myworkerTimesheetList: TimesheetTableContact[] = [];
  workerDocumentList: DocumentRequestModel[] = [];

  leavePending: any = 0;
  timesheetPending: any = 0;
  hrReqPending: any = 0;

  
  constructor(public axService: AxService, public dataService: DataService, public paramService: ParameterService) {
      
     }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.myWorkersLeave();
    this.myWorkersTimesheet();
    this.myWorkersDocRequest();
  }


  myWorkersLeave() {
    this.axService.GetMyWorkersLeaveApprovals(this.paramService.emp.WorkerId).subscribe(res => {
      this.workerLeaveList = res;
      console.log("hi")
      this.leavePending = this.workerLeaveList.length;
    })
  }

  myWorkersTimesheet() {
    this.axService.GetMyWorkersTimesheetApprovals(this.paramService.emp.WorkerId).subscribe(res => {
      this.myworkerTimesheetList = res;

      this.timesheetPending = this.myworkerTimesheetList.length;
    })
  }

  myWorkersDocRequest() {
    this.axService.GetMyWorkersDocRequest(this.paramService.emp.WorkerId).subscribe(res => {
      this.workerDocumentList = res;
      
      this.hrReqPending = this.workerDocumentList.length;
    })
  }
}
