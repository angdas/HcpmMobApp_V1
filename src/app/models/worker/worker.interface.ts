import { WorkerIdentificationModel } from './workerIdentification.model';
import { WorkerEmployementModel } from './WorkerEmployement.model';

export class EmployeeModel {
    Address: any;
    AnniversaryDate: any;
    BankAccountNumber: any;
    BankName: any;
    BloodGroup: any;
    DateOfBirth: any;

    Education: any;
    Email: any;
    EmpId: any;
    FirstName: any;
    Gender: any;
    Images: any;
    Initial: any;
    JobTitle: any;
    JoiningDate: any;
    LastName: any;
    MaritalStatus: any;
    Mobile: any;
    Name: any;
    Nationality: any;
    PersonalEmail: any;
    PersonnelNumber: any;
    Phone: any;
    Religion: any;
    ReportingManager: any;
    Salary: any;
    VisaExpiry: any;
    WorkExperience: any;
    VisaNo: any;
    VisaIssue: any
    AlternateName: any;
    IsManager: any;
    WorkerId: any;
    Department: any;    

    PassportIssueDate: any;
    PassportPlaceOfIssue: any;
    PassportNumber: any;
    PassportExpiryDate :any;

    CivilIdNumber:any;
    CivilIdIssueDate:any;
    CivilIdExpiryDate :any;

    WorkerIdentification:WorkerIdentificationModel[];
    WorkerEmployement:WorkerEmployementModel[]
} 