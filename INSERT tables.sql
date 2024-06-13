-- INSERTING DATA --

-- Inserting dummy values into folders table
-- editor note: insert into 'e0968871@u.nus.edu' from 'INSERT sample DSA primary major'. Fixed spelling error for 'eXXXXX81@u.nus.edu'
INSERT INTO Folders
VALUES ("eXXXXX81@u.nus.edu", 1, "CS1010J");
INSERT INTO Folders
VALUES ("eXXXXX81@u.nus.edu", 1, "CS2040");
INSERT INTO Folders
VALUES ("eXXXXX81@u.nus.edu", 1, "CS2030");

INSERT INTO Folders
VALUES 
	('eXXXXX91@u.nus.edu', 1, "CS1010J"),
	('eXXXXX91@u.nus.edu', 1, "CS2040"),
	('eXXXXX91@u.nus.edu', 1, "CS2030"),
	('eXXXXX91@u.nus.edu', 2, 'HSH1000'),
	('eXXXXX91@u.nus.edu', 3, 'DSA1101'),
	("eXXXXX91@u.nus.edu", 7, "ST3131"),
    ("eXXXXX91@u.nus.edu", 5, "ST2131"),
    ("eXXXXX91@u.nus.edu", 6, "ST2132");

-- Inserting dummy users
INSERT INTO Users 
VALUES ("e0968871@u.nus.edu", 
		"Y1S1", 
        "chris", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "2022-2023",
        "Data Science and Analytics",
        NULL,
        "Information Systems",
        NULL,
        "FOS",
        "USER");
        
INSERT INTO Users 
VALUES ("eXXXXX81@u.nus.edu", 
		"Y1S1", 
        "jordan", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "2023-2024",
        "Information Systems",
        "Data Science and Analytics",
        NULL,
        NULL,
        "SOC",
        "USER");
        

INSERT INTO Users 
VALUES ("eXXXXX91@u.nus.edu", 
		"Y1S1", 
        "john", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "2023-2024",
        "Information Systems",
        NULL,
        "Data Science and Analytics",
        NULL,
        "SOC",
        "USER");

INSERT INTO Combinations (primary_major)
VALUES ("Data Science and Analytics");

INSERT INTO Combinations (primary_major)
VALUES ("Information Systems");

INSERT INTO Combinations (primary_major, first_minor)
VALUES ("Information Systems", "Data Science and Analytics");