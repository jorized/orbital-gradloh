package com.gradlohbackend.orbital.repository;

import com.gradlohbackend.orbital.entity.Folder;
import com.gradlohbackend.orbital.entity.FolderId;
import com.gradlohbackend.orbital.entity.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FoldersRepo extends JpaRepository<Folder, FolderId> {

    Optional<Folder> findByEmail(String email);

    @Query(value = "SELECT CASE " +
            "WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(u.enrolment_year, 4) AS UNSIGNED)) * 2 + 1 " +
            "ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(u.enrolment_year, 4) AS UNSIGNED)) * 2 END AS current_semester " +
            "FROM Users u " +
            "WHERE u.email = :email " +
            "LIMIT 1", nativeQuery = true)
    @Cacheable(value = "currentSemester", key="#email")
    Integer findCurrentSemesterByEmail(@Param("email") String email);


    @Query("SELECT f.moduleCode FROM Folders f WHERE f.email = :email AND f.folderName = :folderName")
    @Cacheable(value = "moduleCodesOfSpecificFolder", key = "#email")
    List<String> findModuleCodesByEmailAndFolderName(@Param("email") String email, @Param("folderName") Byte folderName);

    @Query(value = "SELECT f.module_code " +
            "FROM Folders AS f " +
            "INNER JOIN Users AS u USING(email) " +
            "WHERE email = :email AND " +
            "folder_name <= " +
            "CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1 " +
            "ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END " +
            "ORDER BY folder_name",
            nativeQuery = true)
    @Cacheable(value = "modulesUpTillCurrentSem", key="#email")
    List<String> findModulesUpTillCurrentSemByEmail(@Param("email") String email);

    @Query("SELECT f.moduleCode FROM Folders f WHERE f.email = :email AND f.folderName IN (1, 2, 3, 4, 5, 6, 7, 8)")
    @Cacheable(value = "everyfoldermodules", key="#email")
    List<String> findEveryFoldersModulesByEmail(@Param("email") String email);

    @Query("SELECT f.moduleCode FROM Folders f WHERE f.email = :email AND f.folderName <= :folderName")
    @Cacheable(value = "previousfoldermodules", key = "#email")
    List<String> findPrevToCurrFoldersModulesByEmailAndFolderName(@Param("email") String email, @Param("folderName") Byte folderName);

    @Modifying
    @Transactional
    @Query("DELETE FROM Folders f WHERE f.email = :email AND f.folderName = :folderName AND f.moduleCode = :moduleCode")
    void deleteModuleFromFolderByEmailAndFolderNameAndModuleCode(
            @Param("email") String email,
            @Param("folderName") Byte folderName,
            @Param("moduleCode") String moduleCode
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM Folders f WHERE f.email = ?1")
    void deleteFoldersByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Folders (email, folder_name, module_code) " +
            "SELECT u.email, s.folder_name, s.module_code " +
            "FROM Users u " +
            "INNER JOIN SingleMajorSamplePlan s ON u.primary_major = s.primary_major " +
            "WHERE u.email = ?1 ", nativeQuery = true)
    void insertSingleMajorSamplePlanByEmail(String email);

}
