/*
List of folder-related complex queries 
--------------------------------------
1. Retrieve all modules up to present date
2. Retrieve total modules_completed up to present date
3. Return percentage completion up to present date
4. Progress indicator given present date
5. Folder of current sem
6. Folder of specified sem

*/






/*
	1. Query to return modules up to present date

*/
SELECT 
	u.enrolment_year,
    f.*
FROM Folders AS f
INNER JOIN users AS u 
USING(email)
WHERE 
	email='e0968871@u.nus.edu' AND
    folder_name <= 
		CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1
			ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END
ORDER BY folder_name;







/*
	2. returns TOTAL modules_completed up to present date

*/
SELECT 
	COUNT(*) AS modules_completed,
    40 AS modules_required
FROM Folders AS f
INNER JOIN users AS u 
USING(email)
WHERE 
	email='e0968871@u.nus.edu' AND
    folder_name <= 
		CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1
			ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END
;





/*
	3. returns PERCENTAGE modules_completed up to present date

*/
SELECT 
	ROUND(COUNT(*)/40 * 100, 0) AS modules_completed
FROM Folders AS f
INNER JOIN users AS u 
USING(email)
WHERE 
	email='e0968871@u.nus.edu' AND
    folder_name <= 
		CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1
			ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END
;







/*	
	4. returns progress indicator given present date

*/
SELECT 
	CASE WHEN MAX(folder_name) * 5 > COUNT(*) THEN 'At Risk' 
		ELSE 'On Track' END AS progress
FROM Folders AS f
INNER JOIN users AS u 
USING(email)
WHERE 
	email='e0968871@u.nus.edu' AND
    folder_name <= 
		CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1
			ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END
;
            
            
            
            
            
            
/*
	5. returns folder of current sem

*/
SELECT 
	f.*
FROM Folders AS f
INNER JOIN users AS u 
USING(email)
WHERE 
	email='e0968871@u.nus.edu' AND
    folder_name = 
		CASE WHEN MONTH(CURRENT_DATE()) >= 8 THEN (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 + 1
			ELSE (YEAR(CURRENT_DATE()) - CAST(LEFT(enrolment_year, 4) AS UNSIGNED)) * 2 END
;








/*
	6. returns folder of specified sem: replace email and folder_name
    
*/
SELECT *
FROM Folders 
WHERE email='e0968871@u.nus.edu' AND folder_name=2
