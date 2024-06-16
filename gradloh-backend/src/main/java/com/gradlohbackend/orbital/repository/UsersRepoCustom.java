package com.gradlohbackend.orbital.repository;

import java.util.List;
import java.util.Map;

public interface UsersRepoCustom {
    Map<String, Integer> findCompletedDSACoreModsByEmail(String email);
    Map<String, Integer> findNumberOfModulesInEachFolderByEmail(String email);
}
