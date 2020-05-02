import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TimesheetAddPage } from './timesheet-add.page';

import { CommentPage } from './comment/comment.page';
import { SearchPage } from 'src/app/common/search/search.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PendingChangesGuard } from 'src/app/providers/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: TimesheetAddPage,
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
  entryComponents:[CommentPage,SearchPage],
  declarations: [TimesheetAddPage,CommentPage,SearchPage]
})
export class TimesheetAddPageModule {}
