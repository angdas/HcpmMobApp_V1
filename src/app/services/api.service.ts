import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ClientConfigModel } from '../models/ClientConfig.model';
import { Observable } from 'rxjs';
import { DataSPYService } from './data.spy.service';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient,
    public dataSPYService: DataSPYService) { 
    
  }

  GetClientConfig(clientConfig: ClientConfigModel): Observable<any> {
    let url = 'https://hcpm-d365-azfunct.azurewebsites.net/api/GetHcpmPortalClientConfig';
    let body = {
      "ClientId": clientConfig.clientId,
      "Instance": clientConfig.instance
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    return this.http.post(url, body, httpOptions);
  }

  getERPconfig(): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetERPConfig';
    return this.http.get(url);
  }

  userLogin(login: LoginModel): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/Login';
    let body = {
      "Id": login.Id,
      "Password": login.Password
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getWorkerDetails(login: LoginModel): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetWorker';
    let body = {
      email: login.Id
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getLeaveType(email, absDate = new Date()): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetWorkerAbsenceBalance';
    let body = {
      "WorkerId": email,
      "AbsenceCode": "",
      "AbsenceDate": absDate
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getPayslip(user, period): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + '/api/HCPM/GetWorkerPayslip';
    let body = {
      "WorkerId": user,
      "PeriodStartDate": new Date(period),
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getLeaveDetails(workerId): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetLeaveApplication';
    let body = {
      "WorkerId": workerId,
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  GetMyWorkersLeaveApprovals(empid): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetLeaveApplicationApproval';
    let body = {
      "ApprovalId": empid
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getWorkerTimesheet(user: string, periodDate: Date): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + '/api/HCPM/GetTimeSheet';
    let body = {
      "WorkerId": user,
      "Date": periodDate.toDateString(),
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getWorkerPeriod(emp, period): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + '/api/HCPM/GetWorkerTimesheetPeriod';
    let body = { "WorkerId": emp };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  GetMyWorkersTimesheetApprovals(empid): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetTimesheetApproval';
    let body = {
      "ApprovalId": empid
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  GetMyWorkersDocRequest(workerId): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetHrRequestApproval';
    let body = {
      "ApprovalId": workerId
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getDocumentRequest(emp): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + '/api/HCPM/GetHRRequest';
    let body = {
      "WorkerId": emp,
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getDocRequestType(): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetHrRequestType';
    let body = {
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getDocumentRequestAddress(): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetHrRequestAddress';
    let body = {
      "DataArea": this.dataSPYService.workerDataArea
    };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  updateDocumentRequest(contact): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateHRRequest';
    let body = JSON.stringify(contact);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  updateEmplLeaveAppl(contract): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateLeaveApplication';
    let body = JSON.stringify(contract);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  updateLeaveAttachment(attachment): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateLeaveApplicationAttachment';
    let body = JSON.stringify(attachment);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    return this.http.post(url, body, httpOptions);
  }

  UpdateLeaveApplicationStatusWorker(contract): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateLeaveApplicationStatus';
    let body = JSON.stringify(contract);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  UpdateHRRequestStatus(contract): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateHRRequestStatus';
    let body = JSON.stringify(contract);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  getWorkerTimesheetProject(id): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/GetWorkerProject';
    let body = { 
      "WorkerId": id,
      "DataArea": this.dataSPYService.workerDataArea
   };
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  updateWorkerTimesheet(TimesheetTableContact): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateTimeSheet';
    let body = JSON.stringify(TimesheetTableContact);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

  UpdateTSApplicationStatusWorker(contract): Observable<any> {
    let url = this.dataSPYService.clientconfig.api + 'api/HCPM/UpdateTimesheetStatus';
    let body = JSON.stringify(contract);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'Application/json'
      })
    };
    console.log(JSON.stringify(body))
    return this.http.post(url, body, httpOptions);
  }

}
