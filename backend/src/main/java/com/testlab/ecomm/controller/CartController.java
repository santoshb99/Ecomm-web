package com.testlab.ecomm.controller;

import com.testlab.ecomm.entity.Cart;
import com.testlab.ecomm.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/addToCart/{productId}"})
    public Cart addToCard(@PathVariable(name = "productId") Integer productId){
        return this.cartService.addToCard(productId);
    }

    @PreAuthorize("hasRole('User')")
    @DeleteMapping("/deleteCartItem/{cartId}")
    public void deleteCartItem(@PathVariable(name = "cartId") Integer cartId){
        cartService.deleteCartItem(cartId);
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/getCartDetails"})
    public List<Cart> getCartDetails(){
        return this.cartService.getCartDetails();
    }
}
