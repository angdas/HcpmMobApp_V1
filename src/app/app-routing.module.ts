import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'myprofile', loadChildren: () => import('./pages/manager-section/my-profile/my-profile.module').then(m => m.MyProfilePageModule) },
  { path: 'tab', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'timesheet-home', loadChildren: () => import('./pages/timesheet-home/timesheet-home.module').then(m => m.TimesheetHomePageModule) },
  { path: 'leave-home', loadChildren: () => import('./pages/leave-home/leave-home.module').then(m => m.LeaveHomePageModule) },
  { path: 'leave-edit', loadChildren: () => import('./pages/leave-edit/leave-edit.module').then(m => m.LeaveEditPageModule) },
  { path: 'leave-add', loadChildren: () => import('./pages/leave-add/leave-add.module').then(m => m.LeaveAddPageModule) },
  { path: 'timesheet-add/:pageType', loadChildren: () => import('./pages/timesheet-add/timesheet-add.module').then(m => m.TimesheetAddPageModule) },
  { path: 'timesheet-header', loadChildren: () => import('./pages/timesheet-header/timesheet-header.module').then(m => m.TimesheetHeaderPageModule) },
  { path: 'timesheet-line', loadChildren: () => import('./pages/timesheet-line/timesheet-line.module').then(m => m.TimesheetLinePageModule) },
  { path: 'payslip', loadChildren: () => import('./pages/payslip/payslip.module').then(m => m.PayslipPageModule) },
  { path: 'document-request', loadChildren: () => import('./pages/document-request/document-request.module').then(m => m.DocumentRequestPageModule) },
  { path: 'document-request-line', loadChildren: () => import('./pages/document-request-line/document-request-line.module').then(m => m.DocumentRequestLinePageModule) },
  { path: 'document-request-add', loadChildren: () => import('./pages/document-request-add/document-request-add.module').then(m => m.DocumentRequestAddPageModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'leave-line', loadChildren: () => import('./pages/leave-line/leave-line.module').then(m => m.LeaveLinePageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'document-request-header', loadChildren: () => import('./pages/document-request-header/document-request-header.module').then(m => m.DocumentRequestHeaderPageModule) },
  
  {
    path: 'settingsspy',
    loadChildren: () => import('./pages/settingsspy/settingsspy.module').then( m => m.SettingsspyPageModule)
  },
  {
    path: 'loginspy',
    loadChildren: () => import('./pages/loginspy/loginspy.module').then( m => m.LoginspyPageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
