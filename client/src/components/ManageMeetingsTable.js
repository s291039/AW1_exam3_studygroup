import { Container, Row, Col, Table, Modal, Button, Breadcrumb, Accordion, Form, Collapse, Fade, ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalGroupAddDelete from './ModalGroupAddDelete.js';
import ModalGroupStudentRemove from './ModalGroupStudentRemove.js';
import AddButton from './AddButton.js';
import dayjs from 'dayjs';
import API from '../API.js'


export default function ManageMeetingsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { dirty, setDirty, meetingsList, loggedUserMeetingsList, showModal, setShowModal } = props;

	const [meetingToDelete, setMeetingToDelete] = useState([]);
	const [groupStudentToRemove, setGroupStudentToRemove] = useState([]);


	// generates all the groups like a table
	const getGroupsTableRows = groupsList.map((g, idx) => (

		<>
			<tr key={idx}>
				<td className="text-left">
					<Icons.CircleFill
						color={g.group_color}
						size="1.2em"
					/>
					<span className="ml-2 my-course-name">
						{g.course_name}
					</span>
					<span className="ml-2 d-none d-md-inline d-lg-inline">
						(<u>{g.course_code}</u>)
					</span>

					{g.group_students_number !== 0 && (

						<>
							{/* TODO: check this! */}
							{!showLists && (Object.keys(clickedGroup).length === 0) && (

								<Icons.ArrowDownCircleFill
									className="ml-2 my-cursor-pointer"
									onClick={() => {
										const cG = {
											course_code: g.course_code,
											course_name: g.course_name,
											group_color: g.group_color
										}
										setClickedGroup(cG);
										setShowLists(!showLists);
									}}
									color="#343a40"
									size="1em"
								/>

							)}

							{showLists && (clickedGroup.course_code === g.course_code) && (

								<Icons.ArrowUpCircleFill
									className="ml-2 my-cursor-pointer"
									onClick={() => {
										setClickedGroup([]);
										setClickedStudentsList([]);
										setClickedMeetingsList([]);
										setShowLists(!showLists);
									}}
									color="#343a40"
									size="1em"
								/>

							)}
						</>

					)}

				</td>
				<td className="text-right d-none d-md-table-cell d-lg-table-cell">
					{g.course_credits} <small>CFU</small>
				</td>
				<td className="text-center d-none d-lg-table-cell">
					<small>
						since
						<span className="ml-2">
							{dayjs(g.group_creation_date).format('YYYY/MM/DD')}
						</span>
					</small>
				</td>
				<td className="text-center d-none d-sm-table-cell d-md-table-cell d-lg-table-cell">
					<small className={g.group_students_number === 0 ? "text-warning" : "text-dark"}>
						{g.group_students_number}
					</small>
					<Icons.PeopleFill
						className="ml-2"
						color={g.group_students_number === 0 ? "#f6c93c" : "#343a40"}
						size="1em"
					/>
				</td>
				<td className="text-center d-none d-sm-table-cell d-md-table-cell d-lg-table-cell">
					<small className={g.group_meetings_number === 0 ? "text-warning" : "text-dark"}>
						{g.group_meetings_number}
					</small>
					<Icons.Calendar2WeekFill
						className="ml-2"
						color={g.group_meetings_number === 0 ? "#f6c93c" : "#343a40"}
						size="1em"
					/>
				</td>
				<td className="text-center">
					<Icons.TrashFill
						className="my-cursor-pointer"
						color="red"
						size="1.1em"
						onClick={() => {
							history.push(`/manage_groups/${g.course_code}/delete`);
							const gToDel = {
								course_code: g.course_code,
								course_name: g.course_name,
								course_credits: g.course_credits,
								group_color: g.group_color
							};
							setGroupToDelete(gToDel);
							setShowModal(true);
						}}
					/>
				</td>
			</tr>

			{showLists && (clickedGroup.course_code === g.course_code) && (
				<>
					{getStudentsTableRows}
					{getMeetingsTableRows}
				</>
			)}

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
					<Row className="mt-5 mb-3 mx-4">

						<div
							className="mt-4 mb-2 my-tablepage-title">
							Manage meetings
						</div>

						<Table responsive={false} bordered={false} striped={false} hover size="md">
							<tbody key="manage_meetings_tbody">

								{getGroupsTableRows}

							</tbody>
						</Table>

						{/* Modal */}
						<ModalMeetingAddDelete
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
							key='manage_groups_key'
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
