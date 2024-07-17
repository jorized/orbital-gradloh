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

public interface FoldersRepo extends JpaRepository<Folder, FolderId>, FoldersRepoCustom {

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

    //This method shows the unique folders that has no reviews in them
    // (E.g. let's say folder 1, have cs1010j and hsi1000, even if cs1010j have review, but hsi1000 does not, it will still show
    @Query("SELECT DISTINCT f.folderName FROM Folders f WHERE f.email = :email AND f.review = 0")
    @Cacheable(value = "folderswithoutallmodulesreviewed", key = "#email")
    List<String> findFoldersWithoutAllModulesReviewedByEmail(@Param("email") String email);

    //This method shows the modules within the specific folder that has no reviews yet
    @Query("SELECT DISTINCT f.moduleCode FROM Folders f WHERE f.email = :email AND f.review = 0 AND f.folderName = :folderName")
    @Cacheable(value = "moduleswithoutreviews", key = "#email")
    List<String> findModulesInSpecificFolderWithoutReviewsByEmailAndFolderName(@Param("email") String email, @Param("folderName") Byte folderName);

    @Modifying
    @Transactional
    @Query("UPDATE Folders f SET f.review = :review WHERE f.email = :email AND f.folderName = :folderName AND f.moduleCode = :moduleCode")
    int updateReviewByEmailAndFolderNameAndModuleCode(
            @Param("email") String email,
            @Param("folderName") Byte folderName,
            @Param("moduleCode") String moduleCode,
            @Param("review") Byte review
    );

    @Query("SELECT DISTINCT f.folderName FROM Folders f WHERE f.email = :email AND f.review <> 0")
    @Cacheable(value = "folderswithallmodulesreviewed", key = "#email")
    List<String> findFoldersWithModulesReviewedByEmail(@Param("email") String email);

    @Query("SELECT DISTINCT f.moduleCode FROM Folders f WHERE f.email = :email AND f.review <> 0 AND f.folderName = :folderName")
    @Cacheable(value = "moduleswithreviews", key = "#email")
    List<String> findModulesInSpecificFolderWithReviewsByEmailAndFolderName(@Param("email") String email, @Param("folderName") Byte folderName);

    @Query("SELECT f.review FROM Folders f WHERE f.email = :email AND f.folderName = :folderName AND f.moduleCode = :moduleCode")
    @Cacheable(value = "modulereview", key = "#email")
    Byte findModuleReviewByEmailAndFolderNameAndModuleCode(@Param("email") String email, @Param("folderName") Byte folderName, @Param("moduleCode") String moduleCode);

}
