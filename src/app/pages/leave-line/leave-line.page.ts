import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/providers/dataService/data.service';

import { AxService } from 'src/app/providers/axservice/ax.service';
import { AlertController } from '@ionic/angular';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';

import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';

@Component({
  selector: 'app-leave-line',
  templateUrl: './leave-line.page.html',
  styleUrls: ['./leave-line.page.scss'],
})
export class LeaveLinePage implements OnInit {
  leaveApp:LeaveAppTableContract = {} as LeaveAppTableContract;
  sub:any;
  editable:boolean;
  pageType:any;
  colorList: any = [];

  constructor(public dataService:DataService,public axService:AxService,public router: Router,private activateRoute: ActivatedRoute,
    public alertController: AlertController,public paramService: ParameterService,) {

      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
      this.colorList = this.paramService.colorList;
     }

  ngOnInit() {
    this.sub = this.dataService.getLeaveLineDetails$.subscribe(res=>{
      this.leaveApp = res;
      console.log(res);
      this.editable = this.leaveApp.IsEditable;
    });
  }
 
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editLeaveLine() {    
    this.dataService.setLeaveEditDetails(this.leaveApp);
    
    if(this.pageType=='worker'){
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    }else{
      this.router.navigateByUrl('leave-edit');
    }
  }

  addLeaveLine() {
    this.dataService.setLeaveLineAddDetails(this.leaveApp);
    if(this.pageType == 'manager'){
      this.router.navigateByUrl('/tab/tabs/manager-profile/manager_leave_add/manager');
    }else{
      this.router.navigateByUrl("leave-add");
    }
  }
  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    return await alert.present();
  }


}
