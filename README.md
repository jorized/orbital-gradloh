# GRADLOH (NUS Orbital Project)

A graduation planner app, dedicated for NUS students.

Proposed level of achievement: Apollo 11

## Promotional Poster

<img src="https://github.com/jorized/orbital-gradloh/blob/main/6328.png?raw=true" width=500>

## Promotional Video (Watch it on Youtube : 
https://github.com/jorized/orbital-gradloh/assets/79164390/d5ed73bc-51c6-4bc1-b91e-956c4f4ce62d

## Before using the app

### Limitations
- As of the current version (30/5/2024), GradLoh do not support all combination of modules (E.g. Business + Computer Science) required for graduation.
- This is mainly due to the vast majority of module combinations that NUS can have (ranging from majors to minors), and the fact that most of these data are going to be manually scraped and curated by us.
- As such, the app will be mostly focusing and will only be dedicated towards SOC ( + DSA) courses for now.
- GradLoh also does not support special cases, e.g. Exemptions, special terms etc. as our main focus will be on the basic curriculum.
- These features may or may not be implemented in future updates.


## Milestone 1 (Ideation)
### Motivation
As NUS students, we all have to track our graduation process. Some uses excel sheets passed down by seniors to track,  while others simply stick to the sample study plan provided by their respective faculty departments. However, these approaches are sometimes a hassle and not very intuitive as students might be unsure of what modules they have to take in order to graduate on time. It is also not flexible enough as study plans which might differ from year to year would also mean that students will have to keep making changes and altering the plans to suit their curriculum. This is also made a problem when they are not able to follow a proper plan or see what module combinations their fellow peers are taking during each semester, and the consequences that comes along with it. As such, with these problems in mind, our team consider these experiences to be negative for NUS students and seek to offer a solution.

### Proposed core features
<table>
    <thead>
        <tr>
            <th>Features</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Extensive profile set-up</td>
            <td>An in-depth registering process which allow users to fill up the necessary details, in order to cater the app to their course curriculum.
              <ul>
                - Feature includes: 
                <ul>
                  <li>A flexible multi-step form which allow users to fill in their year of matriculation, faculty as well as their primary major, secondary major and minors (if they have any).</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>Built-in tutorial for onboarding</td>
            <td>A non-mandatory tutorial process which allow first-time users to learn what it is like to use the application and its relevant features.
              <ul>
                - Feature includes: 
                <ul>
                  <li>A step-by-step spotlight effect, which will highlight the part which the users will have to click, and guide them in order to get to the next step.</li>
                  <li>A skip button which users can press, in order to skip the tutorial at any point in time.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>Personalised settings</td>
            <td>A highly customisable settings page
              <ul>
                - Feature includes: 
                <ul>
                  <li>A side-menu which allow users to change their avatars, password (Mail OTP), as well as their majors/minors (At their own risk) at any point in time.</li>
                  <li>A FAQ section which allow questions regarding the application itself to be answered.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>Graduation Progress Dashboard</td>
            <td>A dashboard that enables users to track their remaining modules and verify their eligibility for graduation, according to their academic disciplines.
              <ul>
                - Feature includes: 
                <ul>
                  <li>A simple but yet straightforward algorithm-driven text display that shows the graduation progress percentage.</li>
                  <li>An interactive chart that tracks and shows the different segments of their progress (E.g. Core modules and UEs etc.)</li>
                  <li>An on-tap feature which allow users to customise and change the chart to their preferred chart (E.g. Doughnut chart, Pie chart etc.)</li>
                  <li>A progress indicator which determine if they are "On-track", "Behind Schedule", and "At Risk", based on their different academic disciplines.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>Course planner</td>
            <td>A dynamic course planner which allow users to plan and create modules for every semester, while at the same time, check their completion status.
              <ul>
                - Feature includes: 
                <ul>
                  <li>A section which has the all the semesters stored as folders, with each folder consisting of that semester's modules.</li>
                  <li>A module section which allow users to search and choose and add/save/edit their desired modules, while at the same time show pre-requisites (if any). Follows a add-to-cart design which allows simplicity and multi-adding.</li>
                  <li>An infographic section within the folders, which allow users to have a preview of the module details, and delete them if they want to. If needed, they are also allowed to have an in-depth one, just by clicking on the module.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>AI-powered review system</td>
            <td>A review system that allow users to indicate their review and give feedback of the modules they had completed after each semester.
              <ul>
                - Feature includes: 
                <ul>
                  <li>A chatbot assistant which will prompt recommendations to users after given the user's feedback, regarding the next combination of modules they should take for their next semester, through thorough review of what they have/have not completed.</li>
                  <li>A hands-free feedback session which allow users to give feedback on the module based on AI-suggested answers, to provide a more convenient and straightforward feedback, all the while keeping it rational.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## User Stories
As a prospective student, I can see the graduation dashboard to get a quick overview of my current graduation status based on current date and projected modules so that I can have be rest assured about my academic journey.

As a senior, I can use the graduation module builder to obtain specific module information so that I can effectively build my module combinations in preparation for fulfilling all graduation requirements.

As a freshman,  I can use Henry, the helpful AI bot which can recommend me modules based on the highly rated combination of modules seniors have chosen so that I can decide what combinations are best for my upcoming semester. 

As an incoming exchange student, I can use the module combination review feature so that I can choose modules that are highly sought after by local students especially when I am unsure about the module selection culture in NUS.

As an NUS student, I can create and maintain my profile feature to always ensure that my graduation status is stored in Gradloh so that I can revisit it every time module registration approaches or when I intend to plan for my graduation on the fly.

As an educator in NUS, I can use the module combination review to determine student behavior so that I can better plan for a cross-module curriculum. 

## Design (UI/UX & Architecture)

### Colour Scheme
<img src="https://github.com/jorized/orbital-gradloh/assets/79164390/16926fdd-893d-4c09-a9a8-c321462227b4" width="350"/>

### Font
Primary fonts: Arial, Lexend Deca. Secondary fonts: Times new Roman, Helvetica Neue
<img src="https://github.com/jorized/orbital-gradloh/assets/79164390/1d62731b-16c8-43cd-9ea2-8d6cde9632a5" width="450"/>

### Entity-Relationship Diagram (ERD)
<img src="https://github.com/jorized/orbital-gradloh/assets/98576382/96c7b9fc-bcf9-4d86-af8d-e3656db70bdc" width="1000"/>

### Summary
<table>
    <tr>
        <th>Table</th>
        <th>Attributes</th>
        <th>Types</th>
        <th>Primary Key</th>
        <th>Foreign Keys</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><b>Modules</b></td>
        <td>
            <ol>
                <li>module_code</li>
                <li>module_name</li>
                <li>faculty</li>
                <li>module_description</li>
                <li>completition_status</li>
            </ol>
        </td>
        <td>
            <ol>
                <li>VARCHAR(7), NOT NULL</li>
                <li>VARCHAR(45), UNIQUE, NOT NULL</li>
                <li>VARCHAR(45), NOT NULL</li>
                <li>TEXT</li>
                <li>BOOLEAN, NOT NULL</li>
            </ol>
        </td>
        <td>module_code</td>
        <td>N/A</td>
        <td>Stores information about academic modules.</td>
    </tr>
    <tr>
        <td><b>Folders</b></td>
        <td>
            <ol>
                <li>folder_id</li>
                <li>folder_name</li>
                <li>module_code</li>
            </ol>
        </td>
        <td>
            <ol>
                <li>VARCHAR(255)</li>
                <li>VARCHAR(10), NOT NULL</li>
                <li>VARCHAR(7), NOT NULL</li>
            </ol>
        </td>
        <td>folder_id</td>
        <td>module_code references Modules(module_code)</td>
        <td>Associates specific folders with modules.</td>
    </tr>
    <tr>
        <td><b>Combinations</b></td>
        <td>
            <ol>
                <li>primary_major</li>
                <li>secondary_major</li>
                <li>first_minor</li>
                <li>second_minor</li>
                <li>module_code</li>
            </ol>
        </td>
        <td>
            <ol>
                <li>VARCHAR(45), NOT NULL</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(7), NOT NULL</li>
            </ol>
        </td>
        <td>Composite key: primary_major, secondary_major, first_minor, second_minor</td>
        <td>module_code references Modules(module_code)</td>
        <td>Defines combinations of majors and minors that correspond to modules.</td>
    </tr>
    <tr>
        <td><b>Users</b></td>
        <td>
            <ol>
                <li>email</li>
                <li>folder_id</li>
                <li>nickname</li>
                <li>password</li>
                <li>refresh_token</li>
                <li>reset_otp</li>
                <li>reset_otp_exp</li>
                <li>enrolment_year</li>
                <li>primary_major</li>
                <li>secondary_major</li>
                <li>first_minor</li>
                <li>second_minor</li>
                <li>home_faculty</li>
            </ol>
        </td>
        <td>
            <ol>
                <li>VARCHAR(255), NOT NULL</li>
                <li>VARCHAR(255)</li>
                <li>VARCHAR(45), NOT NULL</li>
                <li>VARCHAR(255), NOT NULL</li>
                <li>VARCHAR(255)</li>
                <li>VARCHAR(255)</li>
                <li>BIGINT</li>
                <li>VARCHAR(7)</li>
                <li>VARCHAR(45), NOT NULL</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(45)</li>
                <li>VARCHAR(45)</li>
            </ol>
        </td>
        <td>email</td>
        <td>
            <ol>
                <li>folder_id references Folders(folder_id)</li>
                <li>primary_major, secondary_major, first_minor, second_minor references Combinations(primary_major, secondary_major, first_minor, second_minor)</li>
            </ol>
        </td>
        <td>Stores user information, including their majors, minors, and associated folder.</td>
    </tr>
</table>                  


## Plan 

## Project Logging
