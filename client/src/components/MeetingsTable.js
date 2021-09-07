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

	// TODO: check if I need this!
	const getCourseCode = (meetingCourseName) => {
		const courseCode = groupsList.find((g) => g.course_name === meetingCourseName).course_code;
		return courseCode;
	}

	// generates all the meetings like table rows
	const getMeetingsTableRows = meetingsList
		.filter((m) => dayjs(m.meeting_datetime).isAfter(dayjs())) // get future meetings
		.map((m, idx) => (

			<>

				{/* Meeting info: date, place and time */}
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
											meeting_duration: m.meeting_duration,
											group_color: groupsList.find((g) => g.course_name === m.course_name).group_color
										};
										setMeetingRegistrationInfo(meetingInfo);
										setShowModal(true);
									}}
								/>

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

				{/* Meeting info: group name and students number */}
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
							{m.meeting_students_number}
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

							<tbody key="meetings_tbody">

								{getMeetingsTableRows}

							</tbody>

						</Table>

						{/* Modal */}
						<ModalMeetingRegistration
							setDirty={setDirty}
							showModal={showModal}
							setShowModal={setShowModal}
							loggedUserMeetingsList={loggedUserMeetingsList}
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
