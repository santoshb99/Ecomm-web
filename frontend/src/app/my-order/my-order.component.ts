import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/order.model';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit{
  
  pageNumber: number = 0;
  showLoadButton: boolean = false;

  myOrderDetails: MyOrderDetails[] = [];

  constructor(private productService:ProductService) {}
  
  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(){
    this.productService.getOrderDetails().subscribe(
      (resp: MyOrderDetails[]) => {
        console.log(resp );

        if (resp.length == 6)
          this.showLoadButton = true;
        else
          this.showLoadButton = false;

        this.myOrderDetails = resp;
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

  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getOrderDetails();
  }
}
