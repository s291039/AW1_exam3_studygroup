# Exam #3: "Gruppi studio"

## Student: s291039 Lonardo Francesco

---

---

## React Client Application Routes

- Route `/`: this route redirect to `/login`.
- Route `/login`: it's required that the user log in to use the application.
- Route `/signup`: if the user doesn't have an account, here he can create it.
- Route `/selection`: the page where the user can choose operations.
- Route `/groups`: there's a groups list, here the user can send a request to join them.
- Route `/meetings`: there's a meetings list, here the user can register/deregister to them.
- Route `/manage_groups`: for each group, the user (according to the privileges that the user has in that moment), can: visualize the users/meetings in which he partecipates, remove a student from a group (group admin), or visualize them all, delete a group, change users priviledges and add a group (general admin);
- Route `/manage_meetings`: the group admin (only him) can visualize, remove (also the future ones) and add meetings.
- Route `/manage_requests`: the group admin (only him) can approve/decline users group requests.

---

---

## API Server

- POST `/api/sessions`

  - request parameters : none
    - request body :
    ```json
    {
    	"student_code": "s291039",
    	"student_password": "password"
    }
    ```
    - response body : an object containing the current logged user data.
    ```json
    {
    	"student_code": "s291039",
    	"student_name": "Francesco",
    	"student_surname": "Lonardo",
    	"group_admin": true,
    	"general_admin": true
    }
    ```

---

- DELETE `/api/sessions/current`

  - request parameters : none
  - request body : none
  - response body : none

  This API lets the logged user to log out.

---

- GET `/api/groups`

  - request parameters: none
  - request body : none
  - response body content: an array of objects containing the groups data.

  ```json
  [
  	{
  		"course_code": "01UDFOV",
  		"course_name": "Applicazioni Web I",
  		"course_credits": 6,
  		"group_color": "#ff001f",
  		"group_creation_date": "2021-01-01",
  		"group_students_number": 1,
  		"group_meetings_number": 3
  	},
  	{
  		"course_code": "03LPYOV",
  		"course_name": "Cryptography",
  		"course_credits": 6,
  		"group_color": "#9c27b0",
  		"group_creation_date": "2020-02-13",
  		"group_students_number": 1,
  		"group_meetings_number": 2
  	},
  	{
  		"course_code": "04GSPOV",
  		"course_name": "Software Engineering",
  		"course_credits": 8,
  		"group_color": "#4dff00",
  		"group_creation_date": "2019-01-01",
  		"group_students_number": 2,
  		"group_meetings_number": 3
  	}
  ]
  ```

---

- GET `/api/groups/:course_code`

  - request parameters : `course_code` which represents the group's id
  - request body : none
  - response body : an object describing a group.
    ```json
    {
    	"course_code": "04GSPOV",
    	"course_name": "Software Engineering",
    	"course_credits": 8,
    	"group_color": "#4dff00",
    	"group_creation_date": "2019-01-01",
    	"group_students_number": 2,
    	"group_meetings_number": 3
    }
    ```

---

- GET `/api/meetings`

  - request parameters : none
  - request body : none
  - response body content : an array of objects containing the meetings data.

    ```json
    [
    	{
    		"meeting_id": 2,
    		"course_code": "04GSPOV",
    		"course_name": "Software Engineering",
    		"meeting_datetime": "2021-12-02T08:30",
    		"meeting_duration": 180,
    		"meeting_place": "Torino",
    		"meeting_students_number": 1
    	},
    	{
    		"meeting_id": 6,
    		"course_code": "03LPYOV",
    		"course_name": "Cryptography",
    		"meeting_datetime": "2021-10-10T11:15",
    		"meeting_duration": 240,
    		"meeting_place": "Venezia",
    		"meeting_students_number": 1
    	},
    	{
    		"meeting_id": 7,
    		"course_code": "01UDFOV",
    		"course_name": "Applicazioni Web I",
    		"meeting_datetime": "2021-12-25T00:00",
    		"meeting_duration": 360,
    		"meeting_place": "Roma",
    		"meeting_students_number": 1
    	},
    	{
    		"meeting_id": 8,
    		"course_code": "02GRSOV",
    		"course_name": "Programmazione di Sistema",
    		"meeting_datetime": "2021-10-01T07:30",
    		"meeting_duration": 60,
    		"meeting_place": "Napoli",
    		"meeting_students_number": 1
    	},
    	{
    		"meeting_id": 9,
    		"course_code": "04GSPOV",
    		"course_name": "Software Engineering",
    		"meeting_datetime": "2021-09-07T13:50",
    		"meeting_duration": 120,
    		"meeting_place": "Torino",
    		"meeting_students_number": 1
    	}
    ]
    ```

---

- GET `/api/meetings/:meeting_id`

  - request parameters : `meeting_id` which represents the meeting's id
  - request body : none
  - response body : an object describing a meeting.
    ```json
    {
    	"meeting_id": 9,
    	"course_code": "04GSPOV",
    	"course_name": "Software Engineering",
    	"meeting_datetime": "2021-09-07T13:50",
    	"meeting_duration": 120,
    	"meeting_place": "Torino",
    	"meeting_students_number": 1
    }
    ```

---

---

## Database Tables

- Table `students` [student_code, student_name, student_surname, student_password, general_admin, group_admin]: its goal is to record all the information about users.
- Table `groups` [course_code, course_name, course_credits, group_color, group_creation_date, group_students_number, group_meetings_number]: contains all the groups created.
- Table `other_groups` [course_code, course_name, course_credits, group_color]: contains all the groups which can still be created.
- Table `meetings` [meeting_id, course_code (references to groups.course_code), course_name (references to groups.course_name), meeting_datetime, meeting_duration, meeting_place, meeting_students_number]: contains all the meetings created.
- Table `students_groups` (student_code (references to students.student_code), course_code (references to groups.course_code), group_admin (indicates that the user is a admin for the group), admin_approved (depending on the that attribute's value, the relation can indicates a request or a membership)): contains the relations between group and students which belong to it.
- Table `students_meetings` (student_code (references to students.student_code), meeting_id (references to meetings.meeting_id)): contains the relations between meeting and students have decided to partecipate to it.

---

---

## Main React Components

- `LoginSignupForm`. The component rendered in the '/login' and '/signup' routes. It allows the user to choose between log in and sign up.
- `SelectionPage`. The component rendered in the '/selection' route, it represents the main page, from which the user can go through the other routes.
- `GroupsTable`: The component rendered in the '/groups' route. It contains all the information about: the groups, the users memberships to the groups and the requests sent. Clicking on the user icon on the left, it opens a modal (ModalGroupRequest).
- `MeetingsTable`: The component rendered in the '/meetings' route. It contains all the information about: the meetings and the users registrations to the meetings. The registration/deregistration is made through a modal (ModalMeetingRegistration).
- `ManageGroupsTable`: The component rendered in the '/manage_groups' route. Here we have the list of groups, clicking on which pops up the users/meetings lists. When we try to add/remove a group the modal (ModalGroupAddDelete) shows up. Clicking on the trash (in the group's students list) a modal (ModalGroupStudentRemove) shows up.
- `ManageMeetingsTable`: The component rendered in the '/manage_meetings' route. Here we have the list of meetings. When we try to add/remove a meeting the modal (ModalMeetingAddDelete) shows up.
- `Navigation`. Rendered in almost all the routes, from here we can log out or get to requests page.
- `Breadcrumb`. Rendered in almost all the routes, from here we can go back to the main page (SelectionPage).
- `AddButton`. Rendered in '/manage_groups' and '/manage_meetings' routes, from it we can add groups/meetings.
- `RequestsApproveDecline`. Rendered in '/manage_requests' route, from it we can approve/decline requests.
- `SuccessErrorAlert`. Rendered in '/login', '/signup' and '/meetings' routes, it shows a positive/negative alert.

---

---

## Screenshot

![Preview: ](./screenshot.png)

---

---

## Users Credentials

- Student code : `s281702`, password : `password`. He's a general administrator, and a student.
- Student code : `s291039`, password : `password`. He's a general administrator, a group administrator (for group course_code: 01UDFOV) and a student.
- Student code : `s288063`, password : `password`. He's a group administrator (for group course_code: 01UDFOV), a group administrator (for group course_code: 04GSPOV) and a student.
- Student code : `s288200`, password : `password`. He's a group administrator (for group course_code: 04GSPOV) and a student.
- Student code : `s292503`, password : `password`. He's a student.

---

---
