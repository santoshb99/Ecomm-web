import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from '../_model/product.model';
import { Observable, map } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class BuyProductResolverService implements Resolve<Product[]> {

  constructor(private productService: ProductService, private imageProcessing: ImageProcessingService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> {
    const id = route.paramMap.get("id")!;
    const isSingleProductCheckout = route.paramMap.get("isSingleProductCheckout") === 'true';

    return this.productService.getProductDetails(isSingleProductCheckout, id).pipe(
      map((products: Product[]) => products.map(product => this.imageProcessing.createImages(product)))
    );
  }
}
