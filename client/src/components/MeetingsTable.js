import { Container, Row, Col, Table, Modal, Button, ProgressBar, Badge, Breadcrumb } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalMeetingRegistration from './ModalMeetingRegistration.js';
import dayjs from 'dayjs';


export default function MeetingsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { setDirty, groupsList, meetingsList, loggedUserMeetingsList, showModal, setShowModal } = props;

	const [meetingRegistrationInfo, setMeetingRegistrationInfo] = useState([]);


	const getGroupColor = (meetingCourseName) => {
		const groupColor = groupsList.find((g) => g.course_name === meetingCourseName).group_color;
		return groupColor;
	}

	const getCourseCode = (meetingCourseName) => {
		const courseCode = groupsList.find((g) => g.course_name === meetingCourseName).course_code;
		return courseCode;
	}

	// generates all the meetings like a table
	const getMeetingsTableRows = meetingsList
		.filter((m) => dayjs(m.meeting_datetime).isAfter(dayjs()))
		.map((m, idx) => (

			<>
				<tr key={m.meeting_id + m.meeting_datetime}>

					<td className="text-left">

						{loggedUserMeetingsList.map((uM) => uM.meeting_id).includes(m.meeting_id) ? (
							<span className="text-left container-calendars-icons">
								<Icons.Calendar2CheckFill
									className="calendar-icon-1 my-cursor-pointer"
									color="#007bff"
									size="1.1em"
								/>
								<Icons.Calendar2XFill
									className="calendar-icon-2 my-cursor-pointer"
									color="#dc3545"
									size="1.1em"
									onClick={() => {
										history.push(`/meetings/${m.meeting_id}/deregistration`);
										const meetingInfo = {
											meeting_id: m.meeting_id,
											course_name: m.course_name,
											meeting_datetime: m.meeting_datetime,
											group_color: groupsList.find((g) => g.course_name === m.course_name).group_color
										};
										setMeetingRegistrationInfo(meetingInfo);
										setShowModal(true);
									}}
								/>
								{/* <small className="text-muted">
						You are already a member
					</small> */}
							</span>
						) : (
							<span className="text-left">
								<Icons.Calendar2PlusFill
									className="my-cursor-pointer"
									color="#343a40"
									size="1.1em"
									onClick={() => {
										history.push(`/meetings/${m.meeting_id}/registration`);
										const meetingInfo = {
											meeting_id: m.meeting_id,
											course_name: m.course_name,
											meeting_datetime: m.meeting_datetime,
											group_color: groupsList.find((g) => g.course_name === m.course_name).group_color
										};
										setMeetingRegistrationInfo(meetingInfo);
										setShowModal(true);
									}}
								/>
								{/* <small className="text-muted">
						(Send a request to become a member)
					</small> */}
							</span >
						)}

						<span className="ml-2 my-meeting-datetime">
							{dayjs(m.meeting_datetime).format('YYYY/MM/DD')}
						</span>
						<span className="ml-2 d-none d-sm-inline d-md-inline d-lg-inline ">
							(<u>{m.meeting_place}</u>)
						</span>
					</td>
					<td className="text-right">
						<Icons.ClockFill
							className="d-none d-sm-inline d-md-inline d-lg-inline"
							color="#343a40"
							size="1em"
						/>
						<span className="ml-2 my-meeting-datetime">
							{dayjs(m.meeting_datetime).format('HH:mm')}
							<span className="d-none d-sm-inline d-md-inline d-lg-inline">
								{" - "}
								{dayjs(m.meeting_datetime).add(m.meeting_duration, 'minute').format('HH:mm')}
							</span>
						</span>
					</td>

				</tr>
				<tr key={m.meeting_id + m.course_code}>

					<td className="text-left">
						<Icons.CircleFill
							color={getGroupColor(m.course_name)}
							size="1.2em"
						/>
						<span className="ml-2">
							{m.course_name}
						</span>
					</td>
					<td className="text-right">
						<small>
							{m.students_number}
						</small>
						<Icons.PeopleFill
							className="ml-2"
							color="#343a40"
							size="1em"
						/>
					</td>

				</tr>
			</>

		))


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0 my-scrollable-container scrollbar">

					{/* Navbar */}
					<Navigation />

					{/* Meetings  (title and table) */}
					<Row className="mt-5 mb-3 mx-4">

						<div className="mt-4 mb-2 my-tablepage-title">
							Meetings
						</div>

						<Table bordered={false} striped hover size="md">
							{/* <thead>
								<tr>

									{[
										'Course',
										'Datetime (start-end?)',
										'Duration (min)',
										'Place',
										'#Students',
										'Status'
									].map((label, idx) => (
										<th key={idx} className="text-left">
											{label}
										</th>
									))}

									<th className="text-left">
										Course
									</th>
									<th className="text-left">
										Date
									</th>
									<th className="text-left d-none d-md-table-cell d-lg-table-cell">
										Time
									</th>
									<th className="text-left d-none d-md-table-cell d-lg-table-cell">
										Duration
									</th>
									<th className="text-left d-none d-md-table-cell d-lg-table-cell">
										Place
									</th>
									<th className="text-center d-none d-md-table-cell d-lg-table-cell">
										#Students
									</th>
									<th className="text-center">
										Status
									</th>
								</tr>
							</thead> */}
							<tbody key="meetings_tbody">

								{getMeetingsTableRows}

							</tbody>
						</Table>

						<Container>

						</Container>

						{/* Modal */}
						<ModalMeetingRegistration
							setDirty={setDirty}
							showModal={showModal}
							setShowModal={setShowModal}
							meetingRegistrationInfo={meetingRegistrationInfo}
							setMeetingRegistrationInfo={setMeetingRegistrationInfo}
						/>

					</Row>

					{/* Breadcrumb */}
					<Breadcrumb className="my-breadcrumb-location">
						<Breadcrumb.Item
							key='selection_key'
							linkAs={Link}
							linkProps={{ to: '/selection' }}
						>
							Selection
						</Breadcrumb.Item>
						<Breadcrumb.Item
							key='meetings_key'
							active
						>
							Meetings
						</Breadcrumb.Item>
					</Breadcrumb>

				</Container>

			)}
		</>

	)

}
