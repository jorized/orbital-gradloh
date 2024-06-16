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
public class UsersRepoCustomImpl implements UsersRepoCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Cacheable(value = "completedDSACoreModules", key = "#email")
    public Map<String, Integer> findCompletedDSACoreModsByEmail(String email) {
        Query query = entityManager.createNativeQuery(
                        "WITH ct2 AS ( " +
                                "  SELECT " +
                                "    p.module_type, " +
                                "    COUNT(*) AS completed " +
                                "  FROM PrimaryMajorRequirements AS p " +
                                "  INNER JOIN ( " +
                                "    SELECT " +
                                "      u.primary_major, " +
                                "      f.* " +
                                "    FROM Users AS u " +
                                "    INNER JOIN Folders AS f USING(email) " +
                                "    WHERE email = :email " +
                                "    ORDER BY folder_name " +
                                "  ) AS ct1 " +
                                "  USING (primary_major, module_code) " +
                                "  WHERE email = :email " +
                                "  GROUP BY p.module_type " +
                                ") " +
                                "SELECT " +
                                "  SUM(ct2.completed) AS total_modules_completed, " +
                                "  CASE WHEN EXISTS (SELECT 1 FROM ct2 WHERE module_type = 'Core_4B') THEN 14 " +
                                "    ELSE 16 END AS total_modules_required " +
                                "FROM ct2")
                .setParameter("email", email);

        Object[] result = (Object[]) query.getSingleResult();
        Map<String, Integer> resultMap = new HashMap<>();
        resultMap.put("totalModulesCompleted", ((Number) result[0]).intValue());
        resultMap.put("totalModulesRequired", ((Number) result[1]).intValue());
        return resultMap;
    }

    @Cacheable(value = "numberOfModulesInEachFolder", key = "#email")
    public Map<String, Integer> findNumberOfModulesInEachFolderByEmail(String email) {
        Query query = entityManager.createNativeQuery(
                        "SELECT " +
                                "folder_name, COUNT(*) as count " +
                                "FROM Folders " +
                                "WHERE email = :email " +
                                "GROUP BY folder_name " +
                                "HAVING folder_name BETWEEN 1 AND 8")
                .setParameter("email", email);

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();
        Map<String, Integer> resultMap = new HashMap<>();
        for (Object[] result : results) {
            resultMap.put(result[0].toString(), ((Number) result[1]).intValue());
        }
        return resultMap;
    }
}
