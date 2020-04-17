import { TimesheetLine } from './tsLineListContact.interface';
import { TimesheetPeriodDate } from './tsPeriodDate.interface';

export class TimesheetTableContact {
    // ApprovalStatus: string;
    // EmplId: string;
    // PeriodFrom: Date;
    // PeriodTo: Date;
    // TimesheetNumber: string;
    // IsEditable: boolean;
    // IsDeleted: Number;
    // TimesheetLineList: TimesheetLineList[];

    WorkflowRemarks: any;
    Error: any;
    ErrorMessage: any;
    TotalHours:any;

    Number: any;
    WorkerName: any;
    TimesheetCode: any;
    WorkerId: any;
    Status: any;
    PeriodFrom: any;
    PeriodTo: any;
    
    Approved:boolean;
    Rejected:boolean;
    ApproveWorker: any;
    RejectWorker: any;
    
    TimesheetLine: TimesheetLine[];

    IsEditable: boolean;
    IsDeleted: boolean;

    InApprovalState: boolean;

    DataArea:any;
    ERPRecID:any;
    constructor() {

    }
}