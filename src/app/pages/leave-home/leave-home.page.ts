import { Component, OnInit } from '@angular/core';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { DataService } from 'src/app/providers/dataService/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { EmployeeModel } from 'src/app/models/worker/worker.interface';
import { LoadingController, ToastController } from '@ionic/angular';
import { Events } from 'src/app/providers/events/event.service';
@Component({
  selector: 'app-leave-home',
  templateUrl: './leave-home.page.html',
  styleUrls: ['./leave-home.page.scss'],
})
export class LeaveHomePage implements OnInit {

  selectedTab = 'all';
  leaveAppList: LeaveAppTableContract[];
  authenticated: boolean;
  pageType: any;
  searchedItem:any;

  workerLeaveList: LeaveAppTableContract[];

  constructor(public axService: AxService, public router: Router, public dataService: DataService,
    public paramService: ParameterService, public events: Events, public storageServ: StorageService,
    private activateRoute: ActivatedRoute, public loadingController: LoadingController, public toastController: ToastController) {


    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');


    this.events.subscribe("authenticated", res => {
      if (res) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
        paramService.authenticated = false;
        storageServ.clearStorage();
        router.navigateByUrl("/home");
      }
    })
  }

  ngOnInit() {
    if (this.pageType == "worker") {
      this.myWorkersLeave();
    } else {
      this.getLeaveDetails();
    }
  }

  async myWorkersLeave() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.axService.GetMyWorkersLeaveApprovals(this.paramService.emp.WorkerId).subscribe(res => {
      loading.dismiss();
      this.workerLeaveList = res;
      console.log(this.workerLeaveList);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
    })
  }


  ionViewWillEnter() {
    this.dataService.getleaveList$.subscribe(res => {
      if (res) {
        this.leaveAppList = res;
      }
    })
  }

  async getLeaveDetails() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();
    this.axService.getLeaveDetails(this.paramService.emp.WorkerId).subscribe(res => {
      loading.dismiss();
      this.dataService.setLeaveList(res);
      this.leaveAppList = res;
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentToast("Connection Error");
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}
