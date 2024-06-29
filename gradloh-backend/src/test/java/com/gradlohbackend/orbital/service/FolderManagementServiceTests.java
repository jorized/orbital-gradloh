package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.config.RedissonConfig;
import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.Folder;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.FoldersRepo;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FolderManagementServiceTests {

    @Mock
    private UsersRepo usersRepo;

    @Mock
    private FoldersRepo foldersRepo;

    @Mock
    private OurUserDetailsService ourUserDetailsService;

    @Mock
    private RedissonConfig redissonConfig;

    @InjectMocks
    private FoldersManagementService foldersManagementService;

    @Captor
    private ArgumentCaptor<Folder> folderCaptor;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void FolderManagementService_GetAllFolderDetails_ReturnsSuccess() {
        // Arrange
        ReqRes request = ReqRes.builder().email("test@u.nus.edu").build();

        User user = User.builder().email("test@u.nus.edu").build();

        when(ourUserDetailsService.findUserByEmail(anyString())).thenReturn(Optional.of(user));
        when(foldersRepo.findCurrentSemesterByEmail(anyString())).thenReturn(2);
        when(usersRepo.findNumberOfModulesInEachFolderByEmail(anyString())).thenReturn(Map.of("1", 5, "2", 5));

        // Act
        ReqRes response = foldersManagementService.getAllFolderDetails(request);

        // Assert
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getMessage()).isEqualTo("Successfully retrieved all folder details.");
        Assertions.assertThat(response.getCurrentSemester()).isEqualTo(2);
        Assertions.assertThat(response.getNumOfModsInEachFolder()).isEqualTo(Map.of("1", 5, "2", 5));
    }

    @Test
    public void FolderManagementService_AddModIntoSpecificFolder_ReturnsSuccess() throws IOException {
        // Arrange
        ReqRes request = ReqRes.builder()
                .email("test@u.nus.edu")
                .folderName((byte) 1)
                .moduleCode("CS1010")
                .build();

        User user = User.builder().email("test@u.nus.edu").build();

        when(ourUserDetailsService.findUserByEmail(anyString())).thenReturn(Optional.of(user));
        doNothing().when(redissonConfig).removeSpecificUserCache(anyString());

        // Act
        ReqRes response = foldersManagementService.addModIntoSpecificFolder(request);

        // Assert
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Assertions.assertThat(response.getMessage()).isEqualTo("Module added into folder successfully.");

        // Verify folder save
        verify(foldersRepo).save(folderCaptor.capture());
        Folder savedFolder = folderCaptor.getValue();
        Assertions.assertThat(savedFolder.getEmail()).isEqualTo("test@u.nus.edu");
        Assertions.assertThat(savedFolder.getFolderName()).isEqualTo((byte) 1);
        Assertions.assertThat(savedFolder.getModuleCode()).isEqualTo("CS1010");
    }
}
