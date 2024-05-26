CREATE TABLE Modules ( 
    module_code VARCHAR(7) NOT NULL,
    module_name VARCHAR(45) UNIQUE NOT NULL,
    faculty VARCHAR(45) NOT NULL,
    module_description TEXT, 
    completition_status BOOLEAN NOT NULL,
	
	PRIMARY KEY (module_code)
);

CREATE TABLE Folders (
	folder_id VARCHAR(255),
    folder_name VARCHAR(10) NOT NULL, 
	module_code VARCHAR(7) NOT NULL,
    
    PRIMARY KEY (folder_id),
    FOREIGN KEY (module_code) REFERENCES Modules(module_code)
);

CREATE TABLE Combinations (
	primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor VARCHAR(45),
    second_minor VARCHAR(45),
    module_code VARCHAR(7) NOT NULL,
    
    PRIMARY KEY (primary_major, secondary_major, first_minor, second_minor),
    FOREIGN KEY (module_code) REFERENCES Modules(module_code)
);


CREATE TABLE Users (
	email VARCHAR(255),
    folder_id VARCHAR(255),
    nickname VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
	refresh_token VARCHAR(255),
    reset_otp VARCHAR(255),
    reset_otp_exp BIGINT,
    enrolment_year VARCHAR(7),
    primary_major VARCHAR(45) NOT NULL,
    secondary_major VARCHAR(45),
    first_minor  VARCHAR(45),
    second_minor  VARCHAR(45),
    home_faculty VARCHAR(45),
    
    PRIMARY KEY (email),
    FOREIGN KEY (folder_id) REFERENCES Folders(folder_id),
	FOREIGN KEY (primary_major, secondary_major, first_minor, second_minor)
		REFERENCES Combinations(primary_major, secondary_major, first_minor, second_minor)
);
