import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from 'src/app/providers/events/event.service';
import { BasePage } from '../base/base.page';

declare var $: any;
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BasePage {

  public authenticated: boolean = false;
  public isManager: boolean;

  constructor(injector: Injector,
    public events: Events, 
    public router: Router) {
      super(injector);
      this.isManagerEvent();
  }

  ionViewWillEnter() {
    this.isManagerEvent();
    this.authenticated = this.dataSPYService.isAuthenticated;
  }

  homeClicked() {
    this.router.navigateByUrl("/tab/tabs/manager-profile");
  }

  approvalClicked() {
    this.router.navigateByUrl("/tab/tabs/my-workers");
  }

  isManagerEvent() {
    this.isManager = this.dataSPYService.worker.IsManager;
    this.events.subscribe("isManager", res => {
      this.isManager = res;
    })
  }
}
