package com.gradlohbackend.orbital.repository;

import java.util.Map;

public interface FoldersRepoCustom {
    Map<String, Integer> findEveryModuleReviewByEmail(String email);
}