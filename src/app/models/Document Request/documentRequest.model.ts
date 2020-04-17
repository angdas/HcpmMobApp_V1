import { DocumentRequestLine } from './documentRequestLine.model';

export class DocumentRequestModel {
    Number: any;
    WorkerName:any;
    HRRequestCode: any;
    WorkerId: any;
    Status: any;
    Remarks: any;
    Resumed: any;
    WorkflowRemarks: any;
    IsEditable: any;
    IsDeleted: any;
    IsSync: any;
    ApproveWorker: any;
    RejectWorker: any;
    
    Approved:boolean;
    Rejected:boolean;
    HRRequestLine: DocumentRequestLine[];
    Error: any;
    ErrorMessage: any;

    InApprovalState:boolean;

    DataArea:any;
    ERPRecID:any;

    constructor() {

    }
}