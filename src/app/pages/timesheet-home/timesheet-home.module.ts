import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TimesheetHomePage } from './timesheet-home.page';

import { TimesheetHomeElementPage } from './timesheet-home-element/timesheet-home-element.page';
const routes: Routes = [
  {
    path: '',
    component: TimesheetHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TimesheetHomePage,TimesheetHomeElementPage]
})
export class TimesheetHomePageModule {}
