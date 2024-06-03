package com.testlab.ecomm.repository;

import com.testlab.ecomm.entity.OrderDetail;
import com.testlab.ecomm.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepo extends CrudRepository<OrderDetail, Integer> {

    public List<OrderDetail> findByUser(User user);

    public  List<OrderDetail> findByOrderStatus(String status);
}
