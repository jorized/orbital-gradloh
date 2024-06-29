package com.gradlohbackend.orbital.repository;

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

import java.util.Map;
import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@TestPropertySource("classpath:application-test.properties")
public class UserRepositoryTests {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void UserRepo_SaveAll_ReturnSavedUser() {

        //Arrange (Simulate creating a test user)
        User user = User.builder()
                .email("test@u.nus.edu")
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

        //Act (Action to simulate creation of user)
        User savedUser = usersRepo.save(user);

        //Assert (Expects that created user is not null)
        Assertions.assertThat(savedUser).isNotNull();
    }

    @Test
    @Transactional
    public void UserRepo_UpdateNicknameByEmail_ReturnUpdatedUser() {
        // Arrange (Simulate creating a test user)
        User user = User.builder()
                .email("test@u.nus.edu")
                .nickname("oldNickname")
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

        // Act (Update the user's nickname)
        String newNickname = "newNickname";
        int updatedRecords = usersRepo.updateNicknameByEmail(user.getEmail(), newNickname);

        // Flush the changes and clear the persistence context
        entityManager.flush();
        entityManager.clear();

        // Assert (Verify the update operation)
        Assertions.assertThat(updatedRecords).isEqualTo(1);

        // Fetch the updated user to verify the change
        Optional<User> updatedUser = usersRepo.findByEmail(user.getEmail());
        Assertions.assertThat(updatedUser).isPresent();
        Assertions.assertThat(updatedUser.get().getNickname()).isEqualTo(newNickname);
    }

    @Test
    public void UserRepoCustom_FindCompletedDSACoreModsByEmail_ReturnsCorrectCounts() {
        // Set up mock data for PrimaryMajorRequirements
        String[] modules = {
                "CS2040", "CS3244", "DSA1101", "DSA2101", "DSA2102", "DSA3101", "DSA3102",
                "DSA4211", "DSA4212", "DSA4213", "DSA4261", "DSA4262", "DSA4263", "DSA4264",
                "DSA4265", "DSA4266", "DSA4288", "DSA4288M", "DSA4288S", "MA2001", "MA2002",
                "MA2104", "MA2116", "MA2311", "ST2131", "ST2132", "ST3131"
        };

        for (String module : modules) {
            entityManager.createNativeQuery("INSERT INTO PrimaryMajorRequirements (primary_major, module_type, module_code) VALUES (?, ?, ?)")
                    .setParameter(1, "Data Science and Analytics")
                    .setParameter(2, "Core")
                    .setParameter(3, module)
                    .executeUpdate();
        }

        // Insert mock user
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

        // Insert mock data for Folders (simulating completed modules)
        String[] completedModules = {"CS2040", "DSA1101", "DSA2101"};
        for (String module : completedModules) {
            entityManager.createNativeQuery("INSERT INTO Folders (email, folder_name, module_code) VALUES (?, ?, ?)")
                    .setParameter(1, email)
                    .setParameter(2, 1)
                    .setParameter(3, module)
                    .executeUpdate();
        }


        // Act: Call the method to test
        Map<String, Integer> result = usersRepo.findCompletedDSACoreModsByEmail(email);

        // Assert: Verify the results
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.get("totalModulesCompleted")).isEqualTo(3); // Number of modules marked as completed
        Assertions.assertThat(result.get("totalModulesRequired")).isEqualTo(16); // Based on logic in query
    }
}
