package com.gradlohbackend.orbital.repository;


import com.gradlohbackend.orbital.entity.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Integer>, UsersRepoCustom {

    Optional<User> findByEmail(String email);

    //Update user nickname
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.nickname = :nickname WHERE u.email = :email")
    int updateNicknameByEmail(@Param("email") String email, @Param("nickname") String nickname);


    //Updating refresh token
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.refreshToken = :refreshToken WHERE u.email = :email")
    void updateRefreshToken(@Param("refreshToken") String refreshToken, @Param("email") String email);

    @Query(value = "SELECT " +
            "ROUND(COUNT(*)/40 * 100, 0) AS modules_completed " +
            "FROM Folders AS f " +
            "INNER JOIN Users AS u " +
            "USING(email) " +
            "WHERE email = :email AND " +
            "folder_name <= CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN " +
            "(YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1 " +
            "ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END",
            nativeQuery = true)
    @Cacheable(value = "modulesCompletedPercentage", key="#email")
    int findCompletedModulesPercentageByEmail(@Param("email") String email);

    @Query(value = "SELECT " +
            "CASE WHEN MAX(folder_name) * 5 > COUNT(*) THEN 'At Risk' " +
            "ELSE 'On Track' END AS progress " +
            "FROM Folders AS f " +
            "INNER JOIN Users AS u " +
            "USING(email) " +
            "WHERE email = :email AND " +
            "folder_name <= CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN " +
            "(YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1 " +
            "ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END",
            nativeQuery = true)
    @Cacheable(value = "progressionStatus", key="#email")
    String findProgressionStatusByEmail(@Param("email") String email);

    //For CHS Students
    @Query(value = "WITH ct2 AS ( " +
            "  SELECT " +
            "    CHS.pillar, " +
            "    COUNT(*) AS chs_modules_completed " +
            "  FROM ( " +
            "    SELECT " +
            "      u.primary_major, " +
            "      f.* " +
            "    FROM Users AS u " +
            "    INNER JOIN Folders AS f USING(email) " +
            "    WHERE email = :email " +
            "    ORDER BY folder_name " +
            "  ) AS ct1 " +
            "  INNER JOIN CHSRequirements AS CHS USING (module_code) " +
            "  WHERE email = :email " +
            "  GROUP BY CHS.pillar " +
            ") " +
            "SELECT " +
            "  COALESCE(SUM(ct2.chs_modules_completed), 0) AS total_completed " +
            "FROM ct2",
            nativeQuery = true)
    @Cacheable(value = "completedCHSModules", key="#email")
    Integer findCompletedCHSModulesByEmail(@Param("email") String email);

    // Find completed UE modules by email
    @Query(value = "SELECT COUNT(*) as ue_modules_completed " +
            "FROM railway.Folders " +
            "WHERE email = :email " +
            "AND module_code NOT IN ( " +
            "    SELECT module_code " +
            "    FROM railway.PrimaryMajorRequirements " +
            "    UNION " +
            "    SELECT module_code " +
            "    FROM railway.CHSRequirements " +
            ")",
            nativeQuery = true)
    @Cacheable(value = "completedUEModules", key = "#email")
    Integer findCompletedUEModulesByEmail(@Param("email") String email);


}
