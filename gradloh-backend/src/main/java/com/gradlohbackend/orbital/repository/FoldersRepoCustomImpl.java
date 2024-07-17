package com.gradlohbackend.orbital.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gradlohbackend.orbital.repository.UsersRepoCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository
public class FoldersRepoCustomImpl implements FoldersRepoCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Cacheable(value = "everymodulereview", key = "#email")
    public Map<String, Integer> findEveryModuleReviewByEmail(String email) {
        Query query = entityManager.createNativeQuery(
                        "SELECT f.module_code, f.review " +
                                "FROM Folders f " +
                                "WHERE f.email = :email AND f.review <> 0")
                .setParameter("email", email);

        List<Object[]> results = query.getResultList();
        Map<String, Integer> resultMap = new HashMap<>();

        for (Object[] result : results) {
            String moduleCode = (String) result[0];
            Integer review = ((Number) result[1]).intValue();
            resultMap.put(moduleCode, review);
        }

        return resultMap;
    }

}
