package com.gradlohbackend.orbital.repository;

import com.gradlohbackend.orbital.entity.Folder;
import com.gradlohbackend.orbital.entity.FolderId;
import com.gradlohbackend.orbital.entity.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FoldersRepo extends JpaRepository<Folder, FolderId> {

    Optional<Folder> findByEmail(String email);

    @Query(value = "SELECT f.folder_name " +
            "FROM Folders f " +
            "INNER JOIN Users u USING(email) " +
            "WHERE email = :email AND " +
            "folder_name = CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(u.enrolment_year, 4) AS UNSIGNED)) * 2 + 1 " +
            "ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(u.enrolment_year, 4) AS UNSIGNED)) * 2 END " +
            "LIMIT 1", nativeQuery = true)
    @Cacheable(value = "currentSemester", key="#email")
    int findCurrentSemesterByEmail(@Param("email") String email);

    @Query("SELECT f.moduleCode FROM Folders f WHERE f.email = :email AND f.folderName = :folderName")
    @Cacheable(value = "moduleCodesOfSpecificFolder", key = "#email.concat('-').concat(#folderName)")
    List<String> findModuleCodesByEmailAndFolderName(@Param("email") String email, @Param("folderName") Byte folderName);
}
