/*
	CHS requirements
	1 module per pillar
    Interdisciplinary pillar requires 2 modules
    
    editor note: separated this from DSA primary major requirements since we can use this table for extension for other majors in FOS and FASS
*/

INSERT INTO CHSRequirements (pillar, module_code)
VALUES 
	-- Data Literacy
    ('Data', 'GEA1000'),
    ('Data', 'DSA1101'),
    ('Data', 'ST1131'),
    ('Data', 'DSE1101'),
    ('Data', 'BT1101'),
    
    -- Communities and Engagement (Field/Project Work)
    ('C&E', 'CLC1101'),
    ('C&E', 'CLC2204'),
    ('C&E', 'CLC3303'),
    ('C&E', 'CLC3304A'),
    ('C&E', 'CLC3307'),
    ('C&E', 'GEN2000'),
	('C&E', 'GEN2001'),
    ('C&E', 'GEN2003'),
    ('C&E', 'GEN2004'),
    ('C&E', 'GEN2005'),
    ('C&E', 'GEN2006'),
    ('C&E', 'GEN2007'),
    ('C&E', 'SE3216'),
    ('C&E', 'SE3226'),
    ('C&E', 'BN4102'), -- Only for Engineering
    ('C&E', 'BN4103'), -- Only for Engineering
    ('C&E', 'NM4230'), -- Only for CNM 
    ('C&E', 'CP3107'), -- Only for Computing
    ('C&E', 'CP3110'), -- Only for Computing
    ('C&E', 'MUA2163'), -- Only for Music
	-- Other modules are too rare for University Scholars Program, NUS college, RVRC students
    
    -- Communities and Engagement: year-long modules must take both GEN20XX_1 and GEN20XX_2
    ('C&E', 'GEN2002X'), -- Year long
    ('C&E', 'GEN2002Y'),
    ('C&E', 'GEN2050X'), -- Year long
    ('C&E', 'GEN2050Y'),
    ('C&E', 'GEN2060X'), -- Year long
    ('C&E', 'GEN2060Y'),
    ('C&E', 'GEN2061X'), -- Year long
    ('C&E', 'GEN2061Y'),
    ('C&E', 'GEN2062X'), -- Year long
    ('C&E', 'GEN2062Y'),
    ('C&E', 'GEN2070X'), -- Year long
    ('C&E', 'GEN2070Y'),
    
    -- Artificial Intelligence
    ('AI', 'HS1501'),
    ('AI', 'HS1502'),
    ('AI', 'IT1244'),
    ('AI', 'CS2109S'),
    
    -- Design Thinking
    ('DT', 'DTK1234'),
    
    -- Digital Literacy
    ('Digital', 'GEI1001'),
    ('Digital', 'GEI1002'),
    ('Digital', 'NM2207'),
    ('Digital', 'CS1010'),
    ('Digital', 'CS1010A'),
    ('Digital', 'CS1010E'),
    ('Digital', 'CS1010J'),
    ('Digital', 'CS1010S'),
    ('Digital', 'CS1010X'),
	('Digital', 'COS1000'),
	('Digital', 'CM3267'),
	('Digital', 'LSM2302'),
	('Digital', 'SP2273'),
    
    -- Humanities
    ('Humanities', 'HSH1000'),
    
    -- Social Sciences
    ('Social Science', 'HSS1000'),
    
    -- Asian Studies
    ('Asian Studies', 'HSA1000'),

	-- Science 1
    ('Science1', 'HSI1000'),
    ('Science1', 'SP2274'),
    
    -- Science 2
    ('Science2', 'HSI2001'),
    ('Science2', 'HSI2002'),
    ('Science2', 'HSI2003'),
    ('Science2', 'HSI2004'),
    ('Science2', 'HSI2005'),
    ('Science2', 'HSI2006'),
    ('Science2', 'HSI2007'),
    ('Science2', 'HSI2008'),
    ('Science2', 'HSI2009'),
    ('Science2', 'HSI2010'),
    ('Science2', 'HSI2011'),
    ('Science2', 'HSI2012'),
    ('Science2', 'HSI2013'),
    ('Science2', 'HSI2014'),
    ('Science2', 'HSI2015'),
    ('Science2', 'HSI2016'),
    ('Science2', 'SP3275'),
    
    -- Interdisciplinary (must complete 2)
    ('ID', 'HS2902'),
    ('ID', 'HS2903'),
    ('ID', 'HS2904'),
    ('ID', 'HS2905'),
    ('ID', 'HS2906'),
    ('ID', 'HS2907'),
    ('ID', 'HS2908'),
    ('ID', 'HS2909'),
    ('ID', 'HS2911'),
    ('ID', 'HS2912'),
    ('ID', 'HS2913'),
    ('ID', 'HS2914'),
    ('ID', 'HS2915'),
    ('ID', 'HS2916'),
    ('ID', 'HS2917'),
    ('ID', 'HS2918'),
    ('ID', 'HS2919'),
    ('ID', 'HS2920'),
    ('ID', 'HS2921'),
    ('ID', 'HS2922'),
    ('ID', 'HS2923'),
    ('ID', 'HS2924'),
    
    -- Writing 
    ('Writing', 'SP1541'),
    ('Writing', 'FAS1101'),
    ('Writing', 'SP2271')
    
;
