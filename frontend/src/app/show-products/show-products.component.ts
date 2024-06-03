import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit {

  pageNumber: number = 0;
  productDetails: Product[] = [];

  showLoadButton: boolean = false;

  showTable: boolean = false;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword: string){
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  public getAllProducts(searchKeyword: string="") {
    this.showTable = false;
    this.productService.getAllProducts(this.pageNumber, searchKeyword).subscribe(
      (response: Product[]) => {
        // console.log(response);
        // this.productDetails = response;
        if (response.length == 6)
          this.showLoadButton = true;
        else
          this.showLoadButton = false;

        this.showTable = true;
        response.forEach(p => this.productDetails.push(p));
      },
      (error: HttpErrorResponse) => {
        console.log(error);
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

  deleteProduct(productId: any): void {
    // console.log(productId);
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        // console.log(resp);
        this.getAllProducts();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  editProduct(productId: any) {
    // console.log(productId);
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }

  loadMoreProduct() {
    this.pageNumber += 1;
    this.getAllProducts();
  }

}
