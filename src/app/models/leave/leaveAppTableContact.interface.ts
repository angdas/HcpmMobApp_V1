import { LeaveAppLineContract } from './leaveAppLineContract.interface';

export class LeaveAppTableContract{
    // ApplicationLine:LeaveAppLineContract[];
    // Error:boolean;
    // IsDeleted:boolean;
    // IsEditable:boolean;
    // LeaveApplicationCode:any;
    // PeriodFrom:Date;
    // PeriodTo:Date;
    // PersonnelNumber:string;
    // Remarks:string;
    // Status:string;
    // WorkerName:any;
    Number:any;

    WorkerId :any;
    WorkerName:any;
    LeaveApplicationCode:any;
    Email:any
    Status:any;
    Remarks:any
    Resumed:any
    WorkflowRemarks:any;
    PeriodFrom:any;
    ResumptionInitiated:any;
    PeriodTo:any;
    Approved:boolean;
    Rejected:boolean;
    ApproveWorker: any;
    RejectWorker: any;
    ErrorMessage:any;
    Error:any;

    LeaveApplicationLine:LeaveAppLineContract[];

    IsDeleted:boolean;
    IsEditable:boolean;
    InApprovalState:boolean;
    DataArea:any;
    ERPRecID:any;
}
