package com.testlab.ecomm.service;

import com.testlab.ecomm.configuration.JwtRequestFilter;
import com.testlab.ecomm.entity.Cart;
import com.testlab.ecomm.entity.Product;
import com.testlab.ecomm.entity.User;
import com.testlab.ecomm.repository.CartRepo;
import com.testlab.ecomm.repository.ProductRepo;
import com.testlab.ecomm.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    public Product addNewProduct(Product product){
        return productRepo.save(product);
    }

    public List<Product> getAllProducts(Integer pageNumber, String searchKey){
        Pageable pageable = PageRequest.of(pageNumber, 6);

        if (searchKey.equals("")){
            return (List<Product>)productRepo.findAll(pageable);
        } else {
            return (List<Product>) productRepo.findByProductNameContainingIgnoreCaseOrProductDescContainingIgnoreCase(searchKey, searchKey, pageable);
        }

    }

    public Product getProductDetailsById(Integer productId){
        return productRepo.findById(productId).get();
    }

    public void deleteProductDetails(Integer productId){
        productRepo.deleteById(productId);
    }

    public List<Product> getProductDetails(boolean isSingleProductCheckout, Integer productId){
        if(isSingleProductCheckout && productId != 0){
//          We are going to buy a single product
            List<Product> list = new ArrayList<>();
            Product product = productRepo.findById(productId).get();
            list.add(product);
            return list;
        } else {
//      We are going to checkout entire cart
            String username = JwtRequestFilter.CURRENT_USER;
            User user = userRepo.findById(username).get();
            List<Cart> carts = cartRepo.findByUser(user);

            return carts.stream().map(x -> x.getProduct()).collect(Collectors.toList());
        }
    }
}
