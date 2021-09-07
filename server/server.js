const express = require('express');
const { check, validationResult } = require('express-validator'); // validation middleware
const session = require('express-session'); // enable sessions
const morgan = require('morgan'); // logging middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const groupDao = require('./group-dao.js'); // module for accessing the groups in the DB
const userDao = require('./user-dao.js'); // module for accessing the users in the DB


// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
// 	// Format express-validate errors as strings
// 	return `${location}[${param}]: ${msg}`;
// }


/********************* Set up Passport *********************/

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
	new LocalStrategy(
		{ usernameField: 'student_code', passwordField: 'student_password' },
		function (studentCode, studentPassword, done) {
			userDao.checkUserInfo(studentCode, studentPassword)
				.then((user) => {
					if (!user)
						return done(null, false, { message: 'Incorrect student code and/or password.' });
					else
						return done(null, user);
				})
		}
	)
)

// serialize and de-serialize the user (user object <-> session)
// we serialize the student code and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
	done(null, user.student_code);
})

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((studentCode, done) => {
	userDao.getUserByStudentCode(studentCode)
		.then(user => {
			done(null, user); // this will be available in req.user
		}).catch(err => {
			done(err, null);
		})
})

/***********************************************************/

// init express
// const app = new express(); // FIXME: should we use new?
const app = new express();
const PORT = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// TODO: check this!
// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	else
		return res.status(401).json({ error: 'User not authenticated.' });
}

// set up the session
app.use(session({
	// by default, Passport uses a MemoryStore to keep track of the sessions
	secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
	resave: false,
	saveUninitialized: false,
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/************************ GROUP APIs ************************/

// GET /api/students/:student_code
app.get('/api/students/:student_code',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = await groupDao.getUserInfo(req.params.student_code);
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// PUT /api/students/:student_code
app.put('/api/students/:student_code',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7)
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.updateStudent(req.body.student_code, req.body.group_admin);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the user update: ${err}.` });
		}

	}
)

// POST /api/groups
app.post('/api/groups',
	[
		check('course_code').isString().isLength(7),
		check('course_name').isString().notEmpty(),
		check('course_credits').isInt().notEmpty(),
		check('group_color').isString().notEmpty(),
		check('group_creation_date').isDate(), // TODO: check this!
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		const group = {
			course_code: req.body.course_code,
			course_name: req.body.course_name,
			course_credits: req.body.course_credits,
			group_color: req.body.group_color,
			group_creation_date: req.body.group_creation_date
		}

		try {
			const result = await groupDao.createGroup(group);
			res.status(201).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the creation of new group: ${err}.` });
		}
	}
)

// POST /api/other_groups
app.post('/api/other_groups',
	[
		check('course_code').isString().isLength(7),
		check('course_name').isString().notEmpty(),
		check('course_credits').isInt().notEmpty(),
		check('group_color').isString().notEmpty()
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		const group = {
			course_code: req.body.course_code,
			course_name: req.body.course_name,
			course_credits: req.body.course_credits,
			group_color: req.body.group_color
		}

		try {
			const result = await groupDao.createOtherGroup(group);
			res.status(201).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the creation of new (other) group: ${err}.` });
		}
	}
)

// DELETE /api/groups/:course_code
app.delete('/api/groups/:course_code',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7),
	],
	async (req, res) => {
		try {
			const result = groupDao.deleteGroup(req.params.course_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of group ${req.params.course_code}.` });
		}
	}
)

// DELETE /api/other_groups/:course_code
app.delete('/api/other_groups/:course_code',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7),
	],
	async (req, res) => {
		try {
			const result = groupDao.deleteOtherGroup(req.params.course_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of (other) group ${req.params.course_code}.` });
		}
	}
)

// GET /api/groups/:course_code
app.get('/api/groups/:course_code',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = await groupDao.getGroupInfo(req.params.course_code);
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/groups
app.get('/api/groups',
	isLoggedIn,
	async (req, res) => {
		try {
			const result = await groupDao.listAllGroups();
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/other_groups
app.get('/api/other_groups',
	isLoggedIn,
	async (req, res) => {
		try {
			const result = await groupDao.listOtherGroups();
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/users/:student_code/groups
app.get('/api/users/:student_code/groups',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = await groupDao.listUserGroups(req.params.student_code);
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// PUT /api/groups/:course_code/students_number
app.put('/api/groups/:course_code/students_number',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.updateGroupStudentsNumber(req.body.course_code, req.body.update_number);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the update of group students number: ${err}.` });
		}

	}
)

// PUT /api/groups/:course_code/meetings_number
app.put('/api/groups/:course_code/meetings_number',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.updateGroupMeetingsNumber(req.body.course_code, req.body.update_number);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the update of group meetings number: ${err}.` });
		}

	}
)

// GET /api/groups/:course_code/students
app.get('/api/groups/:course_code/students',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = await groupDao.listGroupUsers(req.params.course_code);
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/groups/:course_code/meetings
app.get('/api/groups/:course_code/meetings',
	isLoggedIn,
	async (req, res) => {
		try {
			const result = await groupDao.listGroupMeetings(req.params.course_code);
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/students/:student_code/group_admin/groups
app.get('/api/students/:student_code/group_admin/groups',
	isLoggedIn,
	async (req, res) => {
		try {
			const result = await groupDao.listGroupAdminGroups(req.params.student_code);
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/meetings
app.get('/api/meetings',
	isLoggedIn,
	async (req, res) => {
		try {
			const result = await groupDao.listMeetings();
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/users/:student_code/meetings
app.get('/api/users/:student_code/meetings',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = await groupDao.listUserMeetings(req.params.student_code);
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// PUT /api/meetings/:meeting_id
app.put('/api/meetings/:meeting_id',
	isLoggedIn,
	[
		check('meeting_id').isInt({ min: 1 })
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.updateMeetingStudentsNumber(req.body.meeting_id, req.body.update_number);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the update of meeting students number: ${err}.` });
		}

	}
)

// POST /api/meetings
app.post('/api/meetings',
	[
		check('course_code').isString().isLength(7),
		check('course_name').isString().notEmpty(),
		check('meeting_datetime').isString().notEmpty(),
		check('meeting_duration').isInt().notEmpty(),
		check('meeting_place').isString().notEmpty()
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		const meeting = {
			course_code: req.body.course_code,
			course_name: req.body.course_name,
			meeting_datetime: req.body.meeting_datetime,
			meeting_duration: req.body.meeting_duration,
			meeting_place: req.body.meeting_place
		}

		try {
			const result = await groupDao.createMeeting(meeting);
			res.status(201).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the creation of new meeting: ${err}.` });
		}
	}
)

// DELETE /api/meetings/:meeting_id
app.delete('/api/meetings/:meeting_id',
	isLoggedIn,
	[
		check('meeting_id').isInt({ min: 1 })
	],
	async (req, res) => {
		try {
			const result = groupDao.deleteMeeting(req.params.meeting_id);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of meeting: ${err}.` });
		}
	}
)

// POST /api/users/:student_code/groups/:course_code/request
app.post('/api/users/:student_code/groups/:course_code/request',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('course_code').isString().isLength(7),
		check('group_admin').isIn([0, 1]),
		check('admin_approved').isInt({ value: 0 })
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		const groupRequest = {
			student_code: req.body.student_code,
			course_code: req.body.course_code,
			group_admin: req.body.group_admin,
			admin_approved: req.body.admin_approved
		}

		try {
			const result = await groupDao.createGroupRequest(groupRequest);
			res.status(201).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the creation of group request: ${err}.` });
		}

	}
)

// PUT /api/users/:student_code/groups/:course_code/request
app.put('/api/users/:student_code/groups/:course_code/request',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.approveGroupRequest(req.body.student_code, req.body.course_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the approval of group request: ${err}.` });
		}

	}
)

// DELETE /api/users/:student_code/groups/:course_code/request
app.delete('/api/users/:student_code/groups/:course_code/request',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		try {
			const result = groupDao.deleteGroupRequest(req.params.student_code, req.params.course_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of group request: ${err}.` });
		}
	}
)

// GET /api/groups/requests
app.get('/api/groups/requests',
	isLoggedIn, [],
	async (req, res) => {
		try {
			const result = await groupDao.listAllGroupsRequests();
			// if (result.error)
			// 	res.status(404).json(result);
			// else
			res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// GET /api/users/:student_code/groups/requests
app.get('/api/users/:student_code/groups/requests',
	isLoggedIn, [],
	async (req, res) => {
		try {
			const result = await groupDao.listGroupAdminRequests(req.params.student_code);
			if (result.error)
				res.status(404).json(result);
			else
				res.json(result);
		} catch (err) {
			// res.status(500).json({ error: `Database error: ${err}.` });
			res.status(500).end;
		}

	}
)

// POST /api/users/:student_code/meetings
app.post('/api/users/:student_code/meetings',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('meeting_id').isInt({ min: 1 })
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		const meetingRegistration = {
			student_code: req.body.student_code,
			meeting_id: req.body.meeting_id
		}

		try {
			const result = await groupDao.createMeetingRegistration(meetingRegistration);
			res.status(201).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the creation of new meeting registration: ${err}.` });
		}

	}
)

// DELETE /api/users/:student_code/meetings/:meeting_id
app.delete('/api/users/:student_code/meetings/:meeting_id',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('meeting_id').isInt({ min: 1 })
	],
	async (req, res) => {

		const meetingRegistration = {
			student_code: req.params.student_code,
			meeting_id: req.params.meeting_id
		}

		try {
			const result = groupDao.deleteMeetingRegistration(meetingRegistration);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of meeting registration: ${err}.` });
		}
	}
)

// DELETE /api/groups/:course_code/students/:student_code
app.delete('/api/groups/:course_code/students/:student_code',
	isLoggedIn,
	[
		check('course_code').isString().isLength(7),
		check('student_code').isString().isLength(7)
	],
	async (req, res) => {

		try {
			const result = groupDao.deleteGroupStudent(req.params.course_code, req.params.student_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the deletion of a student from a group: ${err}.` });
		}
	}
)

/************************ USER APIs ************************/

// (API: signUp) - POST /api/register
app.post('/api/register',
	[
		check('student_code').isString().isLength(7),
		check('student_name').isString(),
		check('student_surname').isString(),
		check('student_password').isString()
	],
	(req, res) => {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	res.status(400).json(errors);
		// }
		// else {

		const userInfo = {
			student_code: req.body.student_code,
			student_name: req.body.student_name,
			student_surname: req.body.student_surname,
			student_password: req.body.student_password
		};

		userDao
			.registerUser(userInfo)
			.then((result) => {
				if (!result) {
					res
						.status(409) // HTTP Conflict
						.json({ error: `Student code ${req.body.student_code} already used.` });
				} else {
					// successfully registered
					// redirect to `/api/login` to initialize session
					//res.redirect(307, '/api/login');
					res.status(200).json({ success: `Registered user: ${req.body.student_code}.` });
				}
			})
			.catch((err) => {
				res.status(500).json({ error: `Database error during the creation of new student: ${err}.` });
			})
	}
	// }
)

// (API: logIn) - POST /api/sessions
app.post('/api/sessions',
	[
		check('student_code').isString().isLength(7),
		check('student_password').isString()
	],
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err)
				next(err);
			if (!user)
				res.status(401).json(info); // display wrong login messages
			req.login(user, (err) => { // success, perform the login
				if (err)
					next(err);
				else
					// req.user contains the authenticated user, we send all the user info back
					// this is coming from userDao.getUserByEmail()
					res.json(req.user);
			})
		})(req, res, next);
	}
)

// (API: getCurrentUserInfo) - GET /api/sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current',
	(req, res) => {
		if (req.isAuthenticated())
			res.status(200).json(req.user);
		else
			res.status(401).json({ error: 'Unauthenticated user!' });
	}
)

// (API: logOut) - DELETE /api/sessions/current 
app.delete('/api/sessions/current',
	(req, res) => {
		req.logout();
		res.end();
	}
)

// PUT /api/students/:student_code/groups/:course_code
app.put('/api/users/:student_code/groups/:course_code',
	isLoggedIn,
	[
		check('student_code').isString().isLength(7),
		check('course_code').isString().isLength(7)
	],
	async (req, res) => {
		// const errors = validationResult(req).formatWith(errorFormatter); // format error message
		// if (!errors.isEmpty()) {
		// 	return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
		// }

		try {
			const result = await groupDao.setGroupAdmin(req.body.student_code, req.body.course_code);
			res.status(200).json(result).end();
		} catch (err) {
			res.status(503).json({ error: `Database error during the upgrade of a student in a group: ${err}.` });
		}

	}
)

/*********** Other express-related instructions ************/

// Activate the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}/`);
})
