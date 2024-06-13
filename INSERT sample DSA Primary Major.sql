/* 
editor note: include even digit users. ALSO to ask Jordan: can we get the user's matriculation number? Starting with A....
rationale: there are specific modules pre-allocated to DSA students given their matric number. We can code these conditions out and make the experience more streamline to the requirements of the school 
current limitations: this is done for enrolment year > 2021-2022

*/

SELECT * FROM SingleMajorSamplePlan; -- A0257899X


/* 
	Inserting plan for odd users (example A0.....9X) 
*/
INSERT INTO SingleMajorSamplePlan
VALUES 
	-- Y1S1
	("Data Science and Analytics", 1, "MA2001", "odd"),
    ("Data Science and Analytics", 1, "MA2002", "odd"),
    ("Data Science and Analytics", 1, "HSH1000", "odd"),
    ("Data Science and Analytics", 1, "HSI1000", "odd"),
	("Data Science and Analytics", 1, "CS1010S", "odd"),
    
    -- Y1S2 
    ("Data Science and Analytics", 2, "ST2131", "odd"),
    ("Data Science and Analytics", 2, "DSA1101", "odd"),
	("Data Science and Analytics", 2, "HSS1000", "odd"),
	("Data Science and Analytics", 2, "HSA1000", "odd"),
	("Data Science and Analytics", 2, "DTK1234", "odd"),
    
    -- Y2S1
    ("Data Science and Analytics", 3, "ST2132", "odd"),
    ("Data Science and Analytics", 3, "DSA2101", "odd"),
	("Data Science and Analytics", 3, "MA2311", "odd"),
	("Data Science and Analytics", 3, "SP1541", "odd"),
	("Data Science and Analytics", 3, "HSI2009", "odd"),
    
    -- Y2S2
    ("Data Science and Analytics", 4, "CS2040", "odd"),
    ("Data Science and Analytics", 4, "DSA2102", "odd"),
	("Data Science and Analytics", 4, "ST3131", "odd"),
	("Data Science and Analytics", 4, "CLC3303", "odd"),
	("Data Science and Analytics", 4, "HS1501", "odd"),
    
    -- Y3S1
    ("Data Science and Analytics", 5, "CS3244", "odd"),
    ("Data Science and Analytics", 5, "DSA3101", "odd"),
	("Data Science and Analytics", 5, "HS2904", "odd"),
    
    -- Y3S2
    ("Data Science and Analytics", 6, "DSA3102", "odd"),
	("Data Science and Analytics", 6, "DSA3312", "odd"),
    ("Data Science and Analytics", 6, "HS2914", "odd"),
        
    -- Y4S1
     ("Data Science and Analytics", 7, "DSA4212", "odd"),
     
	-- Y4S2
     ("Data Science and Analytics", 8, "DSA4263", "odd");     


/* 
	Query to remove existing folders created by users (if any) and inserting our sample plan into their folders
	Total queries: 1 Delete query + 1 Insert query
*/
DELETE FROM Folders
WHERE email='e0968871@u.nus.edu';
INSERT INTO Folders (email, folder_name, module_code)
SELECT
	u.email,
    s.folder_name,
    s.module_code
FROM users AS u
INNER JOIN SingleMajorSamplePlan AS s
USING(primary_major)
WHERE u.email='e0968871@u.nus.edu' AND
	CAST(SUBSTRING(email FROM (POSITION('@' IN email) - 1) FOR 1) AS UNSIGNED) % 2=1; -- THIS logic is temporary, if we can get user's matriculation number, we will proceed to use that. Alternatively, check if our front end can prompt users to simply indicate if the last digit of their matriculation number is odd or even, then load the respective sample plans



-- Query to check that sample plan has been populated for the specified user
SELECT * FROM Folders
WHERE email='e0968871@u.nus.edu'
ORDER BY folder_name, module_code;