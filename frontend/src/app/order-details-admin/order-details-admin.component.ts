import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/order.model';

@Component({
  selector: 'app-order-details-admin',
  templateUrl: './order-details-admin.component.html',
  styleUrls: ['./order-details-admin.component.css']
})
export class OrderDetailsAdminComponent implements OnInit{
  
  status: string = "All";

  myOrderDetails: MyOrderDetails[] = [];

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }

  public getAllOrderDetailsForAdmin(statusParam: string){
    this.productService.getAllOrderDetailsForAdmin(statusParam).subscribe(
      (resp) => {
        console.log(resp);
        this.myOrderDetails = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markAsDelivered(orderId: any){
    this.productService.markAsDelivered(orderId).subscribe(
      (resp) => {
        // console.log(resp);
        this.getAllOrderDetailsForAdmin(this.status);
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

}
