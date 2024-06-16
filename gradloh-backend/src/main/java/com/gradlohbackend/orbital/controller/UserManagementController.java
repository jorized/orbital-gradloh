package com.gradlohbackend.orbital.controller;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.service.OurUserDetailsService;
import com.gradlohbackend.orbital.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

//Any user-related endpoint goes here
@RestController
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;
    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    //Auth routes (those that begin with /auth, do not require JWT)
    @PostMapping("/auth/processregister")
    public ResponseEntity<ReqRes> processRegister(@RequestBody ReqRes req){
        var reqRes = usersManagementService.processRegister(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes req){
        var reqRes = usersManagementService.register(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        var reqRes = usersManagementService.login(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/auth/sendresetemail")
    public ResponseEntity<ReqRes> sendResetEmail(@RequestBody ReqRes req){
        var reqRes = usersManagementService.sendResetEmail(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/auth/resetpassword")
    public ResponseEntity<ReqRes> resetPassword(@RequestBody ReqRes req){
        var reqRes = usersManagementService.resetPassword(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        var reqRes = usersManagementService.refreshToken(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    //Normal routes (require either user/admin JWT)
    @PostMapping("/updateonboarding")
    public ResponseEntity<ReqRes> updateOnboarding(@RequestBody ReqRes req) {

        var reqRes = usersManagementService.updateOnboard(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/userprogressdetails")
    public ResponseEntity<ReqRes> getUserProgressDetails(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = usersManagementService.getProgressDetails(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }



    //For admin only routes (those that begin with /admin, require admin JWT)
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody User reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }


}
