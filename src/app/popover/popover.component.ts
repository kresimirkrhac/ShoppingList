import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ShoppingCart } from '../shopping.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  pop: PopoverController;
  title: string;
  message: string;
  buttonText: string;
  buttonColor: string;
  action: Function;

  constructor(navParams: NavParams) {
    this.pop = navParams.get('popoverController');
    this.title = navParams.get('title');
    this.message = navParams.get('message');
    this.buttonText = navParams.get('buttonText');
    this.buttonColor = navParams.get('buttonColor');
    this.action = navParams.get('action');
   }

  ngOnInit() { }

}
