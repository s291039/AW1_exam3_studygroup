import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import Navigation from './Navigation.js';
import SidebarFilters from './SidebarFilters.js';
import AddButton from './AddButton.js';
import * as Icons from 'react-bootstrap-icons';


export default function SelectionPage(props) {

	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	const [sidebarCollapse, setSidebarCollapse] = useState(false);


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0 my-scrollable-container scrollbar">

					{/* Navbar */}
					<Row>
						<Col>
							<Navigation />
						</Col>
					</Row>

					{/* Selection */}
					<Container className="my-homepage mt-5 mb-5">

						<Icons.PersonCircle
							className="mt-3" color="#353a40" size="5em" />
						<div className="mb-3">
							<small>
								{(!loggedUser.group_admin && !loggedUser.general_admin) && "Student"}
								{(loggedUser.group_admin) && "Group Administator"}
								{(loggedUser.general_admin) && "General Administator"}
							</small>
						</div>

						<h3 className="mb-2 font-weight-normal">
							I'm here for
						</h3>

						<Row className="d-flex justify-content-center">
							<Link to='/groups'>
								<Button
									className="my-button mb-2"
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

						{(loggedUser.group_admin) && (
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

					</Container >

				</Container >

			)}
		</>

	)

}
