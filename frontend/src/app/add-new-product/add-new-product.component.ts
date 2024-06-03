import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { NgForm } from '@angular/forms';
import { ProductService } from '../_services/product.service';
import { FileHandle } from '../_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit {


  isNewProduct: boolean = true;

  product: Product = {
    productName: "",
    productDesc: "",
    productDiscPrice: 0,
    productOgPrice: 0,
    productImages: []
  }

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];  //provide key which he has defined in app router module resolve.
    if(this.product && this.product.productId){
      this.isNewProduct = false;
    }
  }

  public addProduct(productForm: NgForm){
    // console.log(this.product);
    if(productForm.valid){
      const productFormData = this.prepareFormData(this.product);

      this.productService.addProduct(productFormData).subscribe(
        (response: Product) => {
          // console.log(response);
          productForm.reset();
          this.product.productImages = [];
          if(!this.isNewProduct){
            this.router.navigate(['/showAllProducts']);
          }
          
          this.showSuccessToast();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.showErrorToast();
    }
    
  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();

    formData.append(
      'product',
      new Blob([JSON.stringify(product)], {type: 'application/json'})
    );

    for(var i=0; i<product.productImages.length; i++){
      formData.append(
        'imageFile',
        product.productImages[i].file,
        product.productImages[i].file.name
      );
    }

    return formData;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      }

      this.product.productImages.push(fileHandle);
    }
  }

  removeImage(i: number){
    this.product.productImages.splice(i, 1);
  }


  showSuccessToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'success',
      title: 'Product added successfully',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'error',
      title: 'Failed to add product',
      showConfirmButton: false,
      timer: 3000
    });
  }


}
