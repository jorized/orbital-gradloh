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
DELIMITER $$
CREATE PROCEDURE get_core_modules_overview(email_input VARCHAR(45))
BEGIN
	WITH ct1 AS (
		SELECT 
			u.primary_major,
			f.*
		FROM Users AS u
		INNER JOIN Folders AS f
		USING(email)
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	)
	SELECT
		ct1.folder_name,
		p.module_type,
		p.module_code    
	FROM PrimaryMajorRequirements AS p
	INNER JOIN ct1
	USING (primary_major, module_code)
	WHERE email=email_input
	ORDER BY folder_name;
END $$
DELIMITER ;

CALL get_core_modules_overview('e0968871@u.nus.edu');







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
DELIMITER $$
CREATE PROCEDURE get_core_modules_summary(email_input VARCHAR(45))
BEGIN
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
END $$

DELIMITER ;
CALL get_core_modules_summary('e0968871@u.nus.edu');







/*
	3. Query to return total core mods completed and total core mods required for different choices of DSA student. Namely, students who choose option A (16 mods) and option B (14 mods)

*/

DELIMITER $$

CREATE PROCEDURE get_core_modules_count(email_input VARCHAR(45))
BEGIN
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
			WHERE email=email_input
			ORDER BY folder_name -- rmb to remove this for faster query
		) AS ct1
		USING (primary_major, module_code)
		WHERE email=email_input
		GROUP BY module_type
	)
	SELECT 
		SUM(completed) AS total_modules_completed,
		CASE WHEN EXISTS (SELECT 1 FROM  ct2 WHERE module_type='Core_4B') THEN 14
			ELSE 16 END AS total_modules_required
	FROM ct2;
END $$
DELIMITER ;

CALL get_core_modules_count('e0968871@u.nus.edu');





/*
	4. Query to recommend Core DSA Modules that need to be completed by student in order to graduate
    Dynamically changes list of modules to recommend for Option A and Option B as user adds modules
*/
DELIMITER $$

CREATE PROCEDURE get_core_modules_suggestion(email_input VARCHAR(45))
BEGIN
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
		WHERE email=email_input
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
END $$

CALL get_core_modules_suggestion('e0968871@u.nus.edu')








/*
	5. supporting query for query (4, 6)
*/

DELIMITER $$
CREATE PROCEDURE remove_1_foldermodule(email_input VARCHAR(45), module1 VARCHAR(8))
BEGIN
	DELETE FROM folders
	WHERE email=email_input AND module_code=module1;
END $$
DELIMITER ;




DELIMITER $$
CREATE PROCEDURE remove_2_foldermodule(email_input VARCHAR(45), module1 VARCHAR(8), module2 VARCHAR(8))
BEGIN
	DELETE FROM folders
	WHERE email=email_input AND module_code IN (module1, module2);
END $$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE remove_3_foldermodule(email_input VARCHAR(45), module1 VARCHAR(8), module2 VARCHAR(8), module3 VARCHAR(8))
BEGIN
	DELETE FROM folders
	WHERE email=email_input AND module_code IN (module1, module2, module3);
END $$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE remove_4_foldermodule(email_input VARCHAR(45), module1 VARCHAR(8), module2 VARCHAR(8), module3 VARCHAR(8), module4 VARCHAR(8))
BEGIN
	DELETE FROM folders
	WHERE email=email_input AND module_code IN (module1, module2, module3, module4);
END $$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE remove_5_foldermodule(email_input VARCHAR(45), module1 VARCHAR(8), module2 VARCHAR(8), module3 VARCHAR(8), module4 VARCHAR(8), module5 VARCHAR(8))
BEGIN
	DELETE FROM folders
	WHERE email=email_input AND module_code IN (module1, module2, module3, module4, module5);
END $$

DELIMITER ;

CALL remove_1_foldermodule('e0968871@u.nus.edu', 'ST2131');
CALL remove_2_foldermodule('e0968871@u.nus.edu', 'ST2131', 'DSA4212');
CALL remove_3_foldermodule('e0968871@u.nus.edu', 'ST2131', 'DSA4212', 'HSI1000');
CALL remove_4_foldermodule('e0968871@u.nus.edu', 'ST2131', 'DSA4212', 'HSI1000', 'DSA3101');
CALL remove_5_foldermodule('e0968871@u.nus.edu', 'ST2131', 'DSA4212', 'HSI1000', 'DSA3101', 'DSA1101');




/*
	6. Query to return module types that user has yet to complete    

*/
DELIMITER $$
CREATE PROCEDURE get_DSA_module_types_not_completed(email_input VARCHAR(45))
BEGIN
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
		WHERE email=email_input
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
END $$
DELIMITER ;

CALL get_DSA_module_types_not_completed('e0968871@u.nus.edu');






/*
	7. Query to get number of CHS modules_completed with corresponding pillars 
		Need to complete 12 distinct rows 
        
*/

DELIMITER $$
CREATE PROCEDURE get_CHS_module_completed_overview(email_input VARCHAR(45))
BEGIN
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
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	) AS ct1
	RIGHT JOIN CHSRequirements AS CHS
	USING (module_code)
	WHERE email=email_input
	GROUP BY (pillar);
END $$
DELIMITER ;

CALL get_CHS_module_completed_overview('e0968871@u.nus.edu');






/*
	8. Query to get total CHS mods completed vs total CHS mods required

*/
DELIMITER $$
CREATE PROCEDURE get_CHS_module_required(email_input VARCHAR(45))
BEGIN
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
			WHERE email=email_input
			ORDER BY folder_name -- rmb to remove this for faster query
		) AS ct1
		INNER JOIN CHSRequirements AS CHS
		USING (module_code)
		WHERE email=email_input
		GROUP BY (pillar)
	)
	SELECT
		SUM(chs_modules_completed) AS total_completed,
		13 AS total_required
	FROM ct2;
END $$
DELIMITER ;


CALL get_CHS_module_required('e0968871@u.nus.edu');







/* 
	9. Supporting query to test query (8) and (10)
*/
CALL remove_2_foldermodule('e0968871@u.nus.edu', 'CS1010S', 'CLC3303')








/*
	10. Recommending CHS modules to take to fulfil CHS requirements
    
*/
DELIMITER $$
CREATE PROCEDURE get_CHS_module_suggestion(email_input VARCHAR(45))
BEGIN
	WITH ct1 AS (
		SELECT 
			*
		FROM Folders 
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	), ct2 AS (
		SELECT
			pillar,
			COUNT(*) AS chs_modules_completed
		FROM ct1
		RIGHT JOIN CHSRequirements AS CHS
		USING (module_code)
		WHERE email=email_input
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
END $$
DELIMITER ;

CALL get_CHS_module_suggestion('e0968871@u.nus.edu');





/* 
	11. Additional supporting query to test query (10, 12)

*/
DELIMITER $$
CREATE PROCEDURE insert_1_foldermodule(email_input VARCHAR(45), folder_name_input TINYINT, module1 VARCHAR(8))
BEGIN
	INSERT INTO Folders
	VALUES (email_input, folder_name_input, module1);
	
    SELECT * 
    FROM Folders
    WHERE email=email_input;
END $$

CALL insert_1_foldermodule('e0968871@u.nus.edu', 8, 'GEN2060X');

-- calling this after choosing 1x year long gen mod should recommend choosing the other gen mod 
CALL get_CHS_module_suggestion('e0968871@u.nus.edu');





/*
	12. Returns distinct pilars to fulfil
    
*/
DELIMITER $$
CREATE PROCEDURE get_CHS_pillar_not_completed(email_input VARCHAR(45))
BEGIN
	WITH ct1 AS (
		SELECT 
			*
		FROM Folders 
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	), ct2 AS (
		SELECT
			pillar,
			COUNT(*) AS chs_modules_completed
		FROM ct1
		RIGHT JOIN CHSRequirements AS CHS
		USING (module_code)
		WHERE email=email_input
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
END $$
DELIMITER ;

CALL get_CHS_pillar_not_completed('e0968871@u.nus.edu');

-- -------------------------------------------------------------------------------------------------------------------------


/*

FOR DSA-IS MINOR COMBINATION

1. Query to get overview of CORE and MINOR modules_completed with module type (DONE)
For DSA primary majors, check which modules chosen in folders have fulfilled 
		- primary major requirements
        - IS minor requirements
*/
DELIMITER $$
CREATE PROCEDURE get_majmin_overview(email_input VARCHAR(45))
BEGIN
	WITH ct1 AS (
		SELECT 
			u.primary_major,
			u.first_minor,
			f.*
		FROM Users AS u
		INNER JOIN Folders AS f
		USING(email)
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	)
	SELECT
		ct1.folder_name,
		/*
		p.module_type,
		p.module_code,
		*/
		CASE WHEN (p.module_type IS NULL AND fm.first_minor IS NOT NULL) THEN CONCAT('minor_', first_minor)
			WHEN p.module_type IS NOT NULL THEN p.module_type END AS final_module_type,
		CASE WHEN (p.module_code IS NULL AND fm.module_code IS NOT NULL) THEN fm.module_code
			WHEN p.module_code IS NOT NULL THEN p.module_code END AS final_module_code
	FROM ct1 
	LEFT JOIN PrimaryMajorRequirements AS p 
	USING (primary_major, module_code)
	LEFT JOIN FirstMinorRequirements AS fm
	USING (first_minor, module_code)
	WHERE email=email_input
	HAVING(final_module_type IS NOT NULL AND final_module_code IS NOT NULL)
	ORDER BY folder_name;
END $$
DELIMITER ;

CALL get_majmin_overview('e0968871@u.nus.edu')



/* 

FOR DSA-IS MINOR COMBINATION


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
    
    for Information Systems minor
    minor_Information Systems = MUST BE 5

    possible successful combinations
    1. Core(11), Intern(1), Core_4A1(1), Core_4A2(1), Core_$(1), Core_*(1), minor_IS(5)
    2. Core(11), Core_4B(1), Core_$(1), Core_*(1), minor_IS(5)
    3. 1 or 2 with Spec_XXX
*/
DELIMITER $$
CREATE PROCEDURE get_majmin_count(email_input VARCHAR(45))
BEGIN
	WITH ct1 AS (
		SELECT 
			u.primary_major,
			u.first_minor,
			f.*
		FROM Users AS u
		INNER JOIN Folders AS f
		USING(email)
		WHERE email=email_input
		ORDER BY folder_name -- rmb to remove this for faster query
	), ct2 AS (
		SELECT
			ct1.folder_name,
			CASE WHEN (p.module_type IS NULL AND fm.first_minor IS NOT NULL) THEN CONCAT('minor_', first_minor)
				WHEN p.module_type IS NOT NULL THEN p.module_type END AS final_module_type,
			CASE WHEN (p.module_code IS NULL AND fm.module_code IS NOT NULL) THEN fm.module_code
				WHEN p.module_code IS NOT NULL THEN p.module_code END AS final_module_code
		FROM ct1 
		LEFT JOIN PrimaryMajorRequirements AS p 
		USING (primary_major, module_code)
		LEFT JOIN FirstMinorRequirements AS fm
		USING (first_minor, module_code)
		WHERE email=email_input
		HAVING(final_module_type IS NOT NULL AND final_module_code IS NOT NULL)
		ORDER BY folder_name
	)
	SELECT 
		final_module_type AS module_type,
		COUNT(*) AS total_completed  
	FROM ct2
	GROUP BY final_module_type;
END $$
DELIMITER ;
CALL get_majmin_count('e0968871@u.nus.edu')



/*
	27. Use query 3 to check core mods completed. 
    Use this to get first minor completion (Information Systems)
    
    Should be 5/5
*/
DELIMITER $$
CREATE PROCEDURE get_majmin_count(email_input VARCHAR(45))
BEGIN
	SELECT 
		CONCAT('Minor_', first_minor) AS module_type,
		COUNT(module_code) AS modules_completed,
		5 AS modules_required
	FROM Folders AS f 
	LEFT JOIN Users AS u 
	USING(email)
	LEFT JOIN FirstMinorRequirements AS fm
	USING(first_minor, module_code)
	WHERE email='e0968871@u.nus.edu' AND fm.module_code IS NOT NULL
	GROUP BY first_minor








WITH basic_information AS (
	SELECT 
		u.primary_major,
		u.first_minor,
		f.* 
	FROM Folders AS f
	LEFT JOIN Users AS u 
	USING (email)
	WHERE email='e0968871@u.nus.edu'
	ORDER BY folder_name
), primary_major AS (
	WITH ct2 AS (
		SELECT
			module_type,
			COUNT(*) AS completed
		FROM PrimaryMajorRequirements AS p
		INNER JOIN basic_information AS b
		USING (primary_major, module_code)
		WHERE email='e0968871@u.nus.edu'
		GROUP BY module_type
	)
	SELECT 
		'Major_DSA' AS module_type,
		SUM(completed) AS total_modules_completed,
		CASE WHEN EXISTS (SELECT 1 FROM  ct2 WHERE module_type='Core_4B') THEN 14
			ELSE 16 END AS total_modules_required
	FROM ct2
), minor AS (
	SELECT 
		CONCAT('Minor_', first_minor) AS module_type,
		COUNT(module_code) AS modules_completed,
		5 AS modules_required
	FROM Folders AS f 
	LEFT JOIN Users AS u 
	USING(email)
	LEFT JOIN FirstMinorRequirements AS fm
	USING(first_minor, module_code)
	WHERE email='e0968871@u.nus.edu' AND fm.module_code IS NOT NULL
	GROUP BY first_minor
)
SELECT * 
FROM minor
UNION SELECT * FROM primary_major

/* 
	overview of fulfilment type of module to
		- DSA
		- Information Systems Minor
        - CHS common curriculum
*/
SELECT 
	folder_name,
    CASE WHEN p.module_type IS NOT NULL THEN CONCAT('Major_', primary_major)
		WHEN p.module_type IS NULL AND fm.module_code IS NOT NULL THEN CONCAT('Minor_', first_minor)
        WHEN chs.pillar IS NOT NULL THEN CONCAT('CHS_', chs.pillar)
        WHEN p.module_type IS NULL AND fm.module_code IS NULL AND chs.pillar IS NULL THEN 'UE'
        END AS fulfilment_type,
	CASE WHEN p.module_code IS NOT NULL THEN p.module_code
		WHEN p.module_code IS NULL AND fm.module_code IS NOT NULL THEN fm.module_code
        WHEN chs.module_code IS NOT NULL THEN chs.module_code
        ELSE f.module_code END AS module_code
FROM Folders AS f
LEFT JOIN Users AS u
USING(email)
LEFT JOIN PrimaryMajorRequirements AS p
USING(primary_major, module_code)
LEFT JOIN FirstMinorRequirements AS fm
USING(first_minor, module_code)
LEFT JOIN CHSRequirements AS chs
USING(module_code)
WHERE email='e0968871@u.nus.edu'
ORDER BY folder_name

/*
	Test case for UEs
*/

INSERT INTO folders VALUES ('e0968871@u.nus.edu', 8, 'LAG1201')

WITH ct1 AS (
	SELECT 
		folder_name,
		CASE WHEN p.module_type IS NOT NULL THEN CONCAT('Major_', primary_major)
			WHEN p.module_type IS NULL AND fm.module_code IS NOT NULL THEN CONCAT('Minor_', first_minor)
			WHEN chs.pillar IS NOT NULL THEN CONCAT('CHS_', chs.pillar)
			WHEN p.module_type IS NULL AND fm.module_code IS NULL AND chs.pillar IS NULL THEN 'UE'
			END AS fulfilment_type,
		CASE WHEN p.module_code IS NOT NULL THEN p.module_code
			WHEN p.module_code IS NULL AND fm.module_code IS NOT NULL THEN fm.module_code
			WHEN chs.module_code IS NOT NULL THEN chs.module_code
			ELSE f.module_code END AS module_code
	FROM Folders AS f
	LEFT JOIN Users AS u
	USING(email)
	LEFT JOIN PrimaryMajorRequirements AS p
	USING(primary_major, module_code)
	LEFT JOIN FirstMinorRequirements AS fm
	USING(first_minor, module_code)
	LEFT JOIN CHSRequirements AS chs
	USING(module_code)
	WHERE email='e0968871@u.nus.edu'
	ORDER BY folder_name
) WITH UE AS (
	SELECT 
		COUNT(*) AS ues_completed
	FROM ct1 
	WHERE fulfilment_type='UE'
)
SELECT * FROM UE completed