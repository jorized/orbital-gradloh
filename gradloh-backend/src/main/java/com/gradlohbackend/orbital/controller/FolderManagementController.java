package com.gradlohbackend.orbital.controller;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.service.FoldersManagementService;
import com.gradlohbackend.orbital.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//Any folder-related endpoint goes here
@RestController
public class FolderManagementController {
    @Autowired
    private FoldersManagementService foldersManagementService;
    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    @GetMapping("/allfolderdetails")
    public ResponseEntity<ReqRes> getAllFolderDetails(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getAllFolderDetails(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/specificfolderdetails")
    public ResponseEntity<ReqRes> getSpecificFolderDetails(@RequestParam String email, @RequestParam Byte folderName) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getSpecificFolderDetails(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }
}
