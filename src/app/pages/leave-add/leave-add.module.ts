import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveAddPage } from './leave-add.page';
import { CalendarModule } from "ion2-calendar";
const routes: Routes = [
  {
    path: '',
    component: LeaveAddPage
  }
];

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,    
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveAddPage]
})
export class LeaveAddPageModule {}
