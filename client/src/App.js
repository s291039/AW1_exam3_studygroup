import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import LoginSignupForm from './components/LoginSignupForm.js';
import SelectionPage from './components/SelectionPage.js';
import GroupsTable from './components/GroupsTable.js';
import MeetingsTable from './components/MeetingsTable.js';
import ManageGroupsTable from './components/ManageGroupsTable.js';
import API from './API.js';
import dayjs from 'dayjs';


const CurrentUserName = React.createContext();
const CurrentMessage = React.createContext();


export default function App() {

	const [loggedUser, setLoggedUser] = useState([]);	// at the beginning, no user logged in
	// const [loggedUserName, setLoggedUserName] = useState('');	// at the beginning, no user logged in
	// const [loggedUserRole, setLoggedUserRole] = useState('');	// at the beginning, no user logged in
	const [message, setMessage] = useState('');

	const [loading, setLoading] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [groupsList, setGroupsList] = useState([]);
	const [loggedUserGroupsList, setLoggedUserGroupsList] = useState([]);
	const [otherGroupsList, setOtherGroupsList] = useState([]);
	const [meetingsList, setMeetingsList] = useState([]);
	const [loggedUserMeetingsList, setLoggedUserMeetingsList] = useState([]);


	const compareByDatetime = (a, b) => {
		if (dayjs(a).isBefore(dayjs(b)))
			return -1;
		else if (dayjs(a).isAfter(dayjs(b)))
			return 1;
		else
			return 0;
	}

	// handles db errors (and show them with toasts)
	// const handleErrors = (err) => {
	// 	if (err.errors)
	// 		setMessage({ text: err.errors[0].msg + ': ' + err.errors[0].param });
	// 	else
	// 		setMessage({ text: err.error });
	// 	console.log("Errors" + JSON.stringify(err));
	// }

	// TODO: check this!
	// checks if user is logged in
	// useEffect(() => {
	// 	const checkLoggedIn = async () => {
	// 		try {
	// 			// here you have the user info, if already logged in
	// 			const user = await API.getUserInfo();
	// 			setLoggedUser(user.name);
	// 		} catch (err) {
	// 			console.log(err.error); // mostly unauthenticated user
	// 		}
	// 	}
	// 	checkLoggedIn();
	// }, [])


	useEffect(() => {
		const getAllGroups = async () => {
			const groups = await API.getAllGroups();
			for (let i = 0; i < groups.length; i++) {
				const group_students_number = await API.getGroupStudentsNumber(groups[i].course_code);
				// console.log(group_students_number[0].students_number);
				groups[i].students_number = group_students_number[0].students_number;
			}
			setGroupsList(groups);
			// setDirty(true);  // To force loading ? the first time
		}
		if (loggedUser.student_code || dirty) {
			getAllGroups()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load all groups! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getLoggedUserGroups = async () => {
			const userGroups = await API.getStudentGroups('s291039');
			setLoggedUserGroupsList(userGroups);
			// setDirty(true);  // To force loading ? the first time
		}
		if (loggedUser.student_code || dirty) {
			getLoggedUserGroups()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load logged user groups! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getOtherGroups = async () => {
			const otherGroups = await API.getOtherGroups();
			setOtherGroupsList(otherGroups);
			// setDirty(true);  // To force loading ? the first time
		}
		if (loggedUser.student_code || dirty) {
			getOtherGroups()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load other groups! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getAllMeetings = async () => {
			const meetings = await API.getAllMeetings();
			for (let i = 0; i < meetings.length; i++) {
				const meeting_students_number = await API.getMeetingStudentsNumber(meetings[i].meeting_id);
				// console.log(meeting_students_number[0].students_number);
				meetings[i].students_number = meeting_students_number[0].students_number;
			}
			meetings.sort((firstM, secondM) => compareByDatetime(firstM.meeting_datetime, secondM.meeting_datetime));
			setMeetingsList(meetings);
			// setDirty(true);  // To force loading ? the first time
		}
		if (loggedUser.student_code || dirty) {
			getAllMeetings()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load all the meetings! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getLoggedUserMeetings = async () => {
			const userMeetings = await API.getStudentMeetings('s291039');
			setLoggedUserMeetingsList(userMeetings);
			// setDirty(true);  // To force loading ? the first time
		}
		if (loggedUser.student_code || dirty) {
			getLoggedUserMeetings()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch(err => {
					setMessage({ msg: "Impossible to load user meetings! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])


	return (

		<Container fluid className="my-app mx-0 px-0">
			<CurrentUserName.Provider
				value={{ loggedUser: loggedUser, setLoggedUser: setLoggedUser }}
			>
				<CurrentMessage.Provider value={{ message: message, setMessage: setMessage }}>

					{/* <Toast
						className="p-3"
						position="top-end"
						show={error !== ''}
						delay={3000}
						autohide
						onClose={() => setMessage('')}
					>
						<Toast.Header closeButton={false}>
							<strong className="me-auto">Error</strong>
						</Toast.Header>
						<Toast.Body>
							{error.msg}
						</Toast.Body>
					</Toast> */}

					<Router>
						<Switch>

							<Redirect exact from="/" to='/login' />

							{/* LOGIN path */}
							<Route exact path='/login' render={() => (

								<LoginSignupForm
									loading={loading}
									setLoading={setLoading}
								/>

							)} />

							{/* SIGNUP path */}
							<Route exact path='/signup' render={() => (

								<LoginSignupForm
									loading={loading}
									setLoading={setLoading}
								/>

							)} />

							{/* MAIN path */}
							<Route path='/selection' render={() => (

								<SelectionPage />

							)} />

							{/* GROUPS REQUEST path */}
							{/* <Route exact path='/groups/request' render={() => (

								<ModalGroupRequest />

							)} /> */}

							{/* GROUPS path */}
							<Route path='/groups' render={() => (

								<GroupsTable
									setDirty={setDirty}
									groupsList={groupsList}
									loggedUserGroupsList={loggedUserGroupsList}
									showModal={showModal}
									setShowModal={setShowModal}
								/>

							)} />


							{/* MEETINGS path */}
							<Route path='/meetings' render={() => (

								<MeetingsTable
									setDirty={setDirty}
									groupsList={groupsList}
									meetingsList={meetingsList}
									loggedUserMeetingsList={loggedUserMeetingsList}
									showModal={showModal}
									setShowModal={setShowModal}
								/>

							)} />

							{/* MANAGE GROUPS path */}
							<Route path='/manage_groups' render={() => (

								<ManageGroupsTable
									otherGroupsList={otherGroupsList}
									dirty={dirty}
									setDirty={setDirty}
									groupsList={groupsList}
									loggedUserGroupsList={loggedUserGroupsList}
									showModal={showModal}
									setShowModal={setShowModal}
								/>

							)} />

						</Switch>
					</Router >

				</CurrentMessage.Provider>
			</CurrentUserName.Provider>
		</Container >
	)

}

export { CurrentUserName, CurrentMessage };
