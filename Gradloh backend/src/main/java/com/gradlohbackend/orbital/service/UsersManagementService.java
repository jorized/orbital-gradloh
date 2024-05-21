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


    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            User ourUser = new User();
            ourUser.setNickname(registrationRequest.getNickname());
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setRole(Role.USER);
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUser.setRefreshToken(jwtUtils.generateRefreshToken(ourUser));
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
                response.setMessage("User not found.");
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
