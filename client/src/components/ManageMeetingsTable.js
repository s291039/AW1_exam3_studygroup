import { Container, Row, Col, Table, Modal, Button, Breadcrumb, Accordion, Form, Collapse, Fade, ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUser, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalMeetingAddDelete from './ModalMeetingAddDelete.js';
import AddButton from './AddButton.js';
import API from '../API.js'
import dayjs from 'dayjs';


export default function ManageMeetingsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { setDirty, groupsList, meetingsList, loggedUserMeetingsList, showModal, setShowModal } = props;

	const [meetingToDelete, setMeetingToDelete] = useState([]);


	const getGroupColor = (meetingCourseName) => {
		const groupColor = groupsList.find((g) => g.course_name === meetingCourseName).group_color;
		return groupColor;
	}

	// generates all the meetings like table rows
	const getMeetingsTableRows = meetingsList
		.map((m, idx) => (

			<>

				{/* Meeting info: date, place and time */}
				<tr key={m.meeting_id + m.meeting_datetime}>

					<td className="text-left">

						<span className="text-left">
							<Icons.Calendar2EventFill
								color="#343a40"
								size="1.1em"
							/>
						</span >

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
						<Icons.TrashFill
							className="my-cursor-pointer ml-4"
							color="red"
							size="1.1em"
							onClick={() => {
								history.push(`/manage_meetings/${m.meeting_id}/delete`);
								const mToDel = {
									meeting_id: m.meeting_id,
									course_code: m.course_code,
									course_name: m.course_name,
									group_color: getGroupColor(m.course_name),
									meeting_datetime: m.meeting_datetime,
									meeting_students_number: m.meeting_students_number
								};
								setMeetingToDelete(mToDel);
								setShowModal(true);
							}}
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

					{/* Manage meetings (title and table) */}
					<Row className="mt-5 mb-5 mx-4">

						<div className="mt-4 mb-2 my-tablepage-title">
							Manage meetings
						</div>

						<Table bordered={false} striped hover size="md">

							<tbody>

								{getMeetingsTableRows}

							</tbody>

						</Table>

						{/* Modal */}
						<ModalMeetingAddDelete
							groupsList={groupsList}
							setDirty={setDirty}
							showModal={showModal}
							setShowModal={setShowModal}
							meetingToDelete={meetingToDelete}
							setMeetingToDelete={setMeetingToDelete}
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
							key='manage_meetings_key'
							active
						>
							Manage meetings
						</Breadcrumb.Item>
					</Breadcrumb>

					<Link to={'/manage_meetings/add'}>
						<AddButton
							showModal={showModal}
							setShowModal={setShowModal}
						/>
					</Link>

				</Container>

			)}
		</>

	)

}
