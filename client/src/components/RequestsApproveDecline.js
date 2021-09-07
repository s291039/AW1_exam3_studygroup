import { Container, Row, Col, Button, Alert, Badge, Breadcrumb } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { CurrentUser, CurrentMessage, CurrentGroupAdminRequests } from '../App.js'
import Navigation from './Navigation.js';
import AddButton from './AddButton.js';
import * as Icons from 'react-bootstrap-icons';
import API from '../API.js';


export default function RequestsApproveDecline(props) {

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { message, setMessage } = useContext(CurrentMessage);
	const { groupAdminRequests } = useContext(CurrentGroupAdminRequests);

	// props passed from App
	const { dirty, setDirty } = props;


	const handleDeclineButton = (request) => {
		API.declineGroupRequest(request.student_code, request.course_code);
		setDirty(true);
	}

	const handleApproveButton = (request) => {
		API.approveGroupRequest(request.student_code, request.course_code);
		API.updateGroupsStudentsNumber(request.course_code, +1);
		setDirty(true);
	}

	const getGroupsRequestsAlerts = groupAdminRequests.map((r, idx) => (

		<Alert key={r.student_code + r.course_code} variant="primary" className="text-center">
			<Alert.Heading>
				Request <small>#{idx + 1}</small>
			</Alert.Heading>

			<hr />

			<div className="mb-3">
				User <strong>{r.student_name} {r.student_surname}</strong> ({r.student_code})
				<div>
					asked to join group
					<Badge
						className="mx-1"
						pill={false}
						style={{
							backgroundColor: r.group_color,
							color: "white", fontSize: "17px", fontWeight: "500"
						}}>
						{r.course_name}
					</Badge>
					({r.course_code})
				</div>
			</div>

			<Button
				block
				variant="outline-primary"
				onClick={() => handleApproveButton(r)}
			>
				Approve
			</Button>
			<Button
				className="my-link mt-1 mb-0 py-0"
				block
				variant="link"
				onClick={() => handleDeclineButton(r)}
			>
				Decline
			</Button>

		</Alert >

	))


	return (

		<>
			{!loggedUser.student_code || (!loggedUser.group_admin || groupAdminRequests.length === 0) ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0 my-scrollable-container scrollbar">

					{/* Navbar */}
					<Navigation />

					{/* Requests (title and list) */}
					<Row className="mt-5 mb-5 mx-4">

						<Container
							className="mt-4 my-tablepage-title">
							Requests
						</Container>

						{/* Requests */}
						<Container className="pt-3 mb-5">

							{getGroupsRequestsAlerts}

						</Container>

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
							key='requests_key'
							active
						>
							Manage requests
						</Breadcrumb.Item>
					</Breadcrumb>

				</Container>

			)}
		</>

	)

}
