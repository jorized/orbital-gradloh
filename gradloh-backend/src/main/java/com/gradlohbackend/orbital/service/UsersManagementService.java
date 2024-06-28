package com.gradlohbackend.orbital.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gradlohbackend.orbital.config.RedissonConfig;
import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import com.gradlohbackend.orbital.repository.UsersRepoCustom;
import com.gradlohbackend.orbital.repository.UsersRepoCustomImpl;
import io.jsonwebtoken.ExpiredJwtException;
import org.redisson.api.RMap;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private OurUserDetailsService ourUserDetailsService;
    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private RedissonConfig redissonConfig;

    private EmailService emailService;

    public UsersManagementService(EmailService emailService) {
        this.emailService = emailService;
    }

    public ReqRes processRegister(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            //Check if email exists
            var userOptional = ourUserDetailsService.findUserByEmail(registrationRequest.getEmail());
            if (!userOptional.isEmpty()) {
                resp.setMessage("Email already exists.");
                resp.setStatusCode(HttpStatus.CONFLICT);
                return resp;
            }
            //If email does not start with @u.nus.edu
            if (!registrationRequest.getEmail().endsWith("@u.nus.edu")) {
                resp.setMessage("Invalid student email.");
                resp.setStatusCode(HttpStatus.BAD_REQUEST);
                return resp;
            }

            // If email is correct, check if password meets criteria
            String password = registrationRequest.getPassword();
            if (!isValidPassword(password)) {
                resp.setMessage("Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
                resp.setStatusCode(HttpStatus.BAD_REQUEST);
                return resp;
            }

            // Check if password matches confirm password
            if (!password.equals(registrationRequest.getConfirmPassword())) {
                resp.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
                resp.setMessage("Passwords do not match.");
                return resp;
            }

            resp.setNickname(registrationRequest.getNickname());
            resp.setEmail(registrationRequest.getEmail());
            resp.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            resp.setMessage("Registration valid.");
            resp.setStatusCode(HttpStatus.OK); // 201 Created
        } catch (Exception e) {
            resp.setMessage("Internal Server Error.");
            resp.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }

        return resp;
    }

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            User ourUser = User.builder()
                    .email(registrationRequest.getEmail())
                    .nickname(registrationRequest.getNickname())
                    .password(registrationRequest.getPassword())
                    .role(User.Role.USER)
                    .completedOnboard(false)
                    .completedTutorial(false)
                    .enrolmentYear(registrationRequest.getEnrolmentYear())
                    .primaryMajor(registrationRequest.getPrimaryMajor())
                    .secondaryMajor(registrationRequest.getSecondaryMajor())
                    .firstMinor(registrationRequest.getFirstMinor())
                    .secondMinor(registrationRequest.getSecondMinor())
                    .homeFaculty(registrationRequest.getHomeFaculty())
                    .build();

            ourUser.setRefreshToken(jwtUtils.generateRefreshToken(ourUser));

            User userResult = usersRepo.save(ourUser);

            resp.setRefreshToken(userResult.getRefreshToken());
            resp.setAccessToken(jwtUtils.generateAccessToken(ourUser));
            resp.setMessage("User created successfully.");
            resp.setStatusCode(HttpStatus.CREATED);

        } catch (Exception e) {
            resp.setMessage("This combination has not yet been configured.");
            resp.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }

        return resp;
    }


    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            // Attempt to authenticate the user.

            Authentication testauth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getPassword()));

            var userOptional = ourUserDetailsService.findUserByEmail(loginRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Invalid email or password.");
                return response;
            }

            var user = userOptional.get();
            user.setRefreshToken(jwtUtils.generateRefreshToken(user));

            usersRepo.updateRefreshToken(jwtUtils.generateRefreshToken(user), loginRequest.getEmail());

            response.setNickname(user.getNickname());
            response.setAccessToken(jwtUtils.generateAccessToken(user));
            response.setRefreshToken(user.getRefreshToken());
            response.setCompletedOnboard(user.getCompletedOnboard());
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully Logged In");
        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
            response.setMessage("Invalid email or password.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }


    public ReqRes logout(ReqRes logoutRequest) {
        ReqRes response = new ReqRes();
        try {

            var userOptional = ourUserDetailsService.findUserByEmail(logoutRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Invalid email or password.");
                return response;
            }

            redissonConfig.removeSpecificUserCache(logoutRequest.getEmail());
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully logged out");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes updateOnboard(ReqRes onboardRequest) {
        ReqRes response = new ReqRes();
        try {

            var userOptional = ourUserDetailsService.findUserByEmail(onboardRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            var user = userOptional.get();
            user.setCompletedOnboard(true);
            usersRepo.save(user);
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Updated onboarding status.");
        }  catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getProgressDetails(ReqRes userProgressDetailsRequest) {
        ReqRes response = new ReqRes();
        try {

            var userOptional = ourUserDetailsService.findUserByEmail(userProgressDetailsRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            //Set Pie and Status percentage
            response.setCompletedModulesPercentage(usersRepo.findCompletedModulesPercentageByEmail(userProgressDetailsRequest.getEmail()));
            response.setProgressionStatus(usersRepo.findProgressionStatusByEmail(userProgressDetailsRequest.getEmail()));

            // If CHS student
            if ("FOS".equals(userOptional.get().getHomeFaculty()) || "FASS".equals(userOptional.get().getHomeFaculty())) {
                // If DSA student
                if ("Data Science and Analytics".equals(userOptional.get().getPrimaryMajor())) {

                    response.setCompletedCoreModules(usersRepo.findCompletedDSACoreModsByEmail(userProgressDetailsRequest.getEmail()));
                }

                response.setCompletedCHSModules(ourUserDetailsService.getCompletedCHSModules(userProgressDetailsRequest.getEmail()));
                response.setHomeFaculty("CHS");

            }

            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved progress details.");

        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }


    //Sending email w otp
    public ReqRes sendResetEmail(ReqRes sendResetEmailRequest) {
        ReqRes response = new ReqRes();
        try {
            // Retrieve the user details from the database.
            var userOptional = ourUserDetailsService.findUserByEmail(sendResetEmailRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Invalid email address.");
                return response;
            }

            //If successful, generate otp
            var user = userOptional.get();
            String otp = emailService.generateOTP();
            long otpExpirationtime = emailService.getOtpExpirationTime();

            user.setResetOtp(otp);
            user.setResetOtpExp(otpExpirationtime);
            usersRepo.save(user);

            String htmlContent = "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">" +
                    "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
                    "<div style=\"border-bottom:1px solid #eee\">" +
                    "<a href=\"\" style=\"font-size:1.4em;color: #EF7C00;text-decoration:none;font-weight:600\">GradLoh</a>" +
                    "</div>" +
                    "<p style=\"font-size:1.1em\">Hi " + user.getNickname() + ",</p>" +
                    "<p>Use the following OTP to reset your password. OTP is valid for 5 minutes</p>" +
                    "<h2 style=\"background: #EF7C00;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">" + otp + "</h2>" +
                    "<br>" +
                    "<hr style=\"border:none;border-top:1px solid #eee\" />" +
                    "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">" +
                    "<p>Copyright © 2024 - 2024 GradLoh</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

            emailService.sendHtmlEmail(user.getEmail(), "GRADLOH: Reset Password",
                    htmlContent);
            response.setStatusCode(HttpStatus.OK); // 200
            response.setEmail(user.getEmail());
            response.setMessage("Sent OTP to email address.");


        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
            response.setMessage("Invalid email address.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes resetPassword(ReqRes resetPasswordRequest) {
        ReqRes response = new ReqRes();

        try {
            // Retrieve the user details from the database.
            var userOptional = ourUserDetailsService.findUserByEmail(resetPasswordRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Invalid email address.");
                return response;
            }

            //If successful, check otp
            var user = userOptional.get();

            //If valid otp,
            if (emailService.validateOtp(user.getEmail(), resetPasswordRequest.getResetOTP())) {
                //Check if password and confirm password is same.
                if (!resetPasswordRequest.getNewPassword().equals(resetPasswordRequest.getConfirmNewPassword())) {
                    // Invalid match
                    response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
                    response.setMessage("Passwords do not match.");
                    return response;
                } else {
                    //If its same, then check if new password is the old password
                    Boolean passwordsMatch = passwordEncoder.matches(resetPasswordRequest.getNewPassword(), user.getPassword());
                    if (passwordsMatch) {
                        response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
                        response.setMessage("New password cannot be the same as old password.");
                        return response;
                    } else {
                        //Else, reset new password
                        var encodedNewPassword = passwordEncoder.encode(resetPasswordRequest.getNewPassword());
                        user.setPassword(encodedNewPassword);

                        User userresult = usersRepo.save(user);

                        response.setStatusCode(HttpStatus.OK); // 200
                        response.setMessage("Password has successfully been reset.");
                        return response;
                    }

                }

            } else {
                // Invalid OTP
                response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
                response.setMessage("Invalid OTP.");
                return response;
            }

        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED); // 401
            response.setMessage("Invalid email address.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }

        return response;
    }

    public ReqRes updateNickname(ReqRes updateNicknameRequest) {
        ReqRes response = new ReqRes();
        try {
            // Retrieve the user details from the database.
            var userOptional = ourUserDetailsService.findUserByEmail(updateNicknameRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Invalid email address.");
                return response;
            }

            usersRepo.updateNicknameByEmail(updateNicknameRequest.getEmail(), updateNicknameRequest.getNickname());
            redissonConfig.removeSpecificUserCache(updateNicknameRequest.getEmail());
            response.setNickname(updateNicknameRequest.getNickname());
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Nickname has successfully been updated.");

        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    //Getting new access token through refresh token
    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {

            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getRefreshToken());
            Optional<User> userOpt = ourUserDetailsService.findUserByEmail(ourEmail);
            if (userOpt.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND);
                response.setMessage("User not found.");
                return response;
            }

            User user = userOpt.get();

            response.setAccessToken(jwtUtils.generateAccessToken(user));
            response.setStatusCode(HttpStatus.OK); // 200 OK
            response.setMessage("Successfully refreshed token.");
        } catch (ExpiredJwtException e) { //If token is expired
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            response.setMessage("Token expired. Please login again or use a refresh token.");
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setMessage("Invalid token.");
        }
        return response;
    }


    // Helper method to validate password
    private boolean isValidPassword(String password) {
        if (password.length() < 8 || password.length() > 16) {
            return false;
        }
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if ("!@#$%^&*()".indexOf(c) >= 0) hasSpecial = true;
        }
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
