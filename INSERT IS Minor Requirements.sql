/*
Information Systems Minor
No of mods: 5

First insert query for MA, QF and ST majors, all engineering majors in CDE, all SoC majors 
Second insert query for all other non quantitative/technical majors
*/

-- Inserting only mods 
INSERT IGNORE INTO firstminorrequirements (first_minor, module_code)
VALUES 
	-- CS1010J (or variants)
    ("Information Systems", "CS1010J"),
    ("Information Systems", "CS1010"),
    ("Information Systems", "CS1010E"),
    ("Information Systems", "CS1010S"),
    ("Information Systems", "CS1010X"),
    
    -- Non-negotiable modules
    ("Information Systems", "CS2030"),
    ("Information Systems", "IS1108"),
    
    -- Elective courses (2 mods)
    ("Information Systems", "IS2102"),
    ("Information Systems", "IS2103"),
    ("Information Systems", "IS3103"),
    ("Information Systems", "IS3106"),
    ("Information Systems", "IS3150"),
    ("Information Systems", "IS3240"),
    ("Information Systems", "IS3251"),
    ("Information Systems", "IS4241"),
    ("Information Systems", "IS4234"),
    ("Information Systems", "IS4243"),
    ("Information Systems", "IS4261");
    


SELECT * FROM folders
WHERE email='e0968871';

SELECT
	COUNT(*) AS number_of_modules_completed
FROM folders
WHERE 
	completion_status=1 AND 
    email='e0968871'
    
SELECT * FROM users