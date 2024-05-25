CREATE TABLE Modules ( 
	module_id MEDIUMINT UNSIGNED,
    module_code VARCHAR(7) UNIQUE NOT NULL,
    module_name VARCHAR(45) UNIQUE NOT NULL,
    module_description TEXT, 
    completition_status BOOLEAN,

	PRIMARY KEY (module_id)
);

CREATE TABLE Faculty (
	faculty_id TINYINT UNSIGNED,
	faculty_name VARCHAR(45) UNIQUE NOT NULL,
    
    PRIMARY KEY (faculty_id)
);

CREATE TABLE Folders (
	folder_id VARCHAR(255),
    folder_name VARCHAR(10) NOT NULL, 
    module_id MEDIUMINT UNSIGNED,
    
    PRIMARY KEY (folder_id),
    FOREIGN KEY (module_id) REFERENCES Modules(module_id)
);

CREATE TABLE Majors (
	major_id TINYINT UNSIGNED,
    major_name VARCHAR(45) NOT NULL,
    faculty_id TINYINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (major_id),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE Minors (
	minor_id TINYINT UNSIGNED,
    minor_name VARCHAR(45) NOT NULL,
    faculty_id TINYINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (minor_id),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE Users (
	user_id MEDIUMINT UNSIGNED AUTO_INCREMENT,
    email VARCHAR(45) NOT NULL,
    nickname VARCHAR(45),
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    reset_otp VARCHAR(255),
    reset_otp_exp BIGINT,
    role ENUM('USERS', 'ADMINS') NOT NULL,
	folder_id VARCHAR(255),
    primary_major_id TINYINT UNSIGNED NOT NULL,
    secondary_major_id TINYINT UNSIGNED,
    first_minor_id TINYINT UNSIGNED ,
    second_minor_id TINYINT UNSIGNED,
    
    PRIMARY KEY (user_id),
    FOREIGN KEY (folder_id) REFERENCES Folders(folder_id),
	FOREIGN KEY (primary_major_id) REFERENCES Majors(major_id),
    FOREIGN KEY (secondary_major_id) REFERENCES Majors(major_id),
    FOREIGN KEY (first_minor_id) REFERENCES Minors(minor_id),
    FOREIGN KEY (second_minor_id) REFERENCES Minors(minor_id)
);

CREATE ROLE 'app_developer';
GRANT ALL ON orbital_backend.* TO 'app_developer';

