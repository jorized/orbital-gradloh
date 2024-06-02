package com.gradlohbackend.orbital.repository;


import com.gradlohbackend.orbital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
}
