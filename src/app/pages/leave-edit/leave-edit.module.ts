import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LeaveEditPage } from './leave-edit.page';
import { CalendarModule } from 'ion2-calendar';
import { PendingChangesGuard } from 'src/app/providers/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: LeaveEditPage,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveEditPage]
})
export class LeaveEditPageModule {}
