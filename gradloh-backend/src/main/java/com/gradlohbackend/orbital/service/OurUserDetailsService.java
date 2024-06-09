package com.gradlohbackend.orbital.service;


import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.hibernate.annotations.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OurUserDetailsService implements UserDetailsService {


    @Autowired
    private UsersRepo usersRepo;

    //username in this case is our email. Have to override it or else spring security wont work
    @Override
    @Cacheable(value="userdetails", key="#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usersRepo.findByEmail(username).orElseThrow();
    }

    @Cacheable(value="user", key="#email")
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
