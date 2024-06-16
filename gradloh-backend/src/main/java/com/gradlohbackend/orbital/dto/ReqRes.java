package com.gradlohbackend.orbital.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.gradlohbackend.orbital.entity.User;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String refreshToken;
    private String accessToken;
    private String expirationTime;
    private String resetOTP;
    private Long resetOTPExp;
    private Boolean completedOnboard;
    private Boolean isDarkMode;
    private String enrolmentYear;
    private String primaryMajor;
    private String secondaryMajor;
    private String firstMinor;
    private String secondMinor;
    private String homeFaculty;
    private String newPassword;
    private String confirmNewPassword;
    private String nickname;
    private String email;
    private String password;
    private String confirmPassword;
    private User user;
    private List<User> userList;
    private int completedModulesPercentage;
    private String progressionStatus;
    private int completedCHSModules;
    private Map<String, Integer> completedCoreModules;
    private int currentSemester;
    private Map<String, Integer> numOfModsInEachFolder;
    private List<String> modsInSpecificFolder;
    private Byte folderName;

}
