//import dayjs from 'dayjs';
import Group from './models/Group.js';
import Meeting from './models/Meeting.js';
const BASEURL = '/api';
import dayjs from 'dayjs';


/*********************** Groups API ************************/

// call: POST /api/memes
async function addMeme(meme) {

	try {
		const response = await fetch(BASEURL + '/memes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...meme })
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: PUT /api/memes/:id
async function updateMeme(meme) {

	try {
		const response = await fetch(BASEURL + `/memes/${meme.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...meme })
		})
		const responseJson = await response.json();

		if (response.ok)
			return null;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/memes/:id
async function deleteMeme(memeId) {

	try {
		const response = await fetch(BASEURL + `/memes/${memeId}`, {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return null;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: GET /api/memes/:id
async function getMeme(id) {

	try {
		const response = await fetch(BASEURL + `/memes/${id}`);
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}


// call: POST /api/groups
async function addGroup(group) {

	try {
		const response = await fetch(BASEURL + '/groups', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				course_code: group.course_code,
				course_name: group.course_name,
				course_credits: group.course_credits,
				group_color: group.group_color,
				group_creation_date: dayjs().format('DD-MM-YYYY'), // TODO: check this!
				group_students_number: 0
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson
	} catch (err) {
		throw err;
	}

}

// call: POST /api/other_groups
async function addOtherGroup(group) {

	try {
		const response = await fetch(BASEURL + '/other_groups', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				course_code: group.course_code,
				course_name: group.course_name,
				course_credits: group.course_credits,
				group_color: group.group_color
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/groups/:course_code
async function removeGroup(courseCode) {

	try {
		const response = await fetch(BASEURL + `/groups/${courseCode}`, {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/other_groups/:course_code
async function removeOtherGroup(courseCode) {

	try {
		const response = await fetch(BASEURL + `/other_groups/${courseCode}`, {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: GET /api/groups
async function getAllGroups() {

	// try {
	const response = await fetch(BASEURL + '/groups');
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson;
		// return responseJson.map((g) => Group.from(g));
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/other_groups
async function getOtherGroups() {

	// try {
	const response = await fetch(BASEURL + '/other_groups');
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson;
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/groups/:course_code/students_number
async function getGroupStudentsNumber(courseCode) {

	// try {
	const response = await fetch(BASEURL + `/groups/${courseCode}/students_number`);
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson;
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/users/:student_code/groups
async function getStudentGroups(studentCode) {

	// try {
	const response = await fetch(BASEURL + `/users/${studentCode}/groups`);
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson;
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/groups/:course_code/students
async function getGroupStudents(courseCode) {

	try {
		const response = await fetch(BASEURL + `/groups/${courseCode}/students`);
		const responseJson = await response.json();

		if (response.ok) {
			return responseJson;
		}
		else
			throw responseJson;	// an object with the error coming from the server
	} catch (err) {
		throw err;
	}

}

// call: GET /api/meetings
async function getAllMeetings() {

	// try {
	const response = await fetch(BASEURL + '/meetings');
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson.map((m) => Meeting.from(m));
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/meetings/:meeting_id/students_number
async function getMeetingStudentsNumber(meetingId) {

	// try {
	const response = await fetch(BASEURL + `/meetings/${meetingId}/students_number`);
	const responseJson = await response.json();

	if (response.ok) {
		return responseJson;
	}
	else
		throw responseJson;	// an object with the error coming from the server
	// } catch (err) {
	// 	throw err;
	// }

}

// call: GET /api/users/:student_code/meetings
async function getStudentMeetings(studentCode) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/meetings`);
		const responseJson = await response.json();

		if (response.ok) {
			return responseJson;
		}
		else
			throw responseJson;	// an object with the error coming from the server
	} catch (err) {
		throw err;
	}

}

// call: POST /api/users/:student_code/groups/:course_code/request
async function addGroupRequest(studentCode, courseCode, groupAdmin) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/groups/${courseCode}/request`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: studentCode,
				course_code: courseCode,
				group_admin: groupAdmin,
				admin_approved: 0
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}


// call: PUT /api/users/:student_code/groups
async function approveGroupRequest(studentCode, courseCode) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/groups`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: studentCode,
				course_code: courseCode,
				admin_approved: 1
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: POST /api/users/:student_code/meetings
async function addMeetingRegistration(studentCode, meetingId) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/meetings`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: studentCode,
				meeting_id: meetingId
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/users/:student_code/meetings/:meeting_id
async function removeMeetingRegistration(studentCode, meetingId) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/meetings/${meetingId}`, {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: GET /api/memes?filter=:filter
async function getFilteredMemes(filter) {

	try {
		const response = await fetch(BASEURL + `/memes?filter=${filter}`);
		const responseJson = await response.json();

		if (response.ok) {
			//return memesJson.map((meme) => Object.assign({}, meme, { datetime: dayjs(meme.datetime) }));	// TODO: check this!
			return responseJson;
		}
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/users/:student_code/groups/:course_code
async function removeUserFromGroup(studentCode, courseCode) {

	try {
		const response = await fetch(BASEURL + `/users/${studentCode}/groups/${courseCode}`, {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

/*********************** Users API *************************/

// call: POST /api/register
async function signUp(credentials) {

	try {
		const response = await fetch(BASEURL + '/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: credentials.student_code,
				student_name: credentials.student_name,
				student_surname: credentials.student_surname,
				student_password: credentials.student_password
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson
	} catch (err) {
		throw err;
	}

}

// call: POST /api/sessions
async function logIn(credentials) {

	try {
		const response = await fetch(BASEURL + '/sessions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: credentials.student_code,
				student_password: credentials.student_password
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: GET /api/sessions/current
async function getCurrentUserInfo() {

	try {
		const response = await fetch(BASEURL + '/sessions/current');
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;	// an object with the error coming from the server, mostly unauthenticated user
	} catch (err) {
		throw err;
	}

}

// call: DELETE /api/sessions/current
async function logOut() {

	try {
		const response = await fetch(BASEURL + '/sessions/current', {
			method: 'DELETE'
		})
		const responseJson = await response.json();

		if (response.ok)
			return null;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}

// call: GET /api/students/:student_code
async function getUserInfo(studentCode) {

	try {
		const response = await fetch(BASEURL + `/students/${studentCode}`);
		const responseJson = await response.json();

		if (response.ok)
			return responseJson;
		else
			throw responseJson;	// an object with the error coming from the server, mostly unauthenticated user
	} catch (err) {
		throw err;
	}

}

// call: PUT /api/students/:student_code
async function updateStudent(studentCode, groupAdmin) {

	try {
		const response = await fetch(BASEURL + `/students/${studentCode}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				student_code: studentCode,
				group_admin: groupAdmin
			})
		})
		const responseJson = await response.json();

		if (response.ok)
			return null;
		else
			throw responseJson;
	} catch (err) {
		throw err;
	}

}


const API = { addGroup, addOtherGroup, removeGroup, removeOtherGroup, getAllGroups, getOtherGroups, getGroupStudentsNumber, getStudentGroups, getGroupStudents, getAllMeetings, getMeetingStudentsNumber, getStudentMeetings, addGroupRequest, approveGroupRequest, addMeetingRegistration, removeMeetingRegistration, removeUserFromGroup, signUp, logIn, getCurrentUserInfo, logOut, getUserInfo, updateStudent }
export default API;
