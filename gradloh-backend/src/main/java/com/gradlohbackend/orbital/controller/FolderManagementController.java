package com.gradlohbackend.orbital.controller;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.service.FoldersManagementService;
import com.gradlohbackend.orbital.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/modsuptillcurrentsem")
    public ResponseEntity<ReqRes> getModulesUpTillCurrentSem(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModulesUpTillCurrentSem(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/modsforeverysem")
    public ResponseEntity<ReqRes> getModulesForEverySem(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModulesForEveryFolder(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/modsforprevsemtocurrsem")
    public ResponseEntity<ReqRes> getModulesForPrevSemToCurrSem(@RequestParam String email, @RequestParam Byte folderName) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModulesForPrevFolderToCurrFolder(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/addmodinspecificsem")
    public ResponseEntity<ReqRes> addModIntoSpecificFolder(@RequestBody ReqRes req){
        var reqRes = foldersManagementService.addModIntoSpecificFolder(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @DeleteMapping("/deletemodfromfolder")
    public ResponseEntity<ReqRes> deleteFolder(@RequestParam String email, @RequestParam Byte folderName, @RequestParam String moduleCode) {
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        req.setModuleCode(moduleCode);
        var reqRes = foldersManagementService.deleteModFromFolder(req);
        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PostMapping("/loadsampleplan")
    public ResponseEntity<ReqRes> loadSamplePlan(@RequestBody ReqRes req){
        var reqRes = foldersManagementService.insertSamplePlan(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/folderswithoutallmodsreviewed")
    public ResponseEntity<ReqRes> getFoldersWithoutAllModsReviewed(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getSemWithoutAllModsReviewed(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/folderswithmodsreviewed")
    public ResponseEntity<ReqRes> getFoldersWithModsReviewed(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);

        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getSemWithModsReviewed(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/modsinspecificfolderwithoutreviews")
    public ResponseEntity<ReqRes> getModulesInSpecificFolderWithoutReviews(@RequestParam String email, @RequestParam Byte folderName) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModsInSpecificFolderWithoutReviews(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/modsinspecificfolderwithreviews")
    public ResponseEntity<ReqRes> getModulesInSpecificFolderWithReviews(@RequestParam String email, @RequestParam Byte folderName) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModsInSpecificFolderWithReviews(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/everymodulereview")
    public ResponseEntity<ReqRes> getEveryModuleReview(@RequestParam String email) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getEveryModuleReview(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @GetMapping("/modulereview")
    public ResponseEntity<ReqRes> getModuleReview(@RequestParam String email, @RequestParam Byte folderName, @RequestParam String moduleCode) {

        // Create a ReqRes object using the email parameter
        ReqRes req = new ReqRes();
        req.setEmail(email);
        req.setFolderName(folderName);
        req.setModuleCode(moduleCode);
        // Call the service method with the created ReqRes object
        ReqRes reqRes = foldersManagementService.getModuleReview(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }

    @PutMapping("/updatemodulereview")
    public ResponseEntity<ReqRes> updatedModuleReview(@RequestBody ReqRes req){
        var reqRes = foldersManagementService.updateModuleReview(req);

        // Return the response with the appropriate status code
        return ResponseEntity.status(reqRes.getStatusCode())
                .body(reqRes);
    }


}
