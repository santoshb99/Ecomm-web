import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product.model';
import { Observable } from 'rxjs';
import { OrderDetals } from '../_model/order-details.model';
import { MyOrderDetails } from '../_model/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  PATH_OF_API = "http://localhost:8082";

  constructor(private httpClient: HttpClient) { }


  public createTransaction(amount: number) {
    return this.httpClient.get(this.PATH_OF_API+"/createTransaction/"+ amount);
  }

  public markAsDelivered(orderId: number){
    return this.httpClient.get(this.PATH_OF_API + "/markOrderAsDelivered/"+orderId);
  }

  public getAllOrderDetailsForAdmin(status: string): Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>(this.PATH_OF_API+"/getAllOrderDetails/"+status);
  }

  public getOrderDetails(): Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>(this.PATH_OF_API+"/getOrderDetails");
  }

  public deleteCartItem(cartId: number){
    return this.httpClient.delete(this.PATH_OF_API+"/deleteCartItem/"+cartId);
  }

  public addProduct(product: FormData) {
    return this.httpClient.post<Product>(this.PATH_OF_API + "/addNewProduct", product);
  }

  public getAllProducts(pageNumber: any, searchKeyword: string="") {
    return this.httpClient.get<Product[]>(this.PATH_OF_API + "/getAllProducts?pageNumber="+pageNumber+"&searchKey="+searchKeyword);
  }


  public getProductById(productId: any) {
    return this.httpClient.get<Product>(this.PATH_OF_API + "/getProductById/" + productId);
  }

  public deleteProduct(productId: number) {
    return this.httpClient.delete(this.PATH_OF_API + "/deleteProduct/" + productId);
  }

  public getProductDetails(isSingleProductCheckout: any, productId: any) {
    // console.log('getProductDetails called with:', isSingleProductCheckout, productId);
    return this.httpClient.get<Product[]>(this.PATH_OF_API + "/getProductDetails/" + isSingleProductCheckout + "/" + productId);
  }

  public placeOrder(orderDetails: OrderDetals, isCartCheckout: boolean){
    return this.httpClient.post(this.PATH_OF_API+"/placeOrder/"+ isCartCheckout, orderDetails);
  }

  public addToCart(productId: number){
    return this.httpClient.get(this.PATH_OF_API+"/addToCart/"+productId);
  }

  public getCartDetails(){
    return this.httpClient.get<Product[]>(this.PATH_OF_API+"/getCartDetails");
  }
}
