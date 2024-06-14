package com.gradlohbackend.orbital.service;


import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.hibernate.annotations.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class OurUserDetailsService implements UserDetailsService {


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

    @Cacheable(value = "completedCoreModsCount", key="#email")
    public Long getCompletedCoreModsCount(String email) {
        return usersRepo.findCompletedCoreModsByEmail(email);
    }
    @Cacheable(value = "totalCoreModsCount", key="#email")
    public Long getTotalCoreModsCount(String email) {
        return usersRepo.findTotalCoreModsByEmail(email);
    }

    @Cacheable(value = "completedGeModsCount", key="#email")
    public Long getCompletedGeModsCount(String email) {
        return usersRepo.findCompletedGeModsByEmail(email);
    }

    @Cacheable(value = "totalGeModsCount", key="#email")
    public Long getTotalGeModsCount(String email) {
        return usersRepo.findTotalGeModsByEmail(email);
    }


}
