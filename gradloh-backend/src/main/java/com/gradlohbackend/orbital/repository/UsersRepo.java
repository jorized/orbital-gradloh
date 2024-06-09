package com.gradlohbackend.orbital.repository;


import com.gradlohbackend.orbital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT COUNT(*) AS count " +
            "FROM Users u " +
            "INNER JOIN Folders f USING (email) " +
            "INNER JOIN PrimaryMajorRequirements p USING (primary_major, module_code) " +
            "WHERE u.email = :email AND f.completion_status = 1 AND p.module_type = 'Core'",
            nativeQuery = true)
    Long findCompletedCoreModsByEmail(@Param("email") String email);

    @Query(value = "SELECT COUNT(*) AS count " +
            "FROM Users u " +
            "INNER JOIN Folders f USING (email) " +
            "INNER JOIN PrimaryMajorRequirements p USING (primary_major, module_code) " +
            "WHERE u.email = :email AND p.module_type = 'Core'",
            nativeQuery = true)
    Long findTotalCoreModsByEmail(@Param("email") String email);

    @Query(value = "SELECT COUNT(*) AS count " +
            "FROM Users u " +
            "INNER JOIN Folders f USING (email) " +
            "INNER JOIN PrimaryMajorRequirements p USING (primary_major, module_code) " +
            "WHERE u.email = :email AND f.completion_status = 1 AND p.module_type = 'GE'",
            nativeQuery = true)
    Long findCompletedGeModsByEmail(@Param("email") String email);

    @Query(value = "SELECT COUNT(*) AS count " +
            "FROM Users u " +
            "INNER JOIN Folders f USING (email) " +
            "INNER JOIN PrimaryMajorRequirements p USING (primary_major, module_code) " +
            "WHERE u.email = :email AND p.module_type = 'GE'",
            nativeQuery = true)
    Long findTotalGeModsByEmail(@Param("email") String email);
}
