-- QUERIES -- 

/* Query to obtain user-selected modules based on their requirements, 
module type, module credits, completition status. USE FOR HOMESCREEN */
SELECT
	u.email,
    f.folder_name,
    p.module_type,
    f.module_code,
    f.completion_status
FROM users as u
INNER JOIN folders as f
USING (email)
INNER JOIN primarymajorrequirements as p
USING (primary_major, module_code)
WHERE email = 'eXXXXX91';

-- Total number of modules to graduate specific to user
WITH ct1 AS ( 
SELECT email, p.*
FROM users as u
INNER JOIN primarymajorrequirements as p
USING(primary_major)
WHERE email = 'eXXXXX91'
)
SELECT module_type, COUNT(*) AS total
FROM ct1
GROUP BY module_type;

/* Query to obtain total core and ge modules completed based on user-selected modules in their folders and their discipline*/
WITH ct2 AS (
SELECT 
	u.email, 
    f.folder_name, 
    p.module_type,
    f.module_code,
    f.completion_status
FROM users as u
INNER JOIN folders as f
USING (email)
INNER JOIN primarymajorrequirements as p
USING (primary_major, module_code) 
WHERE email = 'eXXXXX91'
)
SELECT module_type, SUM(completion_status) AS total
FROM ct2
GROUP BY module_type;

-- Select queries for quick views
SELECT * FROM folders;
SELECT * FROM combinations;
SELECT * FROM users;
SELECT * FROM primarymajorrequirements;
SELECT * FROM firstminorrequirements;
