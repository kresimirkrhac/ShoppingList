import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController  } from '@ionic/angular';
import { ShoppingService, ShoppingCart } from '../shopping.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  shopCardId = null;
  shopCart: ShoppingCart;
  constructor(
    private shopService: ShoppingService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private nav: NavController
  ) { }

  ngOnInit() {
    this.shopCardId = this.route.snapshot.params['id'];
    if (this.shopCardId ) {
      this.loadShopCart();
    } else {
      this.shopCart = {productName: '', amount: 0, unit: '' ,checked: false};
    }
  }

  async loadShopCart() {
    const loading = await this.loadingCtrl.create({
      message: 'Učitavam ...'
    });
    await loading.present();
    this.shopService.getShopCart(this.shopCardId).subscribe((shopCart: ShoppingCart) => {
      this.shopCart = shopCart;
      loading.dismiss();
    }, (error) => {
      this.presentToast(`Greška: ${error}`);
      loading.dismiss();
    });
  }

  async saveShopCart() {
    const loading = await this.loadingCtrl.create({
      message: 'Spremam ...'
    });
    await loading.present();
    if (this.shopCardId) {
      this.shopService.updateShopCart(this.shopCart, this.shopCardId).then(() => {
        loading.dismiss();
        this.nav.back();
      }).catch((error) => {
        this.presentToast(`Greška: ${error}`, 3000);
        loading.dismiss();
      });
    } else {
      this.shopService.addShopCart(this.shopCart).then(() => {
        loading.dismiss();
        this.nav.back();
      }).catch((error) => {
        this.presentToast(`Greška: ${error}`);
        loading.dismiss();
      });
    }
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }
}
