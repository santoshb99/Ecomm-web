import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../_services/image-processing.service';
import { map } from 'rxjs';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber: number = 0;
  productDetails: Product[] = [];
  isLoading: boolean = true;

  showLoadButton: boolean = false;

  constructor(private productService: ProductService, private imageProcessing: ImageProcessingService, private router: Router) { }
  ngOnInit(): void {
    this.getAllProducts();

  }

  searchByKeyword(searchkeyword: string) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }


  public getAllProducts(searchKey: string = "") {
    this.isLoading = true;
    setTimeout(() => {
      this.productService.getAllProducts(this.pageNumber, searchKey)
        .pipe(
          map((products: Product[]) => products.map((product: Product) => this.imageProcessing.createImages(product)))
        )
        .subscribe(
          (resp: Product[]) => {
            console.log(resp);

            if (resp.length == 6)
              this.showLoadButton = true;
            else
              this.showLoadButton = false;

            // this.productDetails = resp;
            this.isLoading = false;
            resp.forEach(p => this.productDetails.push(p));
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.isLoading = false;
          }
        );
    }, 2000); // Simulate a 2-second delay
  }

  public viewProductDetails(productId: any) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  addToCart(productId: any) {
    // console.log(productId);
    this.productService.addToCart(productId).subscribe(
      (resp) => {
        console.log(resp);
        this.showSuccessToast();
      },
      (err) => {
        console.log(err);
        this.showErrorToast();
      }
    );
  }

  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }



  showSuccessToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'success',
      title: 'Added order successfully',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'error',
      title: 'Failed to add order',
      showConfirmButton: false,
      timer: 3000
    });
  }

}
