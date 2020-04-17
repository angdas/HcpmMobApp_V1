import { NavController } from '@ionic/angular';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParameterService } from 'src/app/providers/parameterService/parameter.service';
import { Events } from 'src/app/providers/events/event.service';
declare var $: any;
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  authenticated: boolean = false;
  isManager: boolean;
  constructor(public paramService: ParameterService, public events: Events, public router: Router) {

    this.isManagerEvent();

    this.events.subscribe("authenticated", res => {
      this.authenticated = res;
    })
  }


  ionViewWillEnter() {
    this.isManagerEvent();
    this.authenticated = this.paramService.authenticated;
  }

  homeClicked() {
    this.router.navigateByUrl("/tab/tabs/manager-profile");
  }

  approvalClicked() {
    this.router.navigateByUrl("/tab/tabs/my-workers");
  }


  isManagerEvent() {
    console.log("hi")
    this.isManager = this.paramService.isManager;
    this.events.subscribe("isManager", res => {
      this.isManager = res;
    })
  }
}
