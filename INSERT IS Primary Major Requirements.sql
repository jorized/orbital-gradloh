/*
Information Systems Primary Major
No of CORE mods: 
No of CC mods: 12
*/

-- Inserting only core mods (including core modules) 
INSERT IGNORE INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES 
    ("Information Systems", "Core", "BT2102"),
    ("Information Systems", "Core", "CS2030"),
    ("Information Systems", "Core", "CS2040"),
    ("Information Systems", "Core", "IS2101"),
    ("Information Systems", "Core", "IS2102"),
    ("Information Systems", "Core", "IS2103"),
	("Information Systems", "Core", "IS3103"),
    ("Information Systems", "Core", "IS3106"),
    ("Information Systems", "Core", "CP4101"),
    ("Information Systems", "Core", "IS4103"),
    ("Information Systems", "Core", "MA1521"),
	("Information Systems", "Core", "ST2334"),
    
    -- students need another 5 modules to graduate, either specialize or randomly take 5 mods across specialisations
    -- need at least 3 modules equal level 4000
 	("Information Systems", "Spec_Finance", "IS3107"),
 	("Information Systems", "Spec_Finance", "IS4226"),
 	("Information Systems", "Spec_Finance", "IS4228"),
 	("Information Systems", "Spec_Finance", "IS4302"),
 	("Information Systems", "Spec_Finance", "IS4303");
    
    
-- Inserting CC mods (GE included in CC)
INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES 
    -- GEN pillar
	("Information Systems", "CC", "CLC2204"),
    -- Cultures and Connections pillar
    ("Information Systems", "CC", "HSA1000"),
    -- Critique and Expression pillar
    ("Information Systems", "CC", "ES2361"), 
    -- Data Pillar
    ("Information Systems", "CC", "BT1101"),
    -- Digital literacy Pillar
    ("Information Systems", "CC", "CS1010J"),
    -- Singapore Studies Pillar
    ("Information Systems", "CC", "GESS1005"),
    
    -- Computing Ethics
    ("Information Systems", "CC", "ES1108"),
    
    -- Inter/Cross disciplinary courses (At least 2 ID, no more than 1 CD)
    -- ID1
    ("Information Systems", "CC", "IS1128"),
    -- ID2
    ("Information Systems", "CC", "IS2218"),
    -- CD1
    ("Information Systems", "CC", "ACC1701X");
    
-- USE THIS: Query to check number of core mods needed to complete IS primary major
SELECT 
	COUNT(*) AS num_of_module
FROM primarymajorrequirements
WHERE primary_major='Information Systems' AND
	(module_type='Core' OR LEFT(module_type, 4)='Spec')
GROUP BY primary_major;

-- USE THIS: Query to check number of core mods needed to complete IS primary major
SELECT 
	COUNT(*) AS num_of_module
FROM primarymajorrequirements
WHERE primary_major='Information Systems' AND
	(module_type='Core' OR LEFT(module_type, 4)='Spec')
GROUP BY primary_major;

-- USE THIS: Query to count the number of CC modules needed to graduate.
SELECT 
	COUNT(*) AS num_of_module
FROM primarymajorrequirements
WHERE primary_major='Information Systems' AND
	module_type='CC'
GROUP BY primary_major;

-- Query to get total number of UEs required
-- remark: do not use this as we plan to do simple math on the backend
WITH 
	ct_coremod AS (
	SELECT 
		COUNT(*) AS num_of_module
	FROM primarymajorrequirements
	WHERE primary_major='Information Systems' AND
		(module_type='Core' OR LEFT(module_type, 4)='Spec')
	GROUP BY primary_major
	),
	ct_cc AS (
	SELECT 
		COUNT(*) AS num_of_module
	FROM primarymajorrequirements
	WHERE primary_major='Information Systems' AND
		module_type='CC'
	GROUP BY primary_major
	)

SELECT 
	40 - SUM(num_of_module) AS num_of_UE 
FROM (
	SELECT ct1.num_of_module
	FROM ct_cc as ct1
	UNION
	SELECT ct2.num_of_module
	FROM ct_coremod as ct2
) AS combined_ct;


SELECT * FROM folders
SELECT email FROM users;
SELECT * FROM primarymajorrequirements;

SELECT 
	u.email, 
    f.*
FROM Users AS u
INNER JOIN Folders AS f
USING(email)

SELECT 
	p.module_type,
    f.*,
    p.*
	-- COUNT(f.module_code) / COUNT(p.module_code) * 100 AS modules_completed
FROM Users AS u
INNER JOIN Folders AS f
USING(email)
RIGHT JOIN PrimaryMajorRequirements as p
USING(primary_major, module_code)
WHERE email='eXXXXX91@u.nus.edu' /*AND
	p.module_type='Core';*/
-- GROUP BY (p.module_type)

-- Query to obtain percentage of core mods, cc mods and UEs completed for user's.
WITH ct1 AS (
	SELECT 
		p.module_type,
		COUNT(*) AS mods_completed
	FROM PrimaryMajorRequirements as p
	LEFT JOIN folders AS f
	USING (module_code)
    LEFT JOIN users AS u
    USING (email)
	WHERE u.primary_major=p.primary_major AND 
		email='eXXXXX91@u.nus.edu'
	GROUP BY p.module_type
),
ct2 AS (
	SELECT 
		module_type,
		COUNT(*) AS mods_required
	FROM 
		(SELECT 
			primary_major,
			CASE WHEN LEFT(module_type, 4)='Spec' THEN 'Core'
				ELSE module_type END AS module_type,
			module_code
		FROM PrimaryMajorRequirements AS p
        INNER JOIN users AS u
        USING(primary_major)
		WHERE u.primary_major=p.primary_major AND
			email='eXXXXX91@u.nus.edu') AS edited
	GROUP BY module_type
)
SELECT
	module_type,
    ROUND(ct1.mods_completed / mods_required * 100, 0) AS percentage_completed
FROM ct2
LEFT JOIN ct1
USING (module_type);

SELECT 
	email,
	enrolment_year 
FROM users;



SELECT 
	DATE_FORMAT(CURRENT_DATE(), "%m%y"),-- (LEFT(u.enrolment_year, 4), UNSIGNED),  
    f.*
FROM folders AS f
INNER JOIN users AS u
USING(email)
WHERE email='eXXXXX91@u.nus.edu'
	folder_name = 
		CASE WHEN 
ORDER BY folder_name;