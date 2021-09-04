import { Container, Row, Col, Table, Modal, Button, ProgressBar, Badge, Breadcrumb } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalGroupRequest from './ModalGroupRequest.js';
import dayjs from 'dayjs';


export default function GroupsTable(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { setDirty, groupsList, loggedUserGroupsList, showModal, setShowModal } = props;

	const [groupRequestInfo, setGroupRequestInfo] = useState([]);


	// generates all the groups like a table
	const getGroupsTableRows = groupsList.map((g, idx) => (

		<tr key={g.course_code}>
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
			</td>
			<td className="text-right d-none d-md-table-cell d-lg-table-cell">
				{g.course_credits} <small>CFU</small>
			</td>
			<td className="text-center d-none d-lg-table-cell">
				<small>
					since
					<span className="ml-2">
						{dayjs(g.group_creation_date).format('DD.MM.YYYY')}
					</span>
				</small>
			</td>
			<td className="text-center d-none d-sm-table-cell d-md-table-cell d-lg-table-cell">
				<small>
					{g.students_number}
				</small>
				<Icons.PeopleFill
					className="ml-2"
					color="#343a40"
					size="1em"
				/>
			</td>

			{/* Join icon (or 'member' message) */}
			{loggedUserGroupsList.map((uG) => uG.course_code).includes(g.course_code) ? (

				<>
					{loggedUserGroupsList.find((uG) => uG.course_code === g.course_code)
						.admin_approved === 1 ? (
						<td className="text-center">
							<Icons.PersonCheckFill
								className="ml-1"
								color="#28a745"
								size="1.3em"
							/>
							{/* <small className="text-muted">
						You are already a member
					</small> */}
						</td>
					) : (
						<td className="text-center">
							<Icons.EnvelopeFill
								color="#007bff"
								size="1.1em"
							/>
							{/* <small className="text-muted">
						You are already a member
					</small> */}
						</td>
					)}
				</>

			) : (

				<td className="text-center">
					<Icons.PersonPlusFill
						className="ml-1 my-cursor-pointer"
						color="#343a40"
						size="1.3em"
						onClick={() => {
							history.push(`/groups/${g.course_code}/request`);
							const reqInfo = {
								course_code: g.course_code,
								course_name: g.course_name,
								group_color: g.group_color
							};
							setGroupRequestInfo(reqInfo);
							setShowModal(true);
						}}
					/>
					{/* <small className="text-muted">
						(Send a request to become a member)
					</small> */}
				</td >

			)}

		</tr >

	))


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0 my-scrollable-container scrollbar">

					{/* Navbar */}
					<Navigation />

					{/* Groups (title and table) */}
					<Row className="mt-5 mb-3 mx-4">

						<div
							className="mt-4 mb-2 my-tablepage-title">
							Groups
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
							<tbody key="groups_tbody">

								{getGroupsTableRows}

							</tbody>
						</Table>

						{/* Modal */}
						<ModalGroupRequest
							setDirty={setDirty}
							showModal={showModal}
							setShowModal={setShowModal}
							groupRequestInfo={groupRequestInfo}
							setGroupRequestInfo={setGroupRequestInfo}
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
							key='groups_key'
							active
						>
							Groups
						</Breadcrumb.Item>
					</Breadcrumb>

				</Container>

			)}
		</>

	)
}
