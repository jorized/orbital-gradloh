package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.config.RedissonConfig;
import com.gradlohbackend.orbital.dto.ReqRes;
import com.gradlohbackend.orbital.entity.Folder;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.FoldersRepo;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.redisson.api.RedissonClient;
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
    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private RedissonConfig redissonConfig;

    public ReqRes getAllFolderDetails(ReqRes allFolderDetailsRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(allFolderDetailsRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            response.setCurrentSemester(foldersRepo.findCurrentSemesterByEmail(allFolderDetailsRequest.getEmail()));
            response.setNumOfModsInEachFolder(usersRepo.findNumberOfModulesInEachFolderByEmail(allFolderDetailsRequest.getEmail()));


            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved all folder details.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getSpecificFolderDetails(ReqRes specificFolderDetailsRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(specificFolderDetailsRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }
            redissonConfig.removeSpecificUserCache(specificFolderDetailsRequest.getEmail());
            response.setModsInSpecificFolder(foldersRepo.findModuleCodesByEmailAndFolderName(specificFolderDetailsRequest.getEmail(),
                    specificFolderDetailsRequest.getFolderName()));
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved specific folder details.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getModulesUpTillCurrentSem(ReqRes modulesUpTillCurrentSemRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(modulesUpTillCurrentSemRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            response.setModsUpTillCurrentSem(foldersRepo.findModulesUpTillCurrentSemByEmail(modulesUpTillCurrentSemRequest.getEmail()));
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved modules up till current semester.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getModulesForEveryFolder(ReqRes modulesForEveryFolderRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(modulesForEveryFolderRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            response.setModsForEveryFolder(foldersRepo.findEveryFoldersModulesByEmail(modulesForEveryFolderRequest.getEmail()));
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved modules for every semester.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes getModulesForPrevFolderToCurrFolder(ReqRes modulesForPrevFolderToCurrFolderRequest) {
        ReqRes response = new ReqRes();
        try {
            var userOptional = ourUserDetailsService.findUserByEmail(modulesForPrevFolderToCurrFolderRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }
            //Clear any previous caches
            redissonConfig.removeSpecificUserCache(modulesForPrevFolderToCurrFolderRequest.getEmail());

            response.setModsForPrevFolderToCurrFolder(foldersRepo
                    .findPrevToCurrFoldersModulesByEmailAndFolderName(
                            modulesForPrevFolderToCurrFolderRequest.getEmail(),
                            modulesForPrevFolderToCurrFolderRequest.getFolderName()));
            response.setStatusCode(HttpStatus.OK); // 200
            response.setMessage("Successfully retrieved modules for previous folder to current folder.");

        } catch (Exception e) {
            System.out.println(e);
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500
            response.setMessage("An internal error occurred.");
        }
        return response;
    }

    public ReqRes addModIntoSpecificFolder(ReqRes addModIntoSpecificFolderRequest) {
        ReqRes response = new ReqRes();

        try {
            var userOptional = ourUserDetailsService.findUserByEmail(addModIntoSpecificFolderRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            Folder addedFolder = new Folder();
            addedFolder.setEmail(addModIntoSpecificFolderRequest.getEmail());
            addedFolder.setFolderName(addModIntoSpecificFolderRequest.getFolderName());
            addedFolder.setModuleCode(addModIntoSpecificFolderRequest.getModuleCode());
            foldersRepo.save(addedFolder);
            redissonConfig.removeSpecificUserCache(addModIntoSpecificFolderRequest.getEmail());
            response.setMessage("Module added into folder successfully.");
            response.setStatusCode(HttpStatus.CREATED);

        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }

        return response;
    }

    public ReqRes deleteModFromFolder(ReqRes deleteModFromFolderRequest) {
        ReqRes response = new ReqRes();

        try {

            var userOptional = ourUserDetailsService.findUserByEmail(deleteModFromFolderRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            foldersRepo.deleteModuleFromFolderByEmailAndFolderNameAndModuleCode(
                    deleteModFromFolderRequest.getEmail(),
                    deleteModFromFolderRequest.getFolderName(),
                    deleteModFromFolderRequest.getModuleCode()
            );

            redissonConfig.removeSpecificUserCache(deleteModFromFolderRequest.getEmail());
            response.setMessage("Module deleted from folder successfully.");
            response.setStatusCode(HttpStatus.OK);

        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }

        return response;
    }

    public ReqRes insertSamplePlan(ReqRes insertSamplePlanRequest) {
        ReqRes response = new ReqRes();

        try {

            var userOptional = ourUserDetailsService.findUserByEmail(insertSamplePlanRequest.getEmail());

            if (userOptional.isEmpty()) {
                response.setStatusCode(HttpStatus.NOT_FOUND); // 404
                response.setMessage("Email does not exist.");
                return response;
            }

            //Load in the sample plans for the users. Additional plans for additional academic disciplines.
            if (!userOptional.get().getPrimaryMajor().isEmpty()) {
                //Delete folders then insert sample plan
                foldersRepo.deleteFoldersByEmail(insertSamplePlanRequest.getEmail());
                foldersRepo.insertSingleMajorSamplePlanByEmail(insertSamplePlanRequest.getEmail());
            }

            redissonConfig.removeSpecificUserCache(insertSamplePlanRequest.getEmail());
            response.setMessage("Sample plan loaded successfully.");
            response.setStatusCode(HttpStatus.CREATED);


        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }
}
