package com.gradlohbackend.orbital.service;


import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OurUserDetailsService implements UserDetailsService {

    public static int counter = 0;


    @Autowired
    private UsersRepo usersRepo;

    private static final Logger logger = LoggerFactory.getLogger(OurUserDetailsService.class);

    //Don't cache this, required for login.
    //username in this case is our email. Have to override it or else spring security wont work
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        logger.debug("User found with email: {}", email);
        logger.debug("User roles: {}", user.getAuthorities().toString());

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.getAuthorities());
    }
    //Don't cache this, required for login.
    public Optional<User> findUserByEmail(String email) {
        return usersRepo.findByEmail(email);
    }

    public int getCompletedCHSModules(String email) {
        Integer result = usersRepo.findCompletedCHSModulesByEmail(email);
        return result != null ? result : 0;
    }

}
