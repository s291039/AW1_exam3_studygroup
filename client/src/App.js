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
// import ManageMeetingsTable from './components/ManageMeetingsTable.js';
import RequestsApproveDecline from './components/RequestsApproveDecline.js';
import API from './API.js';
import dayjs from 'dayjs';


const CurrentUserName = React.createContext();
const CurrentMessage = React.createContext();
const CurrentGroupAdminRequests = React.createContext();


export default function App() {

	const [loggedUser, setLoggedUser] = useState([]);	// at the beginning, no user logged in
	const [message, setMessage] = useState('');

	const [loading, setLoading] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [groupsList, setGroupsList] = useState([]);
	const [loggedUserGroupsList, setLoggedUserGroupsList] = useState([]);
	const [otherGroupsList, setOtherGroupsList] = useState([]);
	const [meetingsList, setMeetingsList] = useState([]);
	const [loggedUserMeetingsList, setLoggedUserMeetingsList] = useState([]);
	const [groupAdminGroups, setGroupAdminGroups] = useState([]);
	const [groupAdminRequests, setGroupAdminRequests] = useState([]);


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
			setGroupsList(groups);
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
			const userGroups = await API.getStudentGroups(loggedUser.student_code);
			setLoggedUserGroupsList(userGroups);
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
			meetings.sort((firstM, secondM) => compareByDatetime(firstM.meeting_datetime, secondM.meeting_datetime));
			setMeetingsList(meetings);
		}
		if (loggedUser.student_code || dirty) {
			getAllMeetings()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load all meetings! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getLoggedUserMeetings = async () => {
			const userMeetings = await API.getStudentMeetings(loggedUser.student_code);
			setLoggedUserMeetingsList(userMeetings);
		}
		if (loggedUser.student_code || dirty) {
			getLoggedUserMeetings()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load logged user meetings! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getGroupAdminGroups = async () => {
			const groups = await API.getGroupAdminGroups(loggedUser.student_code);
			setGroupAdminGroups(groups);
			// setDirty(true); // To force loading the first time
		}
		if (loggedUser.group_admin) {
			getGroupAdminGroups()
				.then(() => {
					setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load logged (group admin) user's groups! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [loggedUser, dirty])

	useEffect(() => {
		const getGroupAdminRequests = async () => {
			const requests = await API.getGroupAdminRequests(loggedUser.student_code);
			let requestsFullInfo = [];
			for (let i = 0; i < requests.length; i++) {
				const studentInfo = await API.getUserInfo(requests[i].student_code);
				const groupInfo = await API.getGroupInfo(requests[i].course_code);
				const req = {
					student_code: studentInfo.student_code,
					student_name: studentInfo.student_name,
					student_surname: studentInfo.student_surname,
					course_code: groupInfo.course_code,
					course_name: groupInfo.course_name,
					group_color: groupInfo.group_color
				}
				requestsFullInfo.push(req);
			}
			setGroupAdminRequests(requestsFullInfo);
			// setDirty(true); // To force loading the first time
		}
		if (loggedUser.group_admin) {
			getGroupAdminRequests()
				.then(() => {
					setLoading(false);
					// setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load logged (group admin) user's requests! Please, try again later...", type: 'danger' });
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
					<CurrentGroupAdminRequests.Provider value={{ groupAdminRequests: groupAdminRequests }}>

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

								{/* MANAGE MEETINGS path */}
								{/* <Route path='/manage_meetings' render={() => (

									<ManageMeetingsTable
										dirty={dirty}
										setDirty={setDirty}
										meetingsList={meetingsList}
										loggedUserMeetingsList={loggedUserMeetingsList}
										showModal={showModal}
										setShowModal={setShowModal}
									/>

								)} /> */}

								{/* REQUESTS path */}
								<Route path='/requests' render={() => (

									<RequestsApproveDecline
										dirty={dirty}
										setDirty={setDirty}
									/>

								)} />

							</Switch>
						</Router >

					</CurrentGroupAdminRequests.Provider>
				</CurrentMessage.Provider>
			</CurrentUserName.Provider>
		</Container >
	)

}

export { CurrentUserName, CurrentMessage, CurrentGroupAdminRequests };
