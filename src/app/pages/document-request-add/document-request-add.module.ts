import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { DocumentRequestAddPage } from './document-request-add.page';
import { PendingChangesGuard } from 'src/app/providers/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: DocumentRequestAddPage,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentRequestAddPage]
})
export class DocumentRequestAddPageModule {}
