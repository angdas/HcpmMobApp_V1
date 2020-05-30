import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LeaveAppLineContract } from 'src/app/models/leave/leaveAppLineContract.interface';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx'
import { LeaveAttachmentModel } from 'src/app/models/leave/leaveAttachment.model';
import { AlertService } from 'src/app/providers/alert.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.page.html',
  styleUrls: ['./leave-edit.page.scss'],
})
export class LeaveEditPage extends BasePage implements OnInit {

  leaveApp: LeaveAppTableContract = {} as LeaveAppTableContract;
  editable: boolean;
  pageType: any;
  resupmtion: boolean;
  resumptionUpdated: boolean;
  dataChangeNotSaved: boolean = false;

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute,
    private alertService: AlertService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File) {
      super(injector);
      this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.leaveApp = this.dataSPYService.leaveApp;
    this.editable = this.leaveApp.IsEditable;
    if (this.leaveApp.Status.toUpperCase() == "APPROVED") {
      this.resupmtion = this.leaveApp.ResumptionInitiated
    }
    /*
    this.sub = this.dataService.getLeaveEditDetails$.subscribe(res => {
      console.log(res);
      this.leaveApp = res;
      this.editable = this.leaveApp.IsEditable;

      if (this.leaveApp.Status.toUpperCase() == "APPROVED") {
        this.resupmtion = this.leaveApp.ResumptionInitiated
      }
    });*/
  }


  @HostListener('change', ['$event'])
  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.dataChangeNotSaved = true;
  }

  @HostListener('window:beforeunload')
  isDataSaved(): boolean {
    let ret: boolean;
    if (this.dataChangeNotSaved) {
        this.alertService.AlertConfirmation('Warning', 'Changes was not Updated. Sure you want to leave this page?').subscribe(res => {
        ret = res;
      })
    }
    else ret = true;
    return ret;
  }

  ngOnDestroy() {
    this.dataSPYService.leaveApp = null;
    if (this.resupmtion) {
      if (!this.resumptionUpdated) {
        this.leaveApp.ResumptionInitiated = false;
      }
    }
  }

  saveLeave() {
    this.updateLeaveDetails();
  }

  async openCalendarForActual(leaveLine: LeaveAppLineContract) {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Select Date',
      color: 'primary'
    };
    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });
    myCalendar.present();
    myCalendar.onDidDismiss().then((dataReturned) => {
      leaveLine.ActualStartDate = new Date(dataReturned.data.from.dateObj);
      leaveLine.ActualEndDate = new Date(dataReturned.data.to.dateObj);
      console.log(dataReturned)
    })
  }

  async openCalendar(leaveLine: LeaveAppLineContract) {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Select Date',
      color: 'primary'
    };
    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });
    myCalendar.present();
    myCalendar.onDidDismiss().then((dataReturned) => {
      leaveLine.StartDate = new Date(dataReturned.data.from.dateObj);
      leaveLine.EndDate = new Date(dataReturned.data.to.dateObj);
      console.log(dataReturned)
    })
  }

  async updateLeaveDetails() {
    await this.showLoadingView({ showOverlay: true }); 
    this.apiService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {      
      console.log(res);
      this.dismissLoadingView(); 
      if (res && this.resupmtion) {
        this.resumptionUpdated = true;
      }        
      this.translate.get('LEAVE_SAVED').subscribe(str => this.showAlert(str));
      if (this.pageType == "manager") {
        this.router.navigateByUrl("/tab/tabs/manager-profile/manager_leave_home/manager");
      } else {
        this.router.navigateByUrl("leave-home");
      }
    }, error => {
      this.dismissLoadingView(); 
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(async (imageData) => {
      await this.showLoadingView({ showOverlay: true }); 
      let atttachment = {} as LeaveAttachmentModel;
      atttachment.Attachments = imageData;
      atttachment.DataArea = this.dataSPYService.workerDataArea;
      atttachment.FileExtension = "jpeg";
      atttachment.TableNumber = this.leaveApp.Number;
      this.apiService.updateLeaveAttachment(atttachment).subscribe(res => {
        console.log(res);
      }, error => {
        this.dismissLoadingView(); 
        this.translate.get(error).subscribe(str => this.showToast(str));
      })
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}
