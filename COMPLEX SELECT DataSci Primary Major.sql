/*
List of DSA-primary major complex queries 
-----------------------------------------
1. overview of CORE modules_completed with module type
2. Summary count of different module_types completed
3. Total count of core mods COMPLETED and total count of core mods REQUIRED for different choices of DSA student
4. Recommended core Modules that need to be completed by student in order to graduate
5. supporting query for query (4, 6)
6. Query to return module types that user has yet to complete  

List of CHS related queries
---------------------------
7. Query to get number of CHS modules_completed with corresponding pillars
8. Query to get total CHS mods completed vs total CHS mods required
9. Supporting query to test query (8, 10)
10. Recommending CHS modules to take to fulfil CHS requirements
11. Additional supporting query to test query (10)
12. Distinct pilars user has yet to fulfil
*/








/*
1. Query to get overview of CORE modules_completed with module type (DONE)
For DSA primary majors, check which modules chosen in folders have fulfilled primary major requirements
*/
WITH ct1 AS (
	SELECT 
		u.primary_major,
		f.*
	FROM Users AS u
	INNER JOIN Folders AS f
	USING(email)
    WHERE email='e0968871@u.nus.edu'
    ORDER BY folder_name -- rmb to remove this for faster query
)
SELECT
	ct1.folder_name,
	p.module_type,
    p.module_code    
FROM PrimaryMajorRequirements AS p
INNER JOIN ct1
USING (primary_major, module_code)
WHERE email='e0968871@u.nus.edu'
ORDER BY folder_name;








/* 
	2. Summary of core mods completed
	
    Core = Compulsory Modules, MUST be 11
    Core_$ = MA2311/MA2104, MUST be 1
    Core_* = ST2131/MA2116, MUST be 1
    Intern = DSA33XX OR DSA4288(X), MUST be 1
    
    for Option A
	Core_4A1 = any DSA42XX, MUST be 1
    Core_4A2 = any DSA426X MUST be 1
    
    for Option B
	Core_4B = any DSA4288(FYP variants), MUST be 1 
    
    possible successful combinations
    1. Core(11), Intern(1), Core_4A1(1), Core_4A2(1), Core_$(1), Core_*(1)
    2. Core(11), Core_4B(1), Core_$(1), Core_*(1)
    3. 1 or 2 with Spec_XXX
*/
WITH ct1 AS (
	SELECT 
		u.primary_major,
		f.*
	FROM Users AS u
	INNER JOIN Folders AS f
	USING(email)
    WHERE email='e0968871@u.nus.edu'
    ORDER BY folder_name -- rmb to remove this for faster query
)
SELECT
	module_type,
	COUNT(*) AS completed
FROM PrimaryMajorRequirements AS p
INNER JOIN ct1
USING (primary_major, module_code)
WHERE email='e0968871@u.nus.edu'
GROUP BY module_type;








/*
	3. Query to return total core mods completed and total core mods required for different choices of DSA student. Namely, students who choose option A (16 mods) and option B (14 mods)

*/
WITH ct2 AS (
	SELECT
		module_type,
		COUNT(*) AS completed
	FROM PrimaryMajorRequirements AS p
	INNER JOIN (
		SELECT 
			u.primary_major,
			f.*
		FROM Users AS u
		INNER JOIN Folders AS f
		USING(email)
		WHERE email='e0968871@u.nus.edu'
		ORDER BY folder_name -- rmb to remove this for faster query
	) AS ct1
	USING (primary_major, module_code)
	WHERE email='e0968871@u.nus.edu'
	GROUP BY module_type
)
SELECT 
	SUM(completed) AS total_modules_completed,
	CASE WHEN EXISTS (SELECT 1 FROM  ct2 WHERE module_type='Core_4B') THEN 14
		ELSE 16 END AS total_modules_required
FROM ct2;









/*
	4. Query to recommend Core DSA Modules that need to be completed by student in order to graduate
    Dynamically changes list of modules to recommend for Option A and Option B as user adds modules
*/
WITH ct1 AS (
	-- Obtain table with same matches in primary major too user's selected modules
	SELECT 
		p.*,
        f.email,
        f.folder_name
	FROM Users AS u
	LEFT JOIN PrimaryMajorRequirements AS p
	USING (primary_major)
	LEFT JOIN Folders AS f
	USING(email, module_code)
	WHERE email='e0968871@u.nus.edu'
), ct2 AS (
	-- Obtain table with counts of completed modules
	SELECT 
		module_type,
		COUNT(*) AS completed_modules
	FROM ct1
	WHERE folder_name IS NOT NULL
	GROUP BY module_type
)
SELECT 
	-- ct1.primary_major, -- (to confirm DSA)
	ct1.module_type,
    ct1.module_code
    -- ct1.folder_name, -- (to confirm NULL aka not added into their folder)
    -- ct2.*
FROM ct1 
LEFT JOIN ct2
USING (module_type)
WHERE 
	-- Future implementation: To have a separate query for specialisation since you do not need a specialisation to graduate
	(
		(ct1.module_type='Core' AND (ct2.completed_modules < 11 OR ct2.completed_modules IS NULL)) OR
		(ct1.module_type IN ('Core_$', 'Core_*') AND (ct2.completed_modules < 1 OR ct2.completed_modules IS NULL)) OR
		(ct1.module_type IN ('Core_4A1', 'Core_4A2') AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type='Core_4B') AND ct2.completed_modules IS NULL) OR 
		(ct1.module_type='Core_4B' AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type IN ('Core_4A1', 'Core_4A2')) AND ct2.completed_modules IS NULL) OR
		(ct1.module_type IN ('Core_4A1', 'Core_4A2', 'Core_4B') AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type IN ('Core_4A1', 'Core_4A2', 'Core_4B'))) 
	) AND ct1.folder_name IS NULL
;







/*
	5. supporting query for query (4, 6)
*/
DELETE FROM folders
WHERE email='e0968871@u.nus.edu' AND module_code IN ('ST2131', 'DSA4212');







/*
	6. Query to return module types that user has yet to complete    

*/
WITH ct1 AS (
	-- Obtain table with same matches in primary major too user's selected modules
	SELECT 
		p.*,
        f.email,
        f.folder_name
	FROM Users AS u
	LEFT JOIN PrimaryMajorRequirements AS p
	USING (primary_major)
	LEFT JOIN Folders AS f
	USING(email, module_code)
	WHERE email='e0968871@u.nus.edu'
), ct2 AS (
	-- Obtain table with counts of completed modules
	SELECT 
		module_type,
		COUNT(*) AS completed_modules
	FROM ct1
	WHERE folder_name IS NOT NULL
	GROUP BY module_type
)
SELECT DISTINCT
    ct1.module_type
FROM ct1 
LEFT JOIN ct2
USING (module_type)
WHERE 
	-- Future implementation: To have a separate query for specialisation since you do not need a specialisation to graduate
	(
		(ct1.module_type='Core' AND (ct2.completed_modules < 11 OR ct2.completed_modules IS NULL)) OR
		(ct1.module_type IN ('Core_$', 'Core_*') AND (ct2.completed_modules < 1 OR ct2.completed_modules IS NULL)) OR
		(ct1.module_type IN ('Core_4A1', 'Core_4A2') AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type='Core_4B') AND ct2.completed_modules IS NULL) OR 
		(ct1.module_type='Core_4B' AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type IN ('Core_4A1', 'Core_4A2')) AND ct2.completed_modules IS NULL) OR
		(ct1.module_type IN ('Core_4A1', 'Core_4A2', 'Core_4B') AND NOT EXISTS (SELECT 1 FROM ct2 WHERE module_type IN ('Core_4A1', 'Core_4A2', 'Core_4B'))) 
	) AND ct1.folder_name IS NULL
;








/*
	7. Query to get number of CHS modules_completed with corresponding pillars 
		Need to complete 12 distinct rows 
        
*/
SELECT
	pillar,
	COUNT(*) AS chs_modules_completed
FROM (
	SELECT 
		u.primary_major,
		f.*
	FROM Users AS u
	INNER JOIN Folders AS f
	USING(email)
	WHERE email='e0968871@u.nus.edu'
	ORDER BY folder_name -- rmb to remove this for faster query
) AS ct1
RIGHT JOIN CHSRequirements AS CHS
USING (module_code)
WHERE email='e0968871@u.nus.edu'
GROUP BY (pillar);









/*
	8. Query to get total CHS mods completed vs total CHS mods required

*/
WITH ct2 AS (
	SELECT
		pillar,
		COUNT(*) AS chs_modules_completed
	FROM (
		SELECT 
			u.primary_major,
			f.*
		FROM Users AS u
		INNER JOIN Folders AS f
		USING(email)
		WHERE email='e0968871@u.nus.edu'
		ORDER BY folder_name -- rmb to remove this for faster query
	) AS ct1
	INNER JOIN CHSRequirements AS CHS
	USING (module_code)
	WHERE email='e0968871@u.nus.edu'
	GROUP BY (pillar)
)
SELECT
	SUM(chs_modules_completed) AS total_completed,
    13 AS total_required
FROM ct2;








/* 
	9. Supporting query to test query (8) and (10)
*/
DELETE FROM Folders
WHERE email='e0968871@u.nus.edu' AND module_code IN ('CS1010S', 'CLC3303');










/*
	10. Recommending CHS modules to take to fulfil CHS requirements
    
*/
WITH ct1 AS (
	SELECT 
		*
	FROM Folders 
	WHERE email='e0968871@u.nus.edu'
	ORDER BY folder_name -- rmb to remove this for faster query
), ct2 AS (
	SELECT
		pillar,
		COUNT(*) AS chs_modules_completed
	FROM ct1
	RIGHT JOIN CHSRequirements AS CHS
	USING (module_code)
	WHERE email='e0968871@u.nus.edu'
	GROUP BY (pillar)
)
SELECT 
	CHS.pillar,
    CHS.module_code
    
    /* use the following see how I used the logic to filter the modules appropriately
    -- ct2.modules_completed
    -- ct1.module_code AS completed_module 
    */
FROM CHSRequirements AS CHS
LEFT JOIN ct2
USING(pillar)
LEFT JOIN ct1 
USING(module_code)
WHERE 
	(chs_modules_completed IS NULL AND NOT (LEFT(module_code, 7)='GEN2002' OR LEFT(module_code, 7) BETWEEN 'GEN2050' AND 'GEN2071')) OR
    (pillar='ID' AND (chs_modules_completed < 2)) OR
    (
		(LEFT(module_code, 7)='GEN2002' OR LEFT(module_code, 7) BETWEEN 'GEN2050' AND 'GEN2071') AND
		chs_modules_completed = 1 AND ct1.module_code IS NOT NULL
	)    
;






/* 
	11. Additional supporting query to test query (10, 12)

*/
INSERT INTO Folders
VALUES ('e0968871@u.nus.edu', 8, 'GEN2060X');







/*
	12. Returns distinct pilars to fulfil
    
*/
WITH ct1 AS (
	SELECT 
		*
	FROM Folders 
	WHERE email='e0968871@u.nus.edu'
	ORDER BY folder_name -- rmb to remove this for faster query
), ct2 AS (
	SELECT
		pillar,
		COUNT(*) AS chs_modules_completed
	FROM ct1
	RIGHT JOIN CHSRequirements AS CHS
	USING (module_code)
	WHERE email='e0968871@u.nus.edu'
	GROUP BY (pillar)
)
SELECT DISTINCT
	CHS.pillar
    /* use the following see how I used the logic to filter the modules appropriately
    -- ct2.modules_completed
    -- ct1.module_code AS completed_module 
    */
FROM CHSRequirements AS CHS
LEFT JOIN ct2
USING(pillar)
LEFT JOIN ct1 
USING(module_code)
WHERE 
	(chs_modules_completed IS NULL AND NOT (LEFT(module_code, 7)='GEN2002' OR LEFT(module_code, 7) BETWEEN 'GEN2050' AND 'GEN2071')) OR
    (pillar='ID' AND (chs_modules_completed < 2)) OR
    (
		(LEFT(module_code, 7)='GEN2002' OR LEFT(module_code, 7) BETWEEN 'GEN2050' AND 'GEN2071') AND
		chs_modules_completed = 1 AND ct1.module_code IS NOT NULL
	)
;