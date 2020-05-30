import { Component, OnInit, Injector } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { BasePage } from '../../base/base.page';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPageForLine extends BasePage implements OnInit {

  public hours:any;
  public internalComment:any;
  public externalComment:any;

  constructor(injector: Injector, 
    private popoverController: PopoverController, 
    private navParams: NavParams) { 
      super(injector);
    }

  ngOnInit() {
    this.hours = this.navParams.data.Hours;
    this.internalComment = this.navParams.data.InternalComment;
    this.externalComment = this.navParams.data.ExternalComment;
  }

  async closePopup() {
    if(this.hours){
      await this.popoverController.dismiss([this.hours,this.internalComment,this.externalComment]);
    }else{
      this.hours = 0;
      this.internalComment = "";
      this.externalComment = "";
      await this.popoverController.dismiss([this.hours,this.internalComment,this.externalComment]);
    }
  }
  
  async saveData() {
    await this.popoverController.dismiss([this.hours,this.internalComment,this.externalComment]);
  }
}
