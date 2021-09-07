import { Container, Row, Col, Table, Modal, Button, Breadcrumb, Accordion, Form, Collapse, Fade, ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUser, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalGroupAddDelete from './ModalGroupAddDelete.js';
import ModalGroupStudentRemove from './ModalGroupStudentRemove.js';
import AddButton from './AddButton.js';
import dayjs from 'dayjs';
import API from '../API.js'


export default function ManageGroupsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { otherGroupsList, dirty, setDirty, groupsList, loggedUserGroupsList, groupAdminGroups, showModal, setShowModal } = props;

	const [clickedGroup, setClickedGroup] = useState([]);
	const [showLists, setShowLists] = useState(false);
	const [clickedStudentsList, setClickedStudentsList] = useState([]);
	const [clickedMeetingsList, setClickedMeetingsList] = useState([]);
	const [groupToDelete, setGroupToDelete] = useState([]);
	const [groupStudentToRemove, setGroupStudentToRemove] = useState([]);
	const [showStudentRemoveModal, setShowStudentRemoveModal] = useState(false);

	const adminGroupsList = (loggedUser.group_admin && !loggedUser.general_admin) ? groupAdminGroups : groupsList;


	useEffect(() => {
		const getGroupStudents = async () => {
			const students = await API.getGroupStudents(clickedGroup.course_code);
			let studentsInfo = [];
			for (let i = 0; i < students.length; i++) {
				const studInfo = await API.getUserInfo(students[i].student_code);
				studentsInfo.push(studInfo);
			}
			setClickedStudentsList(studentsInfo);
		}
		const getGroupMeetings = async () => {
			const meetings = await API.getGroupMeetings(clickedGroup.course_code);
			setClickedMeetingsList(meetings);
		}
		if (Object.keys(clickedGroup).length !== 0 || dirty) {
			getGroupStudents()
				// .then(() => {
				// 	setLoading(false);
				//  setDirty(false);
				// })
				.catch((err) => {
					setMessage({ msg: "Impossible to load group's students! Please, try again later...", type: 'danger' });
					console.error(err);
				})
			getGroupMeetings()
				.then(() => {
					// setLoading(false);
					setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to load group's meetings! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [clickedGroup, dirty])


	const getStudentsTableRows = clickedStudentsList.map((s, idx) => (

		<tr key={s.student_code}>

			<td className="text-left">

				<span className="ml-4">
					<Icons.PersonBadge
						color="#343a40"
						size="1.1em"
					/>
					<strong className="ml-1">
						{s.student_code}
					</strong>
				</span>

				<span>
					<span className="ml-3 d-none d-md-inline d-lg-inline">
						{s.student_name}
					</span>
					<span className="ml-1 d-none d-sm-inline d-md-inline d-lg-inline">
						{s.student_surname}
					</span>
				</span>

				{loggedUser.general_admin && (

					<>
						{/* FIXME: fix this! */}
						<small className="ml-3">
							<Form.Switch
								size="sm"
								custom
								inline
								type="switch"
								label="group admin"
								id={'group_admin' + s.student_code}
								checked={s.group_admin}
								onChange={() => {
									API.updateStudent(s.student_code, !s.group_admin);
									// TODO: check this!
									const cSFound = clickedStudentsList.find((cS) => cS.student_code === s.student_code);
									cSFound.group_admin = !s.group_admin;
									const modStudList = clickedStudentsList.map((cS) =>
										cS.student_code === s.student_code ? cSFound : cS
									);
									// console.log(modStudList);
									setClickedStudentsList(modStudList);
								}}
							/>
						</small>
					</>

				)}

				{loggedUser.group_admin && (

					<Icons.TrashFill
						className={(loggedUser.group_admin && !loggedUser.general_admin) ? "ml-3" : "ml-1" + " my-cursor-pointer"}
						color="red"
						size="0.9em"
						onClick={() => {
							history.push(`/manage_groups/${clickedGroup.course_code}/students/${s.student_code}/delete`);
							const gSToRemove = {
								student_code: s.student_code,
								course_code: clickedGroup.course_code,
								course_name: clickedGroup.course_name,
								group_color: clickedGroup.group_color
							};
							setGroupStudentToRemove(gSToRemove);
							setShowStudentRemoveModal(true);
						}}
					/>

				)}

			</td>
			<td className="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			{loggedUser.general_admin && (
				<td></td>
			)}

		</tr>

	))

	const getMeetingsTableRows = clickedMeetingsList.map((m, idx) => (

		<tr key={m.meeting_id}>

			<td className="text-left">

				<span className="ml-4">
					<Icons.Calendar2Event
						className="ml-4"
						color="#343a40"
						size="1em"
					/>
					<span className="ml-1 my-meeting-datetime">
						{dayjs(m.meetings_datetime).format("YYYY/MM/DD")}
					</span>
				</span>

				<span>
					<Icons.Clock
						className="ml-4"
						color="#343a40"
						size="1em"
					/>
					<span className="ml-1 my-meeting-datetime">
						{dayjs(m.meeting_datetime).format('HH:mm')}
						<span className="d-none d-md-inline d-lg-inline">
							{" - "}
							{dayjs(m.meeting_datetime).add(m.meeting_duration, 'minute').format('HH:mm')}
						</span>
					</span>
				</span>

				<span className="ml-4">
					<Icons.PinMap
						color="#343a40"
						size="1em"
					/>
					<span className="ml-1">
						{m.meeting_place}
					</span>
				</span>

			</td>
			<td className="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			{loggedUser.general_admin && (
				<td></td>
			)}

		</tr>

	))


	// generates all the groups like a table
	const getGroupsTableRows = adminGroupsList.map((g, idx) => (

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
				{loggedUser.general_admin && (
					<td className="text-right">

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
				)}
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

					{/* Manage groups (title and table) */}
					<Row className="mt-5 mb-5 mx-4">

						<div
							className="mt-4 mb-2 my-tablepage-title">
							Manage groups
						</div>

						<Table responsive={false} bordered={false} striped={false} hover size="md">
							<tbody key="manage_groups_tbody">

								{getGroupsTableRows}

							</tbody>
						</Table>

						{/* Modal */}
						<ModalGroupAddDelete
							otherGroupsList={otherGroupsList}
							setDirty={setDirty}
							showModal={showModal}
							setShowModal={setShowModal}
							groupToDelete={groupToDelete}
							setGroupToDelete={setGroupToDelete}
						/>

						{/* Modal */}
						<ModalGroupStudentRemove
							setDirty={setDirty}
							showStudentRemoveModal={showStudentRemoveModal}
							setShowStudentRemoveModal={setShowStudentRemoveModal}
							groupStudentToRemove={groupStudentToRemove}
							setGroupStudentToRemove={setGroupStudentToRemove}
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
							Manage groups
						</Breadcrumb.Item>
					</Breadcrumb>

					{loggedUser.general_admin && (
						<Link to={'/manage_groups/add'}>
							<AddButton
								showModal={showModal}
								setShowModal={setShowModal}
							/>
						</Link>
					)}

				</Container>

			)}
		</>

	)
}
