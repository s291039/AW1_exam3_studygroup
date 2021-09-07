import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { CurrentUser, CurrentMessage, CurrentGroupAdminRequests } from '../App.js'
import Navigation from './Navigation.js';
import * as Icons from 'react-bootstrap-icons';


export default function SelectionPage(props) {

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { message, setMessage } = useContext(CurrentMessage);
	const { groupAdminRequests } = useContext(CurrentGroupAdminRequests);

	// const [sidebarCollapse, setSidebarCollapse] = useState(false);


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0 my-scrollable-container scrollbar">

					{/* Navbar */}
					<Row>
						<Col>
							<Navigation groupAdminRequests={groupAdminRequests} />
						</Col>
					</Row>

					{/* Selection */}
					<Container className="my-homepage mt-5 mb-5">

						<Icons.PersonCircle
							className="mt-3" color="#353a40" size="5em" />
						<div className="mb-2">
							<small>
								{(!loggedUser.general_admin && !loggedUser.group_admin) && "Student"}
								{(!loggedUser.general_admin && loggedUser.group_admin) && "Group Administator"}
								{(loggedUser.general_admin && !loggedUser.group_admin) && "General Administator"}
								{(loggedUser.general_admin && loggedUser.group_admin) && "Administrator"}
							</small>
						</div>

						<Row className="d-flex justify-content-center">
							<Link to='/groups'>
								<Button
									className="my-button mt-4 mb-2"
									variant="primary"
									size="lg"
									block
								>
									Groups
								</Button>
							</Link>
						</Row>

						<Row className="d-flex justify-content-center">
							<Link to='/meetings'>
								<Button
									className="my-button mb-2"
									variant="primary"
									size="lg"
									block
								>
									Meetings
								</Button>
							</Link>
						</Row>

						{(loggedUser.general_admin || loggedUser.group_admin) && (
							<Row className="d-flex justify-content-center">
								<Link to='/manage_groups'>
									<Button
										className="my-button mb-2"
										variant="primary"
										size="lg"
										block
									>
										Manage groups
									</Button>
								</Link>
							</Row>
						)}

						{(loggedUser.group_admin) && (
							<Row className="d-flex justify-content-center">
								<Link to='/manage_meetings'>
									<Button
										className="my-button mb-2"
										variant="primary"
										size="lg"
										block
									>
										Manage meetings
									</Button>
								</Link>
							</Row>
						)}

					</Container >

				</Container >

			)}
		</>

	)

}
