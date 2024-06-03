import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  
  isOrderCheckoutEmpty: boolean = false;


  productDetails: Product[] = [
    // Example data, replace with your actual data source
    {
      productName: '',
      productDesc: '',
      productDiscPrice: 0,
      productOgPrice: 0,
      productImages: []
    },
    // Add more products as needed
  ];

  cartDetails: any = [];

  constructor(private productService:ProductService, private router:Router){}

  ngOnInit(): void {
    this.getCartDetails();
  }

  public getCartDetails(){
    this.productService.getCartDetails().subscribe(
      (resp) => {
        console.log(resp);
        if(resp.length == 0)
          this.isOrderCheckoutEmpty = true;
        else
          this.isOrderCheckoutEmpty = false;
        this.cartDetails = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  truncateText(text: string): string {
    const words = text.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return text;
  }

  checkout(){
    this.router.navigate(['/buyProduct', {isSingleProductCheckout: false, id: 0}]);
  }

  getTotal(): number {
    return this.cartDetails.reduce((total: any, cartItem: any) => total + cartItem.product.productDiscPrice, 0);
  }

  updateProduct(product: Product): void {
    // Implement product update logic here
    console.log('Updating product', product);
  }

  deleteProduct(cartId: number): void {
    // Implement product delete logic here
    console.log('Deleting product', cartId);
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        console.log(resp);
        this.getCartDetails();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
