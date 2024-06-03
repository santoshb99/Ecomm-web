import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../_model/product.model';
import { NgForm } from '@angular/forms';
import { OrderDetals } from '../_model/order-details.model';
import { OrderProductQuantity } from '../_model/order-quantity.model';
import { ProductService } from '../_services/product.service';
import Swal from 'sweetalert2';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  isSingleProductCheckout: boolean = false;
  productDetails: Product[] = [];

  orderDetails: OrderDetals = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    altNumber: '',
    orderProductQuantityList: [],
    transactionId: ''
  }

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];

    const isSingleProductCheckoutParam = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");
    this.isSingleProductCheckout = isSingleProductCheckoutParam === 'true';

    this.initializeOrderProductQuantities();


    console.log(this.orderDetails);
    console.log(this.orderDetails);
  }

  initializeOrderProductQuantities(): void {
    this.productDetails.forEach(x => {
      if (x.productId !== undefined) {
        this.orderDetails.orderProductQuantityList.push({ productId: x.productId, quantity: 1 });
      }
    });
  }

  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();
        this.showSuccessToast();
      },
      (err) => {
        console.log(err);
        this.showErrorToast();
      }
    );
  }

  showSuccessToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'success',
      title: 'Order placed successfully',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorToast(): void {
    Swal.fire({
      toast: true,
      position: 'center',
      icon: 'error',
      title: 'Failed to place order',
      showConfirmButton: false,
      timer: 3000
    });
  }


  getQuantityForProduct(productId: any) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId: any, productDiscPrice: any) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId == productId
    );
    return filteredProduct[0].quantity * productDiscPrice;
  }

  onQuantityChange(q: any, productId: any) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = q;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;

    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productDiscPrice;
        grandTotal += (price * productQuantity.quantity);
      }
    );

    return grandTotal;
  }


  createTransactionAndPlaceOrder(orderForm: NgForm) {
    if (orderForm.valid) {
      console.log('Form is valid');

      let amount = this.getCalculatedGrandTotal();
      this.productService.createTransaction(amount).subscribe(
        (resp) => {
          console.log(resp);
          this.openTransactionModel(resp, orderForm);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.showErrorToast();
    }
  }

  openTransactionModel(resp: any, orderForm: NgForm) {
    var options = {
      order_id: resp.orderId,
      key: resp.key,
      amount: resp.amount,
      currency: resp.currency,
      name: 'Test Person',
      description: 'payment of the product',
      image: 'https://cdn.pixabay.com/photo/2024/05/09/22/54/penguin-8751952_1280.jpg',
      handler: (resp: any) => {
        if (resp != null && resp.razorpay_payment_id != null) {
          this.processResponse(resp, orderForm);
        } else {
          alert("Payment failed..");
          this.showErrorToast();
        }
      },
      prefill: {
        name: 'Test Pers',
        email: 'test@gmail.com',
        contact: '85555845'
      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorpayObject = new Razorpay(options);
    razorpayObject.open();
  }

  processResponse(resp: any, orderForm: NgForm) {
    // console.log(resp);
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
  }

}
