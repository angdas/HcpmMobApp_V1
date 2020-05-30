import { Component, OnInit, Injector } from '@angular/core';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-leave-line',
  templateUrl: './leave-line.page.html',
  styleUrls: ['./leave-line.page.scss'],
})
export class LeaveLinePage extends BasePage implements OnInit {
  leaveApp:LeaveAppTableContract = {} as LeaveAppTableContract;
  sub:any;
  editable:boolean;
  pageType:any;
  colorList: any = [];

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
      this.colorList = this.dataSPYService.colorList;
     }

  ngOnInit() {
    this.leaveApp = this.dataSPYService.leaveApp;      
    this.editable = this.leaveApp.IsEditable;
    /*
    this.sub = this.dataService.getLeaveLineDetails$.subscribe(res=>{
      this.leaveApp = res;
      console.log(res);
      this.editable = this.leaveApp.IsEditable;
    });*/
  }
 
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  editLeaveLine() {    
    //this.dataService.setLeaveEditDetails(this.leaveApp);
    this.dataSPYService.leaveApp = this.leaveApp;
    if(this.pageType=='worker'){
      this.router.navigateByUrl('/tab/tabs/my-workers/worker_leave_edit/worker');
    }else{
      this.router.navigateByUrl('leave-edit');
    }
  }

  addLeaveLine() {
    //this.dataService.setLeaveLineAddDetails(this.leaveApp);
    this.dataSPYService.leaveApp = this.leaveApp;
    if(this.pageType == 'manager'){
      this.router.navigateByUrl('/tab/tabs/manager-profile/manager_leave_add/manager');
    }else{
      this.router.navigateByUrl("leave-add");
    }
  }
}
