import { Component, OnInit, Input } from '@angular/core';

import { ModalController, NavParams } from '@ionic/angular';

import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';
@Component({
  selector: 'profile-detail',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {

  emp: EmployeeModel = {} as EmployeeModel;
  leaveBalance: LeaveBalanceContract;
  pageType: any = "";

  constructor(public modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.emp = this.navParams.data.emp;
    this.pageType = this.navParams.data.type;
    this.leaveBalance = this.navParams.data.leaveDetails;
  }


  async closeModal() {
    await this.modalController.dismiss();
  }

  checkDate(date){
    if(new Date(date).getFullYear() == 1900){
      return false;
    }else{
      return true;
    }
  }
}
