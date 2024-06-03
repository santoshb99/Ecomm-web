package com.testlab.ecomm.service;

import com.testlab.ecomm.entity.Role;
import com.testlab.ecomm.entity.User;
import com.testlab.ecomm.repository.RoleRepo;
import com.testlab.ecomm.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public void initRolesAndUser() {
        Role adminRole = new Role();
        adminRole.setRoleName("Admin");
        adminRole.setRoleDesc("Admin role");
        roleRepo.save(adminRole);

        Role userRole = new Role();
        userRole.setRoleName("User");
        userRole.setRoleDesc("Default role for newly created record.");
        roleRepo.save(userRole);

//        For Admin Access
        User adminUser = new User();
        adminUser.setUserFirstName("admin");
        adminUser.setUserLastName("admin");
        adminUser.setUserName("admin123");
        adminUser.setUserPassword(getEncodedPassword("admin@pass"));
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminUser.setRole(adminRoles);
        userRepo.save(adminUser);

//        For User Access
//        User endUser = new User();
//        endUser.setUserFirstName("raj");
//        endUser.setUserLastName("sharma");
//        endUser.setUserName("raj123");
//        endUser.setUserPassword(getEncodedPassword("raj@pass"));
//        Set<Role> userRoles = new HashSet<>();
//        userRoles.add(userRole);
//        endUser.setRole(userRoles);
//        userRepo.save(endUser);
    }



//    public User registerNewUser(User user) {
//
//        Role role = roleRepo.findById("User").get();
//
//        Set<Role> roles = new HashSet<>();
//        roles.add(role);
//        user.setRole(roles);
//
//        user.setUserPassword(getEncodedPassword(user.getUserPassword()));
//        return userRepo.save(user);
//    }

    public User registerNewUser(User user){

        Role role = roleRepo.findById("User").get();

        Set<Role> roleSet = new HashSet<>();
        roleSet.add(role);
        user.setRole(roleSet);

        String password = getEncodedPassword(user.getUserPassword());
        user.setUserPassword(password);

        return userRepo.save(user);
    }


    public String getEncodedPassword(String password){
        return passwordEncoder.encode(password);
    }
}
