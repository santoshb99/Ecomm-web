package com.testlab.ecomm.repository;

import com.testlab.ecomm.entity.Cart;
import com.testlab.ecomm.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepo extends CrudRepository<Cart, Integer> {
    public List<Cart> findByUser(User user);
}
