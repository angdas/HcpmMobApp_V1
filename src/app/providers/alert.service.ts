import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Observable, from, Subscription } from 'rxjs';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private toastController: ToastController) { }

  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  AlertConfirmation(headerTxt, msg): Observable<any> {
    var self = this;
    return from(
      new Promise(async function (resolve, reject) {
        const alert = await self.alertController.create({
          header: headerTxt,
          message: msg,
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                resolve(true)
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: (blah) => {
                resolve(false);
              }
            }
          ]
        });
        alert.present();
      })
    )
  }

  AlertMessage(headerTxt, msg): Subscription {
    var self = this;
    return from(
      new Promise(async function (resolve, reject) {
        const alert = await self.alertController.create({
          header: headerTxt,
          message: msg,
          buttons: ["OK"]
        });
    
        await alert.present();
      })
    ).subscribe(res=>{})
  }

  ApprovalAlertConfirmation(headerTxt, msg,inputArr): Observable<any> {
    var self = this;
    return from(
      new Promise(async function (resolve, reject) {
        const alert = await self.alertController.create({
          header: headerTxt,
          message: msg,
          inputs:inputArr,
          buttons: [
            {
              text: 'Yes',
              handler: (data) => {
                resolve(data)
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: (blah) => {
                resolve(false);
              }
            }
          ]
        });
        alert.present();
      })
    )
  }
}
