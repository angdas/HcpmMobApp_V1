import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AxService } from 'src/app/providers/axservice/ax.service';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { DataService } from 'src/app/providers/dataService/data.service';
import { StorageService } from 'src/app/providers/storageService/storage.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ToastController, LoadingController } from '@ionic/angular';
import { PayslipModel } from 'src/app/models/worker/workerPayroll.interface';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.page.html',
  styleUrls: ['./payslip.page.scss'],
})
export class PayslipPage implements OnInit {

  pageType: any;
  selectedMonth: any;
  payslip: PayslipModel[] = [];
  isPayroll: boolean = false;
  totalAmount: any = 0;
  currency: string;

  constructor(public axService: AxService, public router: Router, public dataService: DataService, public platform: Platform,
    public paramService: ParameterService, public storageServ: StorageService,
    private activateRoute: ActivatedRoute, private opener: FileOpener, private file: File, public toastController: ToastController,
    public loadingController: LoadingController
  ) {


    this.pageType = this.activateRoute.snapshot.paramMap.get('pageType');
  }


  ngOnInit() {

  }

  monthValueChanged() {
    var monthDate: Date = new Date(this.selectedMonth);
    var sDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 2);
    this.getPayslipPdf(sDate);
  }


  downloadPayslip() {

    this.saveAndOpenPdf(this.payslip[0].Payslip, "statement.pdf")
  }
  async saveAndOpenPdf(pdf: string, filename: string) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      duration: 4000
    });
    await loading.present();
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    // const writeDirectory = this.file.dataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(pdf, 'application/pdf'), { replace: true })
      .then(() => {
        loading.dismiss();
        this.opener.open(writeDirectory + filename, 'application/pdf').then((val) => {
          console.log(val);
        })
          .catch(() => {
            console.log('Error opening pdf file');
          });
      })
      .catch(() => {
        loading.dismiss();
        console.error('Error writing pdf file');
      });
  }
  convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getPayslipPdf(month) {
    this.axService.getPayslip(this.paramService.emp.WorkerId, month).subscribe(res => {
      this.payslip = res;
      console.log(res);
    }, error => {
      this.errorToast("Error Getting Payslip Details");
    })
  }

  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getMonths(from, to) {
    var startDate = moment(from);
    var endDate = moment(to);

    var result = [];

    var currentDate = startDate.clone();

    while (currentDate.isBefore(endDate)) {
      result.push({ month: endDate.format("YYYY-MM-01") });
      endDate.add(-1, 'month');
    }
    return result;
  }

}
