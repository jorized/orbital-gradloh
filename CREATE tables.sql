-- CREATE TABLES -- (Added primary key for all tables to ensure integrity of tables)

-- Folders Table (changed folder_name to TINYINT for easier manipulation)
CREATE TABLE Folders (
	email VARCHAR(255) NOT NULL,
    folder_name TINYINT NOT NULL, 
	module_code VARCHAR(8) NOT NULL,
    
    -- all 3 required to be primary key since some mods are year long with the same module code
    PRIMARY KEY (email, folder_name, module_code) 
);

-- Primary Major Requirement Table
CREATE TABLE PrimaryMajorRequirements (
    primary_major VARCHAR(45),
    module_type VARCHAR(45),
    module_code VARCHAR(8),
    
    PRIMARY KEY (primary_major, module_code)
);

-- Secondary Major Requirements table
CREATE TABLE SecondaryMajorRequirements (
    secondary_major VARCHAR(45),
    module_type VARCHAR(20),
    module_code VARCHAR(8),
    
    PRIMARY KEY (secondary_major, module_code)
);

-- First Minor Requirements Table
CREATE TABLE FirstMinorRequirements (
    first_minor VARCHAR(45),
    module_code VARCHAR(8),
    
    PRIMARY KEY (first_minor, module_code)
);

-- Possible combinations of majors table (keep this table for autopopulating modules: Chris)
CREATE TABLE Combinations (
	primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor VARCHAR(45),
    second_minor VARCHAR(45)
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
    enrolment_year VARCHAR(9),
    primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor  VARCHAR(45),
    second_minor  VARCHAR(45),
    home_faculty VARCHAR(45),
    role ENUM("USER", "ADMIN"),
    
    PRIMARY KEY (email)
);

/*
-- Single Major Combination Sample Plans:
	This table contains sample plans for users who do not secondary major, nor any minors.
	
    editor note: removed module_type since that is unique to each major (eg. CS2030 is CORE for Info Sys but UE for DSA majors). If we want to obtain module_type, we perform a join with the user's primary major.
*/
CREATE TABLE SingleMajorSamplePlan ( 
	primary_major VARCHAR(45) NOT NULL,
    folder_name TINYINT NOT NULL,
    module_code VARCHAR(8) NOT NULL,
    major_condition VARCHAR(8),
    
    PRIMARY KEY (primary_major, folder_name, module_code)
);

CREATE TABLE CHSRequirements (
	pillar VARCHAR(45) NOT NULL,
    module_code VARCHAR(45) NOT NULL,
	
    PRIMARY KEY (pillar, module_code)
)
