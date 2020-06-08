import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DocumentRequestLinePage } from './document-request-line.page';
import { PendingChangesGuard } from 'src/app/providers/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: DocumentRequestLinePage,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentRequestLinePage]
})
export class DocumentRequestLinePageModule {}
