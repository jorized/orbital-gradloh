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

        if (result != null) {
            Integer totalModulesCompleted = result[0] != null ? ((Number) result[0]).intValue() : 0; // Default to 0 if null
            Integer totalModulesRequired = result[1] != null ? ((Number) result[1]).intValue() : 0; // Default to 0 if null

            resultMap.put("totalModulesCompleted", totalModulesCompleted);
            resultMap.put("totalModulesRequired", totalModulesRequired);
        } else {
            resultMap.put("totalModulesCompleted", 0); // Default value
            resultMap.put("totalModulesRequired", 0); // Default value
        }

        return resultMap;
    }

    @Cacheable(value = "numberOfModulesInEachFolder", key = "#email")
    public Map<String, Integer> findNumberOfModulesInEachFolderByEmail(String email) {
        Query query = entityManager.createNativeQuery(
                        "SELECT folders.folder_name, COALESCE(COUNT(F.email), 0) AS count " +
                                "FROM (SELECT 1 AS folder_name UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8) AS folders " +
                                "LEFT JOIN Folders F ON folders.folder_name = F.folder_name AND F.email = :email " +
                                "GROUP BY folders.folder_name " +
                                "ORDER BY folders.folder_name")
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
