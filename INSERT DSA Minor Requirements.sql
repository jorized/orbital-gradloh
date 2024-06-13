/*
Data Science and Analytics Minor
No of mods: 5

First insert query for MA, QF and ST majors, all engineering majors in CDE, all SoC majors 
Second insert query for all other non quantitative/technical majors
*/

-- Inserting only mods (Quantitative and technical majors)
INSERT INTO FirstMinorRequirements (first_minor, module_type, module_code)
VALUES 
    ("Data Science and Analytics", "Technical", "DSA1101"),
    ("Data Science and Analytics", "Technical", "MA1522"),
    ("Data Science and Analytics", "Technical", "DSA2101"),
	("Data Science and Analytics", "Technical","DSA3361"),
	("Data Science and Analytics", "Technical", "DSA3362");

-- Inserting only mods (All other majors)
INSERT INTO FirstMinorRequirements (first_minor, module_type, module_code) 
VALUES 
    ("Data Science and Analytics", "Non-Technical", "DSA1101"),
    ("Data Science and Analytics", "Non-Technical", "MA2401"),
    ("Data Science and Analytics", "Non-Technical", "DSA2101"),
	("Data Science and Analytics", "Non-Technical", "DSA3361"),
	("Data Science and Analytics", "Non-Technical", "DSA3362");
    
-- Retrieving Percentage completion for DSA minor
-- Specific code to DSA minor since there are 2 groups of students with different
-- baskets of modules
WITH ct1 AS (
	SELECT 
		"Minor" AS module_type,
		COUNT(*) AS modules_completed
	FROM folders AS f
	LEFT JOIN users AS u
	USING(email)
	LEFT JOIN FirstMinorRequirements AS fminor
	USING(first_minor, module_code) -- ON (u.first_minor=fminor.first_minor AND f.module_code=fminor.module_code)
	WHERE 
		u.first_minor="Data Science and Analytics" AND
		fminor.module_type= 
			CASE WHEN u.home_faculty IN ('SOC', 'CDE') THEN 'Technical'
				ELSE 'Non-Technical' END
), ct2 AS (
	SELECT 
		'Minor'  AS module_type,
		COUNT(*) AS modules_required
	FROM users AS u 
    INNER JOIN FirstMinorRequirements AS fminor
    USING(first_minor)
    WHERE u.first_minor="Data Science and Analytics" AND
		fminor.module_type= 
			CASE WHEN u.home_faculty IN ('SOC', 'CDE') THEN 'Technical'
				ELSE 'Non-Technical' END
)
SELECT
	ROUND(modules_completed / modules_required * 100, 0) AS percentage_completed
FROM ct1 
LEFT JOIN ct2 
USING(module_type)