package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.repository.FoldersRepo;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FoldersManagementService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private FoldersRepo foldersRepo;
    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    public ReqRes getAllFolderDetails(ReqRes allFolderDetailsRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(allFolderDetailsRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            response.setCurrentSemester(foldersRepo.findCurrentSemesterByEmail(allFolderDetailsRequest.getEmail()));
            response.setNumOfModsInEachFolder(usersRepo.findNumberOfModulesInEachFolderByEmail(allFolderDetailsRequest.getEmail()));
            response.setStatusCode(HttpStatus.OK.value()); // 200
            response.setMessage("Successfully retrieved all folder details.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getSpecificFolderDetails(ReqRes specificFolderDetailsRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(specificFolderDetailsRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            response.setModsInSpecificFolder(foldersRepo.findModuleCodesByEmailAndFolderName(specificFolderDetailsRequest.getEmail(),
                    specificFolderDetailsRequest.getFolderName()));
            response.setStatusCode(HttpStatus.OK.value()); // 200
            response.setMessage("Successfully retrieved specific folder details.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }
}
