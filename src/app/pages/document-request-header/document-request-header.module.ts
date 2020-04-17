import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DocumentRequestHeaderPage } from './document-request-header.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentRequestHeaderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentRequestHeaderPage]
})
export class DocumentRequestHeaderPageModule {}
