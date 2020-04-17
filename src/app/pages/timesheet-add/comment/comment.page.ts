import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  hours:any;
  internalComment:any;
  externalComment:any;

  constructor(private popoverController: PopoverController, private navParams: NavParams) { }

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
