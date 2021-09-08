/* Data Access Object (DAO) module for accessing memes */
const db = require('./db');


// get user info
exports.getUserInfo = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT student_code, student_name, student_surname, general_admin, group_admin FROM students WHERE student_code = ?';
		db.get(sql, [studentCode], (err, row) => {
			if (err)
				reject(err);
			else if (row == undefined)
				resolve({ error: 'User not found.' });
			else {
				const userInfo = {
					student_code: row.student_code,
					student_name: row.student_name,
					student_surname: row.student_surname,
					general_admin: !!row.general_admin, // from integer to boolean
					group_admin: !!row.group_admin // from integer to boolean
				};
				resolve(userInfo);
			}
		})
	})

}

exports.updateStudent = (studentCode, groupAdmin) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE students SET group_admin = ? WHERE student_code = ?';
		db.run(sql, [groupAdmin, studentCode], (err) => {
			if (err)
				reject(err);
			else {
				// TODO: check this: resolve(exports.getMeme(memeId));
				resolve(this.changes);
			}
		})
	})

}

exports.setGroupAdmin = (studentCode, courseCode) => {

	return new Promise((resolve, reject) => {
		exports.upgradeStudent(studentCode)
			.then(() => {
				const sql = 'UPDATE students_groups SET(group_admin) WHERE student_code = ? and course_code = ?';
				db.run(sql, [1, studentCode, courseCode], (err) => {
					if (err)
						reject(err);
					else {
						//resolve(exports.getMeme(memeId));
						resolve(this.changes);
					}
				})
			})
			.catch((error) => {
				reject(error);
			})
	})

}

// add a new group
exports.createGroup = (group) => {

	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO groups(course_code, course_name, course_credits, group_color, group_creation_date, group_students_number, group_meetings_number) VALUES(?,?,?,?,?,?,?)';
		db.run(sql,
			[
				group.course_code,
				group.course_name,
				group.course_credits,
				group.group_color,
				group.group_creation_date,
				0,
				0
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes); // FIXME: fix this!
			}
		)
	})

}

// add a new (other) group
exports.createOtherGroup = (group) => {

	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO other_groups(course_code, course_name, course_credits, group_color) VALUES(?,?,?,?)';
		db.run(sql,
			[
				group.course_code,
				group.course_name,
				group.course_credits,
				group.group_color
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes); // FIXME: fix this!
			}
		)
	})

}

// delete an existing group
exports.deleteGroup = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM groups WHERE course_code = ?';
		db.run(sql, [courseCode], (err) => {
			if (err)
				reject(err);
			else
				resolve();
		})
	})

}

// delete an existing (other) group
exports.deleteOtherGroup = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM other_groups WHERE course_code = ?';
		db.run(sql, [courseCode], (err) => {
			if (err)
				reject(err);
			else
				resolve();
		})
	})

}

// get group info
exports.getGroupInfo = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM groups WHERE course_code = ?';
		db.get(sql, [courseCode], (err, row) => {
			if (err)
				reject(err);
			else if (row === undefined)
				resolve({ error: 'Group not found.' });
			else {
				const groupInfo = {
					course_code: row.course_code,
					course_name: row.course_name,
					group_color: row.group_color
				};
				resolve(groupInfo);
			}
		})
	})

}

// get all groups
exports.listAllGroups = () => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM groups';
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Groups not found.' });
			// else
			resolve(rows);
		})
	})

}

// get other groups
exports.listOtherGroups = () => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM other_groups';
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Other groups not found.' });
			// else
			resolve(rows);
		})
	})

}

// get logged user groups
exports.listUserGroups = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM students_groups WHERE student_code = ?';
		db.all(sql, [studentCode], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Groups not found.' });
			// else
			resolve(rows);
		})
	})

}

// update the group students number
exports.updateGroupStudentsNumber = (courseCode, updateNumber) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE groups SET group_students_number = group_students_number + ? WHERE course_code = ?';
		db.run(sql,
			[
				updateNumber,
				courseCode
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes);
			}
		)
	})

}

// update the group meetings number
exports.updateGroupMeetingsNumber = (courseCode, updateNumber) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE groups SET group_meetings_number = group_meetings_number + ? WHERE course_code = ?';
		db.run(sql,
			[
				updateNumber,
				courseCode
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes);
			}
		)
	})

}

// get group's users
exports.listGroupUsers = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT student_code FROM students_groups WHERE course_code = ? AND admin_approved = ?';
		db.all(sql, [courseCode, 1], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			else if (rows === undefined)
				resolve({ error: 'Users not found.' });
			else
				resolve(rows);
		})
	})

}

// get group's meetings
exports.listGroupMeetings = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM meetings WHERE course_code = ?';
		db.all(sql, [courseCode], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Group's meetings not found.' });
			// else
			resolve(rows);
		})
	})

}

// get logged (group admin) user's groups
exports.listGroupAdminGroups = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM groups WHERE course_code IN( SELECT course_code FROM students_groups WHERE student_code = ? AND group_admin = ?)';
		db.all(sql, [studentCode, 1], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: '(Group admin) user's groups not found.' });
			// else
			resolve(rows);
		})
	})

}

// get all meetings
exports.listMeetings = () => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM meetings';
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Meetings not found.' });
			// else
			resolve(rows);
		})
	})

}

// get logged user meetings
exports.listUserMeetings = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM meetings WHERE meeting_id IN (SELECT meeting_id FROM students_meetings WHERE student_code = ?)';
		db.all(sql, [studentCode], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'User's meetings not found.' });
			// else
			resolve(rows);
		})
	})

}

// update the meeting students number
exports.updateMeetingStudentsNumber = (meetingId, updateNumber) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE meetings SET meeting_students_number = meeting_students_number + ? WHERE meeting_id = ?';
		db.run(sql,
			[
				updateNumber,
				meetingId
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes);
			}
		)
	})

}

// create a new meeting
exports.createMeeting = (meeting) => {

	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO meetings(course_code, course_name, meeting_datetime, meeting_duration, meeting_place, meeting_students_number) VALUES(?,?,?,?,?,?)';
		db.run(sql,
			[
				meeting.course_code,
				meeting.course_name,
				meeting.meeting_datetime,
				meeting.meeting_duration,
				meeting.meeting_place,
				0
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes); // FIXME: fix this!
			}
		)
	})

}

// delete an existing meeting
exports.deleteMeeting = (meetingId) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM meetings WHERE meeting_id = ?';
		db.run(sql,
			[meetingId],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.change);
					resolve();
			}
		)
	})

}

// add a new group request
exports.createGroupRequest = (groupRequest) => {

	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO students_groups(student_code, course_code, group_admin, admin_approved) VALUES(?,?,?,?)';
		db.run(sql,
			[
				groupRequest.student_code,
				groupRequest.course_code,
				groupRequest.group_admin,
				groupRequest.admin_approved
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve();
			}
		)
	})

}

// approve an existing group request
exports.approveGroupRequest = (studentCode, courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE students_groups SET admin_approved = ? WHERE student_code = ? and course_code = ?';
		db.run(sql,
			[1, studentCode, courseCode],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes);
			}
		)
	})

}

// delete a group request
exports.deleteGroupRequest = (studentCode, courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM students_groups WHERE student_code = ? AND course_code = ?';
		db.run(sql,
			[studentCode, courseCode],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.change);
					resolve();
			}
		)
	})

}

// get all groups requests
exports.listAllGroupsRequests = () => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM students_groups WHERE admin_approved = ?';
		db.all(sql, [0], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: 'Requests not found.' });
			// else
			resolve(rows);
		})
	})

}

// get logged (group admin) user's requests
exports.listGroupAdminRequests = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT student_code, course_code FROM students_groups WHERE admin_approved = ? AND course_code IN (SELECT course_code FROM students_groups WHERE student_code = ? AND group_admin = ?)';
		db.all(sql, [0, studentCode, 1], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			// else if (rows === undefined)
			// 	resolve({ error: `(Group admin) user's requests not found.` });
			// else
			resolve(rows);
		})
	})

}

// add a new meeting registration
exports.createMeetingRegistration = (meetingRegistration) => {

	return new Promise((resolve, reject) => {
		const sql =
			'INSERT INTO students_meetings(student_code, meeting_id) VALUES(?,?)';
		db.run(sql,
			[
				meetingRegistration.student_code,
				meetingRegistration.meeting_id
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve();
			}
		)
	})

}

// delete a meeting registration
exports.deleteMeetingRegistration = (meetingRegistration) => {

	return new Promise((resolve, reject) => {
		const sql =
			'DELETE FROM students_meetings WHERE student_code = ? AND meeting_id = ?';
		db.run(sql,
			[
				meetingRegistration.student_code,
				meetingRegistration.meeting_id
			],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.change);
					resolve();
			}
		)
	})

}

// delete a student from a group
exports.deleteGroupStudent = (courseCode, studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM students_groups WHERE student_code = ? AND course_code = ?';
		db.run(sql,
			[
				studentCode,
				courseCode
			],
			(err) => {
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})

}

// get group admins
exports.listGroupAdmins = (courseCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT student_code FROM students_groups WHERE course_code = ? AND group_admin = ?';
		db.all(sql, [courseCode, 1], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			else if (rows === undefined)
				resolve({ error: `Group's admins not found.` });
			else
				resolve(rows);
		})
	})

}

// set a group's admin
exports.setGroupAdmin = (courseCode, studentCode, adminValue) => {

	return new Promise((resolve, reject) => {
		const sql = 'UPDATE students_groups SET group_admin = ? WHERE course_code = ? AND student_code = ?';
		db.run(sql,
			[adminValue, courseCode, studentCode],
			(err) => {
				if (err)
					reject(err);
				else
					// resolve(this.lastID);
					resolve(this.changes);
			}
		)
	})

}

// check if user is group admin
exports.checkIfUserGroupAdmin = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT COUNT(*) FROM students_groups WHERE student_code = ? AND group_admin = ?';
		db.get(sql, [studentCode, 1], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			else
				resolve(rows);
		})
	})

}
