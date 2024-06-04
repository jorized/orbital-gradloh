-- CREATE TABLES --

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
    enrolment_year VARCHAR(7),
    primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor  VARCHAR(45),
    second_minor  VARCHAR(45),
    home_faculty VARCHAR(45),
    role ENUM("USER", "ADMIN"),
    
    PRIMARY KEY (email)
);
