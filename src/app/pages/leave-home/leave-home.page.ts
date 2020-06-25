import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-leave-home',
  templateUrl: './leave-home.page.html',
  styleUrls: ['./leave-home.page.scss'],
})
export class LeaveHomePage extends BasePage implements OnInit {

  selectedTab = 'all';
  public leaveAppList: LeaveAppTableContract[];
  authenticated: boolean;
  pageType: any;
  searchedItem: any;

  public workerLeaveList: LeaveAppTableContract[];

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute) {
    super(injector);
    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    if (this.pageType == "worker") {
      this.myWorkersLeave();
    } else {
      this.getLeaveDetails();
    }
  }

  async myWorkersLeave() {
    await this.showLoadingView({ showOverlay: true });
    this.apiService.GetMyWorkersLeaveApprovals(this.dataSPYService.worker.WorkerId).subscribe(res => {
      this.dataSPYService.myWorkerLeaveAppList = res;
      this.storageService.setMyWorkerLeaveAppList(res);
      this.workerLeaveList = res;
      this.dismissLoadingView();
      console.log(this.workerLeaveList);
    }, error => {
      this.dismissLoadingView();
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  ionViewWillEnter() {
    this.leaveAppList = this.dataSPYService.leaveAppList;
    this.workerLeaveList = this.dataSPYService.myWorkerLeaveAppList;
  }

  async getLeaveDetails() {
    await this.showLoadingView({ showOverlay: true });
    this.apiService.getLeaveDetails(this.dataSPYService.worker.WorkerId).subscribe(res => {
      this.dataSPYService.leaveAppList = res;
      this.storageService.setLeaveAppList(res);
      this.leaveAppList = res;
      this.dismissLoadingView();
      console.log(res);
    }, error => {
      this.dismissLoadingView();
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  addLeave() {
    if (this.pageType == 'manager') {
      this.router.navigateByUrl('/tab/tabs/manager-profile/manager_leave_add/manager');
    } else {
      this.router.navigateByUrl("leave-add");
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      if (this.pageType == 'worker') {
        this.myWorkersLeave();
      } else {
        this.getLeaveDetails();
      }
      event.target.complete();
    }, 2000);
  }
}
