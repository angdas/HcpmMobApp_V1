import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/providers/dataService/data.service';

import { AxService } from 'src/app/providers/axservice/ax.service';
import { LeaveAppTableContract } from 'src/app/models/leave/leaveAppTableContact.interface';
import { LoadingController, ModalController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LeaveAppLineContract } from 'src/app/models/leave/leaveAppLineContract.interface';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx'
import { LeaveAttachmentModel } from 'src/app/models/leave/leaveAttachment.model';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { AlertService } from 'src/app/providers/alert.service';
@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.page.html',
  styleUrls: ['./leave-edit.page.scss'],
})
export class LeaveEditPage implements OnInit {

  leaveApp: LeaveAppTableContract = {} as LeaveAppTableContract;
  sub: any;
  editable: boolean;
  pageType: any;

  resupmtion: boolean;
  resumptionUpdated: boolean;
  dataChangeNotSaved: boolean = false;


  constructor(public dataService: DataService, public axService: AxService, public router: Router, private activateRoute: ActivatedRoute,
    public alertServ: AlertService, public loadingController: LoadingController, public modalController: ModalController,
    private camera: Camera, public paramServ: ParameterService,
    public actionSheetController: ActionSheetController,
    private file: File) {

    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }

  ngOnInit() {
    this.sub = this.dataService.getLeaveEditDetails$.subscribe(res => {
      console.log(res);
      this.leaveApp = res;
      this.editable = this.leaveApp.IsEditable;

      if (this.leaveApp.Status.toUpperCase() == "APPROVED") {
        this.resupmtion = this.leaveApp.ResumptionInitiated
      }
    });
  }


  @HostListener('change', ['$event'])
  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.dataChangeNotSaved = true;
  }

  @HostListener('window:beforeunload')
  isDataSaved(): boolean {
    let ret;
    if (this.dataChangeNotSaved) {
      this.alertServ.AlertConfirmation('Warning', 'Changes was not Updated. Sure you want to leave this page?').subscribe(res => {
        ret = res;
      })
    }
    else ret = true;

    return ret;
  }

  ngOnDestroy() {
    if (this.resupmtion) {
      if (!this.resumptionUpdated) {
        this.leaveApp.ResumptionInitiated = false;
      }
    }
    this.sub.unsubscribe();
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

    let myCalendar = await this.modalController.create({
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

    let myCalendar = await this.modalController.create({
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
    const loading = await this.loadingController.create({
      spinner: "lines",
      duration: 3000,
      message: 'Please wait...',
    });
    await loading.present();

    this.axService.updateEmplLeaveAppl(this.leaveApp).subscribe(res => {
      loading.dismiss();
      console.log(res);

      if (!res) {
        this.alertServ.errorToast("Connection error")
      } else {
        if (this.resupmtion) {
          this.resumptionUpdated = true;
        }
        this.alertServ.AlertMessage("Success", "Leave Saved Successfully")
        if (this.pageType == "manager") {
          this.router.navigateByUrl("/tab/tabs/manager-profile/manager_leave_home/manager");
        } else {
          this.router.navigateByUrl("leave-home");
        }

      }
    }, error => {
      this.alertServ.errorToast("Error While Updating Leave");
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
    this.camera.getPicture(options).then((imageData) => {
      let atttachment = {} as LeaveAttachmentModel;

      atttachment.Attachments = imageData;
      atttachment.DataArea = this.paramServ.dataAreaObj.DataArea;
      atttachment.FileExtension = "jpeg";
      atttachment.TableNumber = this.leaveApp.Number;

      this.axService.updateLeaveAttachment(atttachment).subscribe(res => {
        console.log(res);
      })
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
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
