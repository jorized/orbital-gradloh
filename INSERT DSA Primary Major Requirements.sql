/*
Data Science and Analytics Primary Major
No of CORE mods: 17
No of CHS mods: 12
No of double counted mods: 1
	1. DSA1101 (CORE, CHS)

editor note: listed out ALL possible core modules and specialisation modules users are able to take, also specified rules in DSA major
*/
-- Inserting only core mods (including core modules) 
INSERT INTO PrimaryMajorRequirements (primary_major, module_type, module_code)
VALUES 
	/*  -- Main bulk of requirements
		-- link:  chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.stat.nus.edu.sg/wp-content/uploads/sites/8/2024/06/120624-Major-Data-Science-and-Analytics-Programme-Requirements-AY21-22-and-after.pdf
		
        * = one of ST2131/MA2116
        $ = one of MA2311/MA2104
        # = either MA3238/ST3236 (they are the same modules offered in diff sems)
        @ = either MA4251/ST4238 (they are the same modules offered in diff sems)
        
    */
    
    -- LEVEL 1000
    ("Data Science and Analytics", "Core", "DSA1101"),
    
    -- LEVEL 2000
    ("Data Science and Analytics", "Core", "CS2040"),
    ("Data Science and Analytics", "Core", "DSA2101"),
    ("Data Science and Analytics", "Core", "DSA2102"),
    ("Data Science and Analytics", "Core", "MA2001"),
    ("Data Science and Analytics", "Core", "MA2002"),
    ("Data Science and Analytics", "Core_$", "MA2311"), -- $
    ("Data Science and Analytics", "Core_$", "MA2104"), -- $
    ("Data Science and Analytics", "Core_*", "ST2131"), -- *
    ("Data Science and Analytics", "Core_*", "MA2116"), -- *
    ("Data Science and Analytics", "Core", "ST2132"), 
    
    -- LEVEL 3000
    ("Data Science and Analytics", "Core", "CS3244"),
    ("Data Science and Analytics", "Core", "DSA3101"),
    ("Data Science and Analytics", "Core", "DSA3102"),
    ("Data Science and Analytics", "Core", "ST3131"),
    
    -- LEVEL 4000 (choose A or B)
    -- Option A: 1x DSA42xx & 1x DSA426x
    ("Data Science and Analytics", "Core_4A1", "DSA4211"),
    ("Data Science and Analytics", "Core_4A1", "DSA4212"),
    ("Data Science and Analytics", "Core_4A1", "DSA4213"),
    
    ("Data Science and Analytics", "Core_4A2", "DSA4261"),
    ("Data Science and Analytics", "Core_4A2", "DSA4262"),
    ("Data Science and Analytics", "Core_4A2", "DSA4263"),
    ("Data Science and Analytics", "Core_4A2", "DSA4264"),
    ("Data Science and Analytics", "Core_4A2", "DSA4265"),
    ("Data Science and Analytics", "Core_4A2", "DSA4266"),

	-- LEVEL 4000 (choose A or B)
    -- Option B: 1x Honours Project
    ("Data Science and Analytics", "Core_4B", "DSA4288"),
    ("Data Science and Analytics", "Core_4B", "DSA4288M"), 
    ("Data Science and Analytics", "Core_4B", "DSA4288S"),
    
    -- Operations Research Specialisation: any 5, maximum 2 modules at 3k level
    ("Data Science and Analytics", "Spec_Op", "MA3252"),
    ("Data Science and Analytics", "Spec_Op", "MA3227"),
    ("Data Science and Analytics", "Spec_Op", "MA3238"), -- #
    ("Data Science and Analytics", "Spec_Op", "ST3236"), -- #
    ("Data Science and Analytics", "Spec_Op", "MA4230"),
    ("Data Science and Analytics", "Spec_Op", "MA4251"), -- @
    ("Data Science and Analytics", "Spec_Op", "ST4238"), -- @
    ("Data Science and Analytics", "Spec_Op", "MA4260"),
    ("Data Science and Analytics", "Spec_Op", "MA4268"),
    ("Data Science and Analytics", "Spec_Op", "MA4270"),
-- ("Data Science and Analytics", "Core_4A", "DSA4288M") is considered 2 modules worth (FYP)
    
    -- Statistical Methodology Specialisation: any 5, maximum 2 modules at 3k level
    ("Data Science and Analytics", "Spec_Stats", "ST3232"),
    ("Data Science and Analytics", "Spec_Stats", "ST3239"),
    ("Data Science and Analytics", "Spec_Stats", "ST3247"),
    ("Data Science and Analytics", "Spec_Stats", "ST3248"),
    ("Data Science and Analytics", "Spec_Stats", "ST4231"),
    ("Data Science and Analytics", "Spec_Stats", "ST4234"),
    ("Data Science and Analytics", "Spec_Stats", "ST4248"),
    ("Data Science and Analytics", "Spec_Stats", "ST4250"),
    ("Data Science and Analytics", "Spec_Stats", "ST4253"),
-- ("Data Science and Analytics", "Core_4B", "DSA4288S") is considered 2 modules worth (FYP)

	
	-- Internship requirement: Any one of the folllowing
    ("Data Science and Analytics", "Intern", "DSA3310"),
    ("Data Science and Analytics", "Intern", "DSA3311"),
    ("Data Science and Analytics", "Intern", "DSA3312"),
    ("Data Science and Analytics", "Intern", "DSA3313"),
    ("Data Science and Analytics", "Intern", "NOC") -- Discus with jordan how to deal with NOC courses LOL
--  ("Data Science and Analytics", "Core_4B", "DSA4288"),
--  ("Data Science and Analytics", "Core_4B", "DSA4288M"), 
--  ("Data Science and Analytics", "Core_4B", "DSA4288S"),
;





/*

	FOR THIS, I MIGHT CHOOSE TO DELETE IF I SEPARATE THE REQUIREMENTS BY COMMON CURRICULUM
    UNDER CHSREQUIREMENTS table.

-- Inserting CHS mods (GE curriculum embedded in CHS)
INSERT INTO primarymajorrequirements (primary_major, module_type, module_code)
VALUES 
	("Data Science and Analytics", "CC", "CS1010S"),
    ("Data Science and Analytics", "CC", "DTK1234"),
    ("Data Science and Analytics", "CC", "HSI1000"),
    ("Data Science and Analytics", "CC", "HSH1000"),
    ("Data Science and Analytics", "CC", "HSS1000"),
    ("Data Science and Analytics", "CC", "HSA1000"),
    ("Data Science and Analytics", "CC", "HS1501"),
    ("Data Science and Analytics", "CC", "HSI2009"), -- NEED TO UPDATE ALL AVAILABLE MODULES (science 2)
    ("Data Science and Analytics", "CC", "HS2904"), -- NEED TO UPDATE ALL AVAILABLE MODULES (interdisciplinary)
    ("Data Science and Analytics", "CC", "HS2914"), -- NEED TO UPDATE ALL AVAILABLE MODULES (interdisciplinary)
    ("Data Science and Analytics", "CC", "SP1541"),
    ("Data Science and Analytics", "CC", "CLC2204");

*/

