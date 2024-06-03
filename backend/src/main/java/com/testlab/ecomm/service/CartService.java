package com.testlab.ecomm.service;

import com.testlab.ecomm.configuration.JwtRequestFilter;
import com.testlab.ecomm.entity.Cart;
import com.testlab.ecomm.entity.Product;
import com.testlab.ecomm.entity.User;
import com.testlab.ecomm.repository.CartRepo;
import com.testlab.ecomm.repository.ProductRepo;
import com.testlab.ecomm.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    public Cart addToCard(Integer productId) {
        Product product = this.productRepo.findById(productId).get();
        String username = JwtRequestFilter.CURRENT_USER;

        User user = null;

        if (username != null){
            user = userRepo.findById(username).get();
        }

        List<Cart> cartList = cartRepo.findByUser(user);
        List<Cart> filteredList = cartList.stream().filter(x -> x.getProduct().getProductId() == productId).collect(Collectors.toList());

        if(filteredList.size() > 0){
            return null;
        }

        if (product != null && user != null) {
            Cart cart = new Cart(product, user);
            return cartRepo.save(cart);
        }
        return null;
    }

    public void deleteCartItem(Integer cartId){
        cartRepo.deleteById(cartId);
    }

    public List<Cart> getCartDetails() {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userRepo.findById(username).get();
        return cartRepo.findByUser(user);
    }
}
