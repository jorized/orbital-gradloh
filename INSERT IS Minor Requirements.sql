/*
Information Systems Minor
No of mods: 5

First insert query for MA, QF and ST majors, all engineering majors in CDE, all SoC majors 
Second insert query for all other non quantitative/technical majors
*/

-- Inserting only mods 
INSERT IGNORE INTO firstminorrequirements (first_minor, module_code)
VALUES 
    ("Information Systems", "CS1010J"),
    ("Information Systems", "CS2030"),
    ("Information Systems", "IS1108"),
    ("Information Systems", "IS2102"),
    ("Information Systems", "IS2103");


SELECT * FROM folders
WHERE email='e0968871';

SELECT
	COUNT(*) AS number_of_modules_completed
FROM folders
WHERE 
	completion_status=1 AND 
    email='e0968871'
    
SELECT * FROM users