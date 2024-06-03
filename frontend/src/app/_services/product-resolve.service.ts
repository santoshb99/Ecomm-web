import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from '../_model/product.model';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolveService implements Resolve<Product> {

  constructor(private productService:ProductService, private imageProcessing:ImageProcessingService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get("productId");

    if (id) {
      return this.productService.getProductById(id)
      .pipe(
        map(p=> this.imageProcessing.createImages(p))
      );
    } else {
        return of(this.getProductDetails());
    }
  }

  getProductDetails() {
    return {
      productName: "",
      productDesc: "",
      productDiscPrice: 0,
      productOgPrice: 0,
      productImages: []
    };
  }
}
