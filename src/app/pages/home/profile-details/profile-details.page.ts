import { Component, OnInit, Injector } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { LeaveBalanceContract } from 'src/app/models/leave/leaveBalanceContract.interface';
import { BasePage } from '../../base/base.page';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage extends BasePage implements OnInit {

  public emp: EmployeeModel = {} as EmployeeModel;
  public leaveBalance: LeaveBalanceContract[];
  public pageType: any = "";

  constructor(injector: Injector,
    private navParams: NavParams) { 
      super(injector);
    }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.emp = this.navParams.data.emp;
    this.pageType = this.navParams.data.type;
    this.leaveBalance = this.navParams.data.leaveDetails;
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  checkDate(date){
    if(new Date(date).getFullYear() == 1900){
      return false;
    }else{
      return true;
    }
  }
}
