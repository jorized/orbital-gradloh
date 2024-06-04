-- INSERTING DATA --

-- Inserting dummy values into primary major requirements
INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Data Science and Analytics", "Core", "CS1010S");

INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Data Science and Analytics", "Core", "CS2030");

INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Data Science and Analytics", "Core", "CS2040");

INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Information Systems", "Core", "CS1010J");

INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Information Systems", "Core", "CS2030");

INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES ("Information Systems", "Core", "CS2040");

INSERT INTO primarymajorrequirements 
VALUES("Information Systems", "GE", "HSH1000");

-- Inserting values into first minor
INSERT INTO firstminorrequirements
VALUES 
	("Data Science and Analytics", "CS1010S"),
     ("Data Science and Analytics", "CS2040");

-- Inserting dummy values into folders table
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("e0968871", "Y1S1", "CS2040", TRUE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("e0968871", "Y1S1", "CS2030", TRUE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("e0968871", "Y1S1", "CS1010S", TRUE);

INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX81", "Y1S1", "CS1010J", TRUE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX81", "Y1S1", "CS2040", TRUE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX81", "Y1S1", "CS2030", TRUE);

INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX91", "Y1S1", "CS1010J", TRUE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX91", "Y1S1", "CS2040", FALSE);
INSERT INTO folders (email, folder_name, module_code, completion_status)
VALUES ("eXXXXX91", "Y1S1", "CS2030", TRUE);
INSERT INTO folders
VALUES ('eXXXXX91', 'Y1S2', 'HSH1000', TRUE);


-- Inserting dummy users
INSERT INTO users 
VALUES ("e0968871", 
		"Y1S1", 
        "chris", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "AY22/23",
        "Data Science and Analytics",
        "Computer Science",
        NULL,
        NULL,
        "Science",
        "USER");
        
INSERT INTO Users 
VALUES ("eXXXXX81", 
		"Y1S1", 
        "jordan", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "AY23/24",
        "Information Systems",
        "Business",
        NULL,
        NULL,
        "Computing",
        "USER");
        

INSERT INTO Users 
VALUES ("eXXXXX91", 
		"Y1S1", 
        "john", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "AY23/24",
        "Information Systems",
        NULL,
        "Data Science and Analytics",
        NULL,
        "Computing",
        "USER");

INSERT INTO combinations (primary_major)
VALUES ("Data Science and Analytics");

INSERT INTO combinations (primary_major)
VALUES ("Information Systems");

INSERT INTO combinations (primary_major, first_minor)
VALUES ("Information Systems", "Data Science and Analytics");