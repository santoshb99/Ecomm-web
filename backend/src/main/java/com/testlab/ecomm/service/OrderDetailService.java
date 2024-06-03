package com.testlab.ecomm.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.testlab.ecomm.configuration.JwtRequestFilter;
import com.testlab.ecomm.entity.*;
import com.testlab.ecomm.repository.CartRepo;
import com.testlab.ecomm.repository.OrderDetailRepo;
import com.testlab.ecomm.repository.ProductRepo;
import com.testlab.ecomm.repository.UserRepo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderDetailService {

    private static final String ORDER_PLACED = "Placed";

//    private static final String KEY= "rzp_test_BATfy8uCjQcecB";
    private static final String KEY= "rzp_test_Hz7VvfnQRWfC5T";
//    private static final String SECRET_KEY = "kBFzztjiEX11krCSvSRcfy3u";
    private static final String SECRET_KEY = "f3D0ZAWonazkCYALJ9b9isOd";
    private static  final String CURRENCY = "INR";

    @Autowired
    private OrderDetailRepo orderDetailRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;


    public List<OrderDetail> getAllOrderDetails(String status){
        List<OrderDetail> orderDetailList = new ArrayList<>();

        if(status.equals("All")){
            orderDetailRepo.findAll().forEach(
                    x -> orderDetailList.add(x)
            );
        } else {
            orderDetailRepo.findByOrderStatus(status).forEach(
                    x -> orderDetailList.add(x)
            );
        }

        return orderDetailList;
    }

    public List<OrderDetail> getOrderDetails(){
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userRepo.findById(username).get();

        return orderDetailRepo.findByUser(user);
    }

    public void placeOrder(OrderInput orderInput, Boolean isSingleProductCheckout) {
        List<OrderProductQuantity> productQuantityList = orderInput.getOrderProductQuantityList();

        for (OrderProductQuantity o : productQuantityList) {

            Product product = productRepo.findById(o.getProductId()).get();

            String currentUser = JwtRequestFilter.CURRENT_USER;
            User user = userRepo.findById(currentUser).get();

            OrderDetail orderDetail = new OrderDetail(
                    orderInput.getFullName(),
                    orderInput.getFullAddress(),
                    orderInput.getContactNumber(),
                    orderInput.getAltNumber(),
                    ORDER_PLACED,
                    product.getProductDiscPrice() * o.getQuantity(),
                    product,
                    user,
                    orderInput.getTransactionId()
            );

//           Empty the cart
            if(!isSingleProductCheckout) {
              List<Cart> carts = cartRepo.findByUser(user);
              carts.stream().forEach(x -> cartRepo.deleteById(x.getCartId()));
            }

            orderDetailRepo.save(orderDetail);
        }
    }

    public void markOrderAsDelivered(Integer orderId){
        OrderDetail orderDetail = orderDetailRepo.findById(orderId).get();

        if(orderDetail !=null){
            orderDetail.setOrderStatus("Delivered");
            orderDetailRepo.save(orderDetail);
        }
    }

    public TransactionDetails createTransaction(Double amount){
        // 1. amount
        // 2. currency
        // 3. key
        // 4. secret key

        try {

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("amount", (amount * 100));
            jsonObject.put("currency", CURRENCY);

            RazorpayClient razorpayClient = new RazorpayClient(KEY, SECRET_KEY);
            Order order = razorpayClient.orders.create(jsonObject);
//            System.out.println(order);
            TransactionDetails transactionDetails = prepareTransactionDetails(order);
            return transactionDetails;
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return null;
    }

    private TransactionDetails prepareTransactionDetails(Order order){
        String orderId = order.get("id");
        String currency = order.get("currency");
        Integer amount = order.get("amount");

        TransactionDetails transactionDetails = new TransactionDetails(orderId, currency,amount, KEY);
        return transactionDetails;
    }
}
