import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DocumentRequestPage } from './document-request.page';
import { DocumentRequestElementPage } from './document-request-element/document-request-element.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocumentRequestPage,DocumentRequestElementPage]
})
export class DocumentRequestPageModule {}
