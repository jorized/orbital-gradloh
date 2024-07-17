package com.gradlohbackend.orbital.repository;

import com.gradlohbackend.orbital.entity.Folder;
import com.gradlohbackend.orbital.entity.FolderId;
import com.gradlohbackend.orbital.entity.User;
import jakarta.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@TestPropertySource("classpath:application-test.properties")
public class FolderRepositoryTests {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private FoldersRepo foldersRepo;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    public void FoldersRepo_DeleteModuleFromFolderByEmailAndFolderNameAndModuleCode_RemovesModule() {
        // Arrange: Create and save a test user
        String email = "test@u.nus.edu";
        User user = User.builder()
                .email(email)
                .nickname("testuser")
                .password("testpassword")
                .refreshToken("testtoken")
                .resetOtp("ABCDEF")
                .resetOtpExp(0L)
                .completedOnboard(false)
                .completedTutorial(false)
                .enrolmentYear("2023-2024")
                .primaryMajor("Data Science and Analytics")
                .secondaryMajor("")
                .firstMinor("")
                .secondMinor("")
                .homeFaculty("")
                .role(User.Role.USER)
                .build();
        usersRepo.save(user);

        // Arrange: Create and save folders with modules for the user
        Byte folderName = 1;
        String moduleCode = "CS2040";
        Byte review = 5;
        Folder folder = Folder.builder()
                .email(email)
                .folderName(folderName)
                .moduleCode(moduleCode)
                .build();
        foldersRepo.save(folder);

        // Act: Delete the module from the folder
        foldersRepo.deleteModuleFromFolderByEmailAndFolderNameAndModuleCode(email, folderName, moduleCode);

        // Ensure the deletion is flushed and the persistence context is refreshed
        entityManager.flush();
        entityManager.clear();

        // Assert: Verify that the module is deleted from the folder
        Optional<Folder> deletedFolder = foldersRepo.findById(new FolderId(email, folderName, moduleCode, review));
        Assertions.assertThat(deletedFolder).isNotPresent();
    }
}
