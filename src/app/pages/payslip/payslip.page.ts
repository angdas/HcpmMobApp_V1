import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PayslipModel } from 'src/app/models/worker/workerPayroll.interface';
import { BasePage } from '../base/base.page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.page.html',
  styleUrls: ['./payslip.page.scss'],
})
export class PayslipPage extends BasePage implements OnInit {

  public pageType: any;
  public selectedMonth: any;
  public payslip: PayslipModel[] = [];

  constructor(injector: Injector,
    private activateRoute: ActivatedRoute,
    private opener: FileOpener,
    private file: File) {
    super(injector);
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
    if (this.isCordova()) {
      this.saveAndOpenPdf(this.payslip[0].Payslip, "payslip.pdf")
    } else {
      const linkSource = 'data:application/pdf;base64,' + this.payslip[0].Payslip;
      const downloadLink = document.createElement("a");
      const fileName = "sample.pdf";

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  async saveAndOpenPdf(pdf: string, filename: string) {
    await this.showLoadingView({ showOverlay: true });
    const writeDirectory = this.isIos() ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(pdf, 'application/pdf'), { replace: true })
      .then(() => {
        this.dismissLoadingView();
        this.opener.open(writeDirectory + filename, 'application/pdf').then((val) => {
          console.log(val);
        }).catch(() => {
          this.dismissLoadingView();
          console.log('Error opening pdf file');
        });
      }).catch(() => {
        this.dismissLoadingView();
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
    this.apiService.getPayslip(this.dataSPYService.worker.WorkerId, month).subscribe(res => {
      this.payslip = res;
      console.log(res);
    }, error => {
      this.translate.get(error).subscribe(str => this.showToast(str));
    })
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
