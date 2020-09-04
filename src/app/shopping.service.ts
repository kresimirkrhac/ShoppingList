import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ShoppingCart {
  id?: string;
  productName: string;
  amount: number;
  unit?: string;
  checked?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private collectionName = 'ShoppingCarts';

  constructor(private firestore: AngularFirestore) {
  }

  getShopCarts() {
    return this.firestore.collection<ShoppingCart[]>(this.collectionName).snapshotChanges();
  }

  getShopCart(id: string): Observable<ShoppingCart> {
    const shopCartDocuments = this.firestore.doc<ShoppingCart>(`${this.collectionName}/` + id);
    return shopCartDocuments.snapshotChanges()
      .pipe(
        map(changes => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }))
  }

  updateShopCart(shopCart: ShoppingCart, id: string) {
    return this.firestore.doc(`${this.collectionName}/` + shopCart.id).update(shopCart);
  }

  addShopCart(shopCart: ShoppingCart){
    return this.firestore.collection(this.collectionName).add(shopCart);
  }

  removeShopCart(id: string) {
    return this.firestore.doc(`${this.collectionName}/` + id).delete();
  }
}
