import { Navbar, Container, Col, Dropdown, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CurrentUser, CurrentGroupAdminRequests } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import API from '../API.js'


export default function Navigation(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { groupAdminRequests } = useContext(CurrentGroupAdminRequests);

	const haveIGroupRequests = loggedUser.group_admin && groupAdminRequests.length !== 0;

	// go to requests page
	const goToRequests = async () => {
		history.push('/manage_requests');
	}

	// cleans up everything and logOut
	const handleLogout = async () => {
		setLoggedUser([]);
		await API.logOut();
		history.push('/');
	}


	return (

		<Navbar className="px-0" bg="dark" variant="dark" expand="md" fixed="top">
			<Container fluid>

				{/* Toggle (icon): visible only in md and lower */}
				<Col
					className="d-flex justify-content-start d-md-none pl-2"
					xs={{ span: 4, order: 1 }}
				>
					<Icons.List
						className="ml-3"
						color="white"
						size="2.3em"
					/>
				</Col>

				{/* Brand (label and icon) */}
				<Col
					className="d-flex justify-content-center justify-content-md-start"
					xs={{ span: 4, order: 2 }}
					md={{ span: 4, order: 1 }}
				>
					{/* Content left-aligned in lg and xl, center-aligned otherwise */}
					<Navbar.Brand>
						<Container className="d-inline pl-0">
							<Link to='/' className="my-link-navigation">
								<Icons.PeopleFill className="mb-1 mr-1" color="white" size="1.3em" />
								StudyGroup
							</Link>
						</Container>

					</Navbar.Brand>
				</Col>

				{/* Icon (login or user) */}
				<Col
					className="d-flex justify-content-end"
					xs={{ span: 4, order: 2 }}
					md={{ span: 8, order: 2 }}
				>
					{/* Login (message and icon) */}
					{!loggedUser.student_code ? (
						<Link to='/login' className="my-link">
							<Button
								className="pt-2"
								variant="light"
								size="sm"
							// onClick={() => setCurrentFilter(defaultFilter)}
							>
								<Container fluid className="d-none d-md-inline px-2">
									Login
								</Container>
								<Icons.BoxArrowInRight
									className="text-dark"
									color="#353A40"
									size="1.8em"
								/>
							</Button>
						</Link>
					) : (
						<Dropdown className="mr-3 mr-md-0">
							{/* User (message and icon) */}
							<Dropdown.Toggle
								className="pt-2"
								variant="light"
								size="sm"
							>

								<Container fluid
									className="d-none d-md-inline px-2">
									Welcome, <strong>{loggedUser.student_code}</strong>
								</Container>

								{haveIGroupRequests ? (

									<Icons.Envelope
										className="text-dark"
										color="red"
										size="1.6em"
									/>

								) : (

									<Icons.PersonCircle
										className="text-dark"
										color="#353A40"
										size="1.7em"
									/>

								)}

							</Dropdown.Toggle>

							{/* Logout */}
							<Dropdown.Menu className="dropdown-menu-right" variant="light">

								<Dropdown.Item
									className="text-dark mt-1 mb-2 my-dropdownitems-label"
									disabled
								>
									{`${loggedUser.student_name} ${loggedUser.student_surname}`}
								</Dropdown.Item>

								{haveIGroupRequests && (
									<>
										<hr className="mt-0 mb-0" />

										<Dropdown.Item
											className="text-danger mt-2 mb-2"
											onClick={() => goToRequests()}
										>
											<span className="my-dropdownitems-label">
												Requests ({groupAdminRequests.length})
											</span>
										</Dropdown.Item>
									</>

								)}

								<hr className="mt-0 mb-0" />

								<Dropdown.Item
									className="mt-2"
									onClick={() => handleLogout()}
								>
									Log out
								</Dropdown.Item>

							</Dropdown.Menu>

						</Dropdown>
					)}

				</Col>

			</Container>
		</Navbar >
	)

}
