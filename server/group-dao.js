/* Data Access Object (DAO) module for accessing memes */
const db = require('./db');


/*
 * DB Structure
 *
 * CREATE TABLE memes (
 * 		id		      	INTEGER		PRIMARY KEY,
 *		img_id      	INTEGER		INTEGER,
 * 		title			TEXT		NOT NULL,
 * 		creator_name	TEXT,
 * 		private     	BOOLEAN		DEFAULT (1) NOT NULL,
 * 		text1			TEXT		NOT NULL,
 * 		text2			TEXT,
 * 		text3			TEXT,
 * 		text_font		TEXT		NOT NULL,
 * 		text_size		INTEGER		DEFAULT (6) NOT NULL,
 * 		text_color		TEXT		NOT NULL,
 * 		text_bold		BOOLEAN		DEFAULT (0) NOT NULL,
 * 		text_italic		BOOLEAN		DEFAULT (0) NOT NULL,
 * 		text_uppercase	BOOLEAN		DEFAULT (1) NOT NULL,
 * 		datetime		DATETIME
 * );
 * 
 * DATETIME format is ISO 8601: 2000-01-01T00:00:00.000Z
 */


exports.getUserInfo = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT student_code, student_name, student_surname, general_admin, group_admin FROM students WHERE student_code = ?';
		db.get(sql, [studentCode], (err, row) => {
			if (err)
				reject(err);
			else if (row == undefined)
				resolve({ error: 'User not found.' });
			else {
				const user = {
					student_code: row.student_code,
					student_name: row.student_name,
					student_surname: row.student_surname,
					general_admin: !!row.general_admin, // from integer to boolean
					group_admin: !!row.group_admin // from integer to boolean
				};
				// const user = dbRowToUser(row);
				resolve(user);
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

// add a new meme
// the meme id is added automatically by the DB (autoincrement), and it is returned as result
exports.createMeme = (meme) => {

	return new Promise((resolve, reject) => {
		const sql =
			`INSERT INTO memes(
				img_id, title, creator_name, private, 
				text1, text2, text3, 
				text_font, text_size, text_color, 
				text_bold, text_italic, text_uppercase,
				datetime
				) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,DATETIME(?))`;
		db.run(sql,
			[
				meme.img_id, meme.title, meme.creator_name, meme.private,
				meme.text1, meme.text2, meme.text3,
				meme.text_font, meme.text_size, meme.text_color,
				meme.text_bold, meme.text_italic, meme.text_uppercase,
				meme.datetime
			],
			(err) => {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			}
		)
	})

}

// update an existing meme
exports.updateMeme = (meme, memeId, userName) => {

	return new Promise((resolve, reject) => {
		const sql =
			`UPDATE memes SET(
				title, private,
				text1, text2, text3,
				text_font, text_size, text_color,
				text_bold, text_italic, text_uppercase,
				datetime
			) WHERE id = ? and creator_name = ?`;
		db.run(sql,
			[
				meme.title, meme.private,
				meme.text1, meme.text2, meme.text3,
				meme.text_font, meme.text_size, meme.text_color,
				meme.text_bold, meme.text_italic, meme.text_uppercase,
				meme.datetime,
				memeId, userName
			],
			(err) => {
				if (err)
					reject(err);
				else {
					//resolve(exports.getMeme(memeId));
					resolve(this.changes);
				}
			})
	})

}

// delete an existing meme
exports.deleteMeme = (memeId, userName) => {

	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM memes WHERE id = ? AND creator_name = ?';
		db.run(sql, [memeId, userName], (err) => {
			if (err)
				reject(err);
			else
				resolve(this.changes);
		})
	})

}

// get the meme identified by {memeId}
exports.getMeme = (memeId, userName) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM memes WHERE id = ? and creator_name = ?';
		db.get(sql, [memeId, userName], (err, row) => {
			if (err)
				reject(err);
			else if (row == undefined)
				resolve({ error: 'Meme not found.' });
			else {
				//const meme = { ...row };
				const meme = dbRowToTask(row);
				resolve(meme);
			}
		})
	})

}

// add a new group
exports.createGroup = (group) => {

	return new Promise((resolve, reject) => {
		const sql =
			'INSERT INTO groups(course_code, course_name, course_credits, group_color, group_creation_date, group_students_number) VALUES(?,?,?,?,?,?)';
		db.run(sql,
			[
				group.course_code,
				group.course_name,
				group.course_credits,
				group.group_color,
				group.group_creation_date,
				group.group_students_number
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
		const sql =
			'INSERT INTO other_groups(course_code, course_name, course_credits, group_color) VALUES(?,?,?,?)';
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

// update an existing group students number
exports.updateGroupStudentsNumbers = (courseCode, updateNumber) => {

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
		const sql = 'SELECT meeting_id FROM students_meetings WHERE student_code = ?';
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

// update an existing meeting students number
exports.updateMeetingStudentsNumbers = (meetingId, updateNumber) => {

	return new Promise((resolve, reject) => {
		const sql =
			'UPDATE meetings SET meeting_students_number = meeting_students_number + ? WHERE meeting_id = ?';
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

// add a new group request
exports.createGroupRequest = (groupRequest) => {

	return new Promise((resolve, reject) => {
		const sql =
			'INSERT INTO students_groups(student_code, course_code, group_admin, admin_approved) VALUES(?,?,?,?)';
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

// update an existing group request
exports.updateGroupRequest = (approvedGroupRequest) => {

	return new Promise((resolve, reject) => {
		const sql =
			'UPDATE students_groups SET(admin_approved) WHERE student_code = ? and course_code = ?';
		db.run(sql,
			[
				approvedGroupRequest.admin_approved,
				approvedGroupRequest.student_code,
				approvedGroupRequest.course_code
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

// get the memes filtered by {sqlFilter}
exports.getFilteredMemes = (sqlFilter, userName) => {

	return new Promise((resolve, reject) => {
		const sql = sqlFilter;
		db.all(sql, [userName], (err, rows) => {
			if (err)
				reject(err);
			else if (rows == undefined)
				resolve({ error: 'Memes not found.' });
			else {
				//const memes = { ...rows };
				const memes = rows.map((meme) => dbRowToMeme(meme));
				resolve(memes);
			}
		})
	})

}
