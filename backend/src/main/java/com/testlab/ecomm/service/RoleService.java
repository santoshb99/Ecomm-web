package com.testlab.ecomm.service;

import com.testlab.ecomm.entity.Role;
import com.testlab.ecomm.repository.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;
    public Role createNewRole(Role role){
        return roleRepo.save(role);
    }
}
