import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { MyProfilePage } from '../manager-section/my-profile/my-profile.page';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'my-workers',
        children: [
          { path: '', loadChildren: () => import('../manager-section/my-workers/my-workers.module').then(m => m.MyWorkersPageModule) },
          { path: 'worker_timesheet_home/:pageType', loadChildren: () => import('../timesheet-home/timesheet-home.module').then(m => m.TimesheetHomePageModule) },
          
          { path: 'worker_timesheet_header/:pageType', loadChildren: () => import('../timesheet-header/timesheet-header.module').then(m => m.TimesheetHeaderPageModule) },
          { path: 'worker_timesheet_line/:pageType', loadChildren: () => import('../timesheet-line/timesheet-line.module').then(m => m.TimesheetLinePageModule) },
          
          { path: 'worker_leave_home/:pageType', loadChildren: () => import('../leave-home/leave-home.module').then(m => m.LeaveHomePageModule) },
          { path: 'worker_leave_edit/:pageType', loadChildren: () => import('../leave-edit/leave-edit.module').then(m => m.LeaveEditPageModule) },
          
          { path: 'worker_document_request/:pageType',loadChildren: () => import('../document-request/document-request.module').then(m => m.DocumentRequestPageModule)},
          { path: 'worker_document_request_line/:pageType',loadChildren: () => import('../document-request-line/document-request-line.module').then(m => m.DocumentRequestLinePageModule)},
        ]
      },
      {
        path: 'manager-profile',
        children: [
          { path: '', loadChildren: () => import('../manager-section/my-profile/my-profile.module').then(m => m.MyProfilePageModule) },
          { path: 'manager_Profile_details/:pageType', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },

          { path: 'manager_timesheet_home/:pageType', loadChildren: () => import('../timesheet-home/timesheet-home.module').then(m => m.TimesheetHomePageModule) },
          
          { path: 'manager_timesheet_header/:pageType', loadChildren: () => import('../timesheet-header/timesheet-header.module').then(m => m.TimesheetHeaderPageModule) },
          { path: 'manager_timesheet_line/:pageType', loadChildren: () => import('../timesheet-line/timesheet-line.module').then(m => m.TimesheetLinePageModule) },

          { path: 'manager_leave_home/:pageType', loadChildren: () => import('../leave-home/leave-home.module').then(m => m.LeaveHomePageModule) },
          { path: 'manager_leave_line/:pageType', loadChildren: () => import('../leave-line/leave-line.module').then(m => m.LeaveLinePageModule)},
          { path: 'manager_leave_edit/:pageType', loadChildren: () => import('../leave-edit/leave-edit.module').then(m => m.LeaveEditPageModule) },
          { path: 'manager_leave_add/:pageType', loadChildren: () => import('../leave-add/leave-add.module').then(m => m.LeaveAddPageModule)},

          { path: 'manager_payslip/:pageType', loadChildren: () => import('../payslip/payslip.module').then(m => m.PayslipPageModule)},
          { path: 'manager_document_request/:pageType',loadChildren: () => import('../document-request/document-request.module').then(m => m.DocumentRequestPageModule)},
          { path: 'manager_document_request_line/:pageType',loadChildren: () => import('../document-request-line/document-request-line.module').then(m => m.DocumentRequestLinePageModule)},
          { path: 'manager_document_request_add/:pageType',loadChildren: () => import('../document-request-add/document-request-add.module').then(m => m.DocumentRequestAddPageModule)},
          { path: 'manager_settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)},
        ]
      }
    ]
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
