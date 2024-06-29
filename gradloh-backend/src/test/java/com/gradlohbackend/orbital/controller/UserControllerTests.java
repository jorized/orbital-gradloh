package com.gradlohbackend.orbital.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradlohbackend.orbital.config.JWTAuthFilter;
import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.service.JWTUtils;
import com.gradlohbackend.orbital.service.UsersManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(SpringExtension.class)
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsersManagementService usersManagementService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void UserController_CreateUser_ReturnCreated() throws Exception {

        //Arrange
        ReqRes registerReqRes = ReqRes.builder()
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

        ReqRes responseReqRes = ReqRes.builder()
                .statusCode(HttpStatus.CREATED)
                .message("User created successfully.")
                .refreshToken("generatedRefreshToken")
                .accessToken("generatedAccessToken")
                .build();

        given(usersManagementService.register(ArgumentMatchers.any())).willReturn(responseReqRes);

        // Act
        ResultActions response = mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReqRes)));

        // Assert
        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value("CREATED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("User created successfully."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.refreshToken").value("generatedRefreshToken"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").value("generatedAccessToken"));
    }

    @Test
    public void UserController_Login_ReturnOk() throws Exception {
        ReqRes loginReqRes = ReqRes.builder()
                .email("test@u.nus.edu")
                .password("testpassword")
                .build();
        // Arrange
        ReqRes responseReqRes = ReqRes.builder()
                .statusCode(HttpStatus.OK)
                .message("Successfully Logged In")
                .refreshToken("generatedRefreshToken")
                .accessToken("generatedAccessToken")
                .completedOnboard(true)
                .nickname("Jordan")
                .build();

        given(usersManagementService.login(ArgumentMatchers.any())).willReturn(responseReqRes);

        // Act
        ResultActions response = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReqRes)));

        // Assert
        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value("OK"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Successfully Logged In"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.refreshToken").value("generatedRefreshToken"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").value("generatedAccessToken"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.completedOnboard").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.nickname").value("Jordan"));
    }

}
