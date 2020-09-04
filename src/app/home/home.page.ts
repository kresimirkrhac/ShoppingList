import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { ShoppingCart, ShoppingService } from '../shopping.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  shopCarts: ShoppingCart[] = null;
  popover: HTMLIonPopoverElement;
  canDelete: boolean = false;

  constructor(private shopService: ShoppingService, public popoverController: PopoverController) { }

  ngOnInit(): void {
    this.shopService.getShopCarts()
    .subscribe(data => {
      const shopCarts = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as object)
        } as ShoppingCart;
      });
      this.shopCarts = shopCarts.sort((a, b) => a.productName.localeCompare(b.productName));
      this.canDelete = this.hasCheked();
    });
  }

  remove(cart: ShoppingCart) {
    this.shopService.removeShopCart(cart.id);
  }

  checkItem(item: ShoppingCart, slidingItem: any) {
    item.checked = !item.checked;
    this.shopService.updateShopCart(item, item.id);
    this.canDelete = this.hasCheked();
    slidingItem.close();
  }

  checkAll(event) {
    this.presentPopover(event, 'Označi', 'Označiti da je sve kupljeno?', 'Označi', 'warning',
    () => {
        this.shopCarts.forEach(item => { 
          if (item.checked == false) {
            item.checked = true;
            this.shopService.updateShopCart(item, item.id);
          }
        });
        this.canDelete = this.hasCheked();
        this.popover.dismiss();
    });
  }

  removeAll() {
    this.presentPopover(event, 'Obriši sve', 'Obrisati sve označene artikle?', 'Obriši', 'danger',
    () => {
      this.shopCarts.forEach(item => 
      { if( item.checked == true && item.id) {
        this.shopService.removeShopCart(item.id);
      } 
      });
      this.popover.dismiss();
    });
  }

  private hasCheked() {
    if (this.shopCarts && this.shopCarts.length > 0) {
      return !this.shopCarts.every(item => item.checked == false);
    }
    return false;
  }

  private async presentPopover(ev: any, title: string, message: string, buttonText: string, buttonColor: string, action: Function) {
    this.popover = await this.popoverController.create({
      animated: true,
      component: PopoverComponent,
      event: ev,
      componentProps: { popoverController: this.popoverController, title, message, buttonText, buttonColor, action }, 
      translucent: true
    });
    this.popover.style.cssText = '--min-width: 260px; --max-width: 270px;';
    return await this.popover.present();
  }
}
