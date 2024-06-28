package com.gradlohbackend.orbital.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.service.FoldersManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Map;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(SpringExtension.class)
public class FolderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FoldersManagementService foldersManagementService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void FolderController_GetAllFolderDetails_ReturnOk() throws Exception {
        // Arrange
        ReqRes getAllFolderDetailsReqRes = ReqRes.builder()
                .email("test@u.nus.edu")
                .build();

        ReqRes responseReqRes = ReqRes.builder()
                .statusCode(HttpStatus.OK)
                .message("Successfully retrieved all folder details.")
                .currentSemester(2)
                .numOfModsInEachFolder(Map.of("1", 5, "2", 5, "3", 5, "4", 5, "5", 3, "6", 3, "7", 1, "8", 1))
                .build();

        given(foldersManagementService.getAllFolderDetails(ArgumentMatchers.any())).willReturn(responseReqRes);

        // Act
        ResultActions response = mockMvc.perform(get("/allfolderdetails")
                .param("email", "test@u.nus.edu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(getAllFolderDetailsReqRes)));

        // Assert
        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value("OK"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Successfully retrieved all folder details."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.currentSemester").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.numOfModsInEachFolder.1").value(5))
                .andExpect(MockMvcResultMatchers.jsonPath("$.numOfModsInEachFolder.2").value(5));
    }
}
