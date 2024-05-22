package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.Role;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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

    private EmailService emailService;

    public UsersManagementService(EmailService emailService) {
        this.emailService = emailService;
    }

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            User ourUser = new User();
            ourUser.setNickname(registrationRequest.getNickname());
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setRole(Role.USER);
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUser.setRefreshToken(jwtUtils.generateRefreshToken(ourUser));
            ourUser.setResetOTP("");
            ourUser.setResetOTPExp(0);
            User userResult = usersRepo.save(ourUser);

            resp.setRefreshToken(userResult.getRefreshToken());
            resp.setAccessToken(jwtUtils.generateAccessToken(ourUser));
            resp.setMessage("User created successfully.");
            resp.setStatusCode(201); // 201 Created
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("Duplicate entry")) {
                resp.setMessage("This email already exists.");
                resp.setStatusCode(409); // 409 Conflict
            } else {
                resp.setMessage("Internal Server Error.");
                resp.setStatusCode(500); // 500 Internal Server Error
            }
        } catch (Exception e) {
            resp.setMessage("Internal Server Error.");
            resp.setStatusCode(500); // 500 Internal Server Error
        }

        return resp;
    }


    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            // Attempt to authenticate the user.
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getPassword()));

            // Retrieve the user details from the database.
            var userOptional = usersRepo.findByEmail(loginRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
                response.setMessage("Invalid email or password.");
                return response;
            }

            var user = userOptional.get();
            user.setRefreshToken(jwtUtils.generateRefreshToken(user));
            User userResult = usersRepo.save(user);

            response.setAccessToken(jwtUtils.generateAccessToken(user));
            response.setRefreshToken(userResult.getRefreshToken());
            response.setStatusCode(HttpStatus.OK.value()); // 200
            response.setMessage("Successfully Logged In");
        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
            response.setMessage("Invalid email or password.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    //Sending email w otp
    public ReqRes sendResetEmail(ReqRes sendResetEmailRequest) {
        ReqRes response = new ReqRes();
        try {
            // Retrieve the user details from the database.
            var userOptional = usersRepo.findByEmail(sendResetEmailRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
                response.setMessage("Invalid email address.");
                return response;
            }

            //If successful, generate otp
            var user = userOptional.get();
            String otp = emailService.generateOTP();
            long otpExpirationtime = emailService.getOtpExpirationTime();

            user.setResetOTP(otp);
            user.setResetOTPExp(otpExpirationtime);
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
            response.setStatusCode(HttpStatus.OK.value()); // 200
            response.setEmail(user.getEmail());
            response.setMessage("Sent OTP to email address.");


        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
            response.setMessage("Invalid email address.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes resetPassword(ReqRes resetPasswordRequest) {
        ReqRes response = new ReqRes();

        try {
            // Retrieve the user details from the database.
            var userOptional = usersRepo.findByEmail(resetPasswordRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
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
                    response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
                    response.setMessage("Passwords do not match.");
                } else {
                    //If its same, then check if new password is the old password
                    Boolean passwordsMatch = passwordEncoder.matches(resetPasswordRequest.getNewPassword(), user.getPassword());
                    if (passwordsMatch) {
                        response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
                        response.setMessage("New password cannot be the same as old password.");
                    } else {
                        //Else, reset new password
                        var encodedNewPassword = passwordEncoder.encode(resetPasswordRequest.getNewPassword());
                        user.setPassword(encodedNewPassword);
                        usersRepo.save(user);
                        response.setStatusCode(HttpStatus.OK.value()); // 200
                        response.setMessage("Password has successfully been reset.");
                    }

                }

            } else {
                // Invalid OTP
                response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
                response.setMessage("Invalid OTP.");
            }

        } catch (AuthenticationException e) {
            // Handle authentication failures.
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value()); // 401
            response.setMessage("Invalid email address.");
        } catch (Exception e) {
            // Handle general exceptions, possibly logging them.
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
            response.setMessage("An internal error occurred.");
        }

        return response;
    }

    //Getting new access token through refresh token
    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {

            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getRefreshToken());
            Optional<User> userOpt = usersRepo.findByEmail(ourEmail);
            if (userOpt.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value());
                response.setMessage("User not found.");
                return response;
            }

            User user = userOpt.get();

            response.setAccessToken(jwtUtils.generateAccessToken(user));
            response.setStatusCode(HttpStatus.OK.value()); // 200 OK
            response.setMessage("Successfully refreshed token.");
        } catch (ExpiredJwtException e) { //If token is expired
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            response.setMessage("Token expired. Please login again or use a refresh token.");
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("Invalid token.");
        }
        return response;
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<User> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setUserList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            User usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setUser(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, User updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setNickname(updatedUser.getNickname());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = usersRepo.save(existingUser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }
}
