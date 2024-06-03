package com.testlab.ecomm.repository;

import com.testlab.ecomm.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends CrudRepository<Product, Integer> {
    public List<Product> findAll(Pageable pageable);

    public List<Product> findByProductNameContainingIgnoreCaseOrProductDescContainingIgnoreCase(String key1, String key2, Pageable pageable);
}
