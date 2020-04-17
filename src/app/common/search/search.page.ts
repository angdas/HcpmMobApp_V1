import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Input() searchList: any[] = [];
  @Input() bindLabel: any;
  searchedItem: any = "";

  constructor(navParams: NavParams, public modalController: ModalController) {
    this.searchList = navParams.get('searchList');
    console.log(this.searchList)
    this.bindLabel = navParams.get('bindLabel');
  }
  ngOnInit() {
  }
  
  async closeModal() {
    await this.modalController.dismiss();
  }

  getTextLabel(item: any) {
    return item[this.bindLabel];
  }

  async selectedItem(item){
    await this.modalController.dismiss(item);
  }
}
