-- Modules Table
CREATE TABLE Modules ( 
    module_code VARCHAR(7) NOT NULL,
    module_name VARCHAR(45) NOT NULL,
    faculty VARCHAR(45) NOT NULL,
    module_description TEXT, 
    module_credits TINYINT,
	
	PRIMARY KEY (module_code)
);

-- Folders Table
CREATE TABLE Folders (
	email VARCHAR(8) NOT NULL,
    folder_name ENUM("Y1S1", "Y1S2", "Y2S1", "Y2S2","Y3S1", "Y3S2", "Y4S1", "Y4S2") NOT NULL, 
	module_code VARCHAR(7) NOT NULL,
    completion_status BOOLEAN NOT NULL
);

-- Primary Major Requirement Table
CREATE TABLE PrimaryMajorRequirements (
    primary_major VARCHAR(45),
    module_type ENUM("Core", "GE"),
    module_code VARCHAR(7)
);

-- Secondary Major Requirements table
CREATE TABLE SecondaryMajorRequirements (
    secondary_major VARCHAR(45),
    module_code VARCHAR(7)
);

-- First Minor Requirements Table
CREATE TABLE FirstMinorRequirements (
    first_minor VARCHAR(45),
    module_code VARCHAR(7)

);

-- Second Minor Requirements Table
CREATE TABLE SecondMinorRequirements (
    second_minor VARCHAR(45),
    module_code VARCHAR(7)

);

-- Possible combinations of majors table
CREATE TABLE Combinations (
	primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor VARCHAR(45),
    second_minor VARCHAR(45),
    total_mcs_required VARCHAR(7) NOT NULL,
    
    PRIMARY KEY (primary_major, secondary_major, first_minor, second_minor)
);

-- User table
CREATE TABLE Users (
	email VARCHAR(255),
    folder_id VARCHAR(255),
    nickname VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
	refresh_token VARCHAR(255),
    reset_otp VARCHAR(255),
    reset_otp_exp BIGINT,
    completed_onboard BOOLEAN,
    completed_tutorial BOOLEAN,
    enrolment_year VARCHAR(7),
    primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor  VARCHAR(45),
    second_minor  VARCHAR(45),
    home_faculty VARCHAR(45),
    
    PRIMARY KEY (email),
	FOREIGN KEY (primary_major, secondary_major, first_minor, second_minor)
		REFERENCES Combinations(primary_major, secondary_major, first_minor, second_minor)
);

-- Inserting dummy values into modules
INSERT INTO modules (module_code, module_name, faculty, module_description, module_credits)
VALUES ("CS1010S", 
		"Programming Methodology", 
        "Computing",
        "This course introduces the fundamental concepts of problem solving by computing and programming using an imperative programming language. It is the first and foremost introductory course to computing. Topics covered include computational thinking and computational problem solving, designing and specifying an algorithm, basic problem formulation and problem solving approaches, program development, coding, testing and debugging, fundamental programming constructs (variables, types, expressions, assignments, functions, control structures, etc.), fundamental data structures (arrays, strings, composite data types), basic sorting, and recursion.", 
        4);
        
INSERT INTO modules (module_code, module_name, faculty, module_description, module_credits)
VALUES ("CS1010J", 
		"Programming Methodology", 
        "Computing",
        "This course introduces the fundamental concepts of problem solving by computing and programming using an imperative programming language. It is the first and foremost introductory course to computing. Topics covered include computational thinking and computational problem solving, designing and specifying an algorithm, basic problem formulation and problem solving approaches, program development, coding, testing and debugging, fundamental programming constructs (variables, types, expressions, assignments, functions, control structures, etc.), fundamental data structures (arrays, strings, composite data types), basic sorting, and recursion.", 
        4);
        
INSERT INTO modules (module_code, module_name, faculty, module_description, module_credits)
VALUES ("CS2040", 
		"Data Structures and Algorithms", 
        "Computing",
        "This course introduces students to the design and implementation of fundamental data structures and algorithms. The course covers basic data structures (linked lists, stacks, queues, hash tables, binary heaps, trees, and graphs), searching and sorting algorithms, and basic analysis of algorithms.", 
        4);
        
INSERT INTO modules (module_code, module_name, faculty, module_description, module_credits)
VALUES ("CS2030", 
		"Programming Methodology II", 
        "Computing",
        "This course is a follow up to CS1010. It explores two modern programming paradigms, object-oriented programming and functional programming. Through a series of integrated assignments, students will learn to develop medium-scale software programs in the order of thousands of lines of code and tens of classes using object oriented design principles and advanced programming constructs available in the two paradigms. Topics include objects and classes, composition, association, inheritance, interface, polymorphism, abstract classes, dynamic binding, lambda expression, effect-free programming, first class functions, closures, continuations, monad, etc.", 
        4);
        
        
        
        
        
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




-- Inserting dummy users
INSERT INTO Users 
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
        "Science");
        
INSERT INTO Users 
VALUES ("eXXXXX81", 
		"Y1S1", 
        "chris", 
        "password123", 
        "(jordan insert here)", 
        "(jordan insert here)", 
        12345,
        FALSE,
        FALSE,
        "AY23/24",
        "Information System",
        "Business",
        NULL,
        NULL,
        "Computing");



-- Select queries for quick views         
SELECT * FROM modules;

SELECT * FROM folders;

SELECT * FROM primarymajorrequirements;

SELECT * FROM users;

SELECT f.*, m.*
FROM users as u
INNER JOIN folders as f
USING(email)
INNER JOIN modules as m
USING (module_code)
WHERE email="e0968871";
