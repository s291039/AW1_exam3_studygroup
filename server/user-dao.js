/* Data Access Object (DAO) module for accessing users */
const db = require('./db');
const bcrypt = require('bcrypt');


// used by Passport (in server.js)
exports.checkUserInfo = (studentCode, studentPassword) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM students WHERE student_code = ?';
		db.get(sql, [studentCode], (err, row) => {
			if (err)
				reject(err);
			else if (row === undefined)
				resolve({ error: 'User not found.' });
			else {
				const user = {
					student_code: row.student_code,
					student_name: row.student_name,
					student_surname: row.student_surname,
					group_admin: !!row.group_admin,   // from integer to boolean
					general_admin: !!row.general_admin   // from integer to boolean
				};

				// check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
				bcrypt.compare(studentPassword, row.student_password)
					.then(result => {
						if (result)
							resolve(user);
						else
							resolve(false);
					})
					.catch((error) => {
						reject(error);
					})
			}
		})
	})

}

// used by Passport
exports.getUserByStudentCode = (studentCode) => {

	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM students WHERE student_code = ?';
		db.get(sql, [studentCode], (err, row) => {
			if (err)
				reject(err);
			else if (row === undefined)
				resolve({ error: 'User not found.' });
			else {
				const user = {
					student_code: row.student_code,
					student_name: row.student_name,
					student_surname: row.student_surname,
					group_admin: row.group_admin,
					general_admin: row.general_admin
				};
				return resolve(user); // This is important!
			}
		})
	})

}

exports.registerUser = (userInfo) => {

	return new Promise((resolve, reject) => {
		exports.getUserByStudentCode(userInfo.student_code)
			.then((user) => {
				if (user.student_code == userInfo.student_code)
					resolve(false); // student code already used
				else {
					bcrypt.hash(userInfo.student_password, 10)
						.then((hashedPassword) => {
							const sql = `INSERT INTO students(student_code, student_name, student_surname, student_password, group_admin, general_admin) VALUES(?,?,?,?,?,?)`;
							db.run(sql, [userInfo.student_code, userInfo.student_name, userInfo.student_surname, hashedPassword, 0, 0],
								function (err) {
									if (err)
										reject(err);
									else
										resolve(true);	// inserted a new user in students (db table)
								})
						})
						.catch((error) => {
							reject(error);
						})
				}
			})
			.catch((error) => {
				reject(error);
			})
	})

}
