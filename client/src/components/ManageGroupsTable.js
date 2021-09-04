import { Container, Row, Col, Table, Modal, Button, Breadcrumb, Accordion, Form, Collapse, Fade, ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalGroupAddDelete from './ModalGroupAddDelete.js';
import AddButton from './AddButton.js';
import dayjs from 'dayjs';
import API from '../API.js'


export default function ManageGroupsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { otherGroupsList, setDirty, groupsList, loggedUserGroupsList, showModal, setShowModal } = props;

	const [clickedCourseCode, setClickedCourseCode] = useState('');
	const [showStudentsList, setShowStudentsList] = useState(false);
	const [clickedStudentsList, setClickedStudentsList] = useState([]);
	const [groupToDelete, setGroupToDelete] = useState([]);


	useEffect(() => {
		const getGroupStudents = async () => {
			const students = await API.getGroupStudents(clickedCourseCode);
			// console.log(students);
			// if (students !== undefined) {
			let studentsInfo = [];
			for (let i = 0; i < students.length; i++) {
				const studInfo = await API.getUserInfo(students[i].student_code);
				// console.log(studInfo);
				studentsInfo.push(studInfo);
			}
			setClickedStudentsList(studentsInfo);
			// setDirty(true);  // To force loading ? the first time
			// }
			// else {
			// 	setClickedStudentsList([]);
			// }
		}
		if (clickedCourseCode !== '') {
			getGroupStudents()
				// .then(() => {
				// 	setLoading(false);
				//  setDirty(false);
				// })
				.catch((err) => {
					setMessage({ msg: "Impossible to load the students! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [clickedCourseCode])


	const getStudentsTableRows = clickedStudentsList.map((s, idx) => (

		<tr key={s.student_code}>

			<td className="text-left">
				<span className="ml-4">
					<small className="ml-1">
						#
					</small>
					{idx + 1}
				</span>
				<u className="ml-3">
					{s.student_code}
				</u>
				<span className="ml-3 d-none d-md-inline d-lg-inline">
					{s.student_name}
				</span>
				<span className="ml-3 d-none d-sm-inline d-md-inline d-lg-inline">
					{s.student_surname}
				</span>
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
				<Icons.TrashFill
					className="my-cursor-pointer"
					color="red"
					size="0.9em"
					onClick={() => {
						// history.push(`/general_admin/groups/${g.course_code}/delete`);

						// API.removeGroup(g.course_code);
						setShowModal(true);
					}}
				/>
			</td>
			<td className="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			<td className="d-none d-md-table-cell d-lg-table-cell"></td>
			<td></td>

		</tr>

	))


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
							{!showStudentsList && (clickedCourseCode === '') && (

								<Icons.ArrowDownCircleFill
									className="ml-2 my-cursor-pointer"
									onClick={() => {
										setClickedCourseCode(g.course_code);
										setShowStudentsList(!showStudentsList);
									}}
									color="#343a40"
									size="1em"
								/>

							)}

							{showStudentsList && (clickedCourseCode === g.course_code) && (

								<Icons.ArrowUpCircleFill
									className="ml-2 my-cursor-pointer"
									onClick={() => {
										setClickedCourseCode('');
										setClickedStudentsList([]);
										setShowStudentsList(!showStudentsList);
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
							{dayjs(g.group_creation_date).format('YYYY.MM.DD')}
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

			{showStudentsList && (clickedCourseCode === g.course_code) && (
				<>
					{getStudentsTableRows}
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
					<Row className="mt-5 mb-3 mx-4">

						<div
							className="mt-4 mb-2 my-tablepage-title">
							Manage groups
						</div>

						<Table responsive={false} bordered={false} striped={false} hover size="md">
							{/* <thead>
								<tr>
									<th className="text-left">
										Course
									</th>
									<th className="text-right d-none d-md-table-cell d-lg-table-cell">
										CFU
									</th>
									<th className="text-right d-none d-md-table-cell d-lg-table-cell">
										Creation
									</th>
									<th className="text-center d-none d-sm-table-cell d-md-table-cell d-lg-table-cell">
										#Students
									</th>
									<th className="text-center">
										Status
									</th>
								</tr>
							</thead> */}
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

					<Link to={'/manage_groups/add'}>
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
