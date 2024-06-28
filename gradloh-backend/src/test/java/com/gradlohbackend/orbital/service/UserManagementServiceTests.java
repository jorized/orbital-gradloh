package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserManagementServiceTests {

    @Mock
    private UsersRepo usersRepo;

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private OurUserDetailsService ourUserDetailsService;

    @InjectMocks
    private UsersManagementService usersManagementService;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void UserManagementService_Register_ReturnsUserReqResDTO() {
        // Arrange
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

        ReqRes userReqResDTO = ReqRes.builder()
                .email("test@u.nus.edu")
                .nickname("testuser")
                .password("testpassword")
                .refreshToken("testtoken")
                .resetOTP("ABCDEF")
                .resetOTPExp(0L)
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

        // Mock the JWTUtils methods
        when(jwtUtils.generateRefreshToken(any(User.class))).thenReturn("generatedRefreshToken");
        when(jwtUtils.generateAccessToken(any(User.class))).thenReturn("generatedAccessToken");

        // Mock repository save method
        when(usersRepo.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setRefreshToken("generatedRefreshToken"); // Mocking the refresh token assignment
            return savedUser;
        });

        // Act
        ReqRes savedReqRes = usersManagementService.register(userReqResDTO);

        // Assert
        Assertions.assertThat(savedReqRes).isNotNull();
        Assertions.assertThat(savedReqRes.getRefreshToken()).isEqualTo("generatedRefreshToken");
        Assertions.assertThat(savedReqRes.getAccessToken()).isEqualTo("generatedAccessToken");
        Assertions.assertThat(savedReqRes.getMessage()).isEqualTo("User created successfully.");
        Assertions.assertThat(savedReqRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    public void UserManagementService_Login_ReturnsSuccess() {
        // Arrange
        ReqRes loginRequest = ReqRes.builder()
                .email("test@u.nus.edu")
                .password("testpassword")
                .build();

        User user = User.builder()
                .email("test@u.nus.edu")
                .nickname("testuser")
                .password("testpassword")
                .refreshToken("testtoken")
                .role(User.Role.USER)
                .build();

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(ourUserDetailsService.findUserByEmail(anyString())).thenReturn(Optional.of(user));
        when(jwtUtils.generateRefreshToken(any(User.class))).thenReturn("generatedRefreshToken");
        when(jwtUtils.generateAccessToken(any(User.class))).thenReturn("generatedAccessToken");

        // Act
        ReqRes response = usersManagementService.login(loginRequest);

        // Assert
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getMessage()).isEqualTo("Successfully Logged In");
        Assertions.assertThat(response.getRefreshToken()).isEqualTo("generatedRefreshToken");
        Assertions.assertThat(response.getAccessToken()).isEqualTo("generatedAccessToken");
    }
}
