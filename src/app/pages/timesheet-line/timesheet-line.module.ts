import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TimesheetLinePage } from './timesheet-line.page';

import { CommentPageForLine } from './comment/comment.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchPage } from 'src/app/common/search/search.page';
import { PendingChangesGuard } from 'src/app/providers/pending-changes.guard';
const routes: Routes = [
  {
    path: '',
    component: TimesheetLinePage,
    canDeactivate: [PendingChangesGuard]
  } 
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes)
  ],
  entryComponents:[CommentPageForLine],
  declarations: [TimesheetLinePage,CommentPageForLine]
})
export class TimesheetLinePageModule {}
