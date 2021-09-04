import { Navbar, Container, Col, Dropdown, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CurrentUserName } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import API from '../API.js'


export default function Navigation(props) {

	const history = useHistory();

	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);

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
									{`Hi, ${loggedUser.student_name}!`}
								</Container>
								<Icons.PersonCircle
									className="text-dark"
									color="#353A40"
									size="1.7em"
								/>

							</Dropdown.Toggle>

							{/* Logout */}
							<Dropdown.Menu className="dropdown-menu-right" variant="light">
								<Dropdown.Item
									onClick={() => handleLogout()} >
									{/* <Link to='/' className="my-link"> */}
									Log out
									{/* </Link> */}
								</Dropdown.Item>
							</Dropdown.Menu>

						</Dropdown>
					)}

				</Col>

			</Container>
		</Navbar >
	)

}
