package com.gradlohbackend.orbital.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gradlohbackend.orbital.entity.User;
import lombok.Data;

import java.util.List;

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
    private String nickname;
    private String email;
    private String password;
    private User user;
    private List<User> userList;

}
