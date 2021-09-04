import { Container, Row, Col, Table, Modal, Button, ProgressBar, Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import Navigation from './Navigation.js';
import ModalGroupRequest from './ModalGroupRequest.js';


export default function MeetingsCalendar(props) {

	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Container fluid className="mx-0 px-0">


					{/* Navbar */}
					<Navigation />

					{/* Meetings calendar */}
					<Row className="mx-2 mt-2">
						<Table bordered size="md">
							<Row>
								<Col className="pt-2">
									<Icons.CaretLeftFill
										className="my-cursor-pointer"
										color="#343a40"
										size="1.6em"
									/>
								</Col>
								<Col>
									<h2>
										March
									</h2>
								</Col>
								<Col className="pt-2">
									<Icons.CaretRightFill
										className="my-cursor-pointer"
										color="#343a40"
										size="1.6em"
									/>
								</Col>
							</Row>
						</Table>
					</Row>

					<Row className="mx-2">
						<Table bordered size="md">
							<thead>
								<tr>
									<th className="text-muted">
										Mon
									</th>
									<th className="text-muted">
										Tue
									</th>
									<th className="text-muted">
										Wed
									</th>
									<th className="text-muted">
										Thu
									</th>
									<th className="text-muted">
										Fri
									</th>
									<th className="text-muted">
										Sat
									</th>
									<th className="text-muted">
										Sun
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>

									</td>
									<td>
										{/* <ProgressBar className="my-progress-bar" variant="success" now={40} /> */}
									</td>
									<td>
										{/* <ProgressBar className="my-progress-bar" variant="success" now={40} /> */}
									</td>
									<td>
										{/* <ProgressBar now={40} style={{ backgroundColor: "red" }} />
										<ProgressBar variant="info" now={20} />
									<ProgressBar variant="warning" now={60} />
									<ProgressBar variant="danger" now={20} /> */}
									</td>
									<td>
										{/* <Card
											bg="primary"
											key="1"
											text="text"
											style={{ width: '18rem' }}
											className="mb-2"
										>
											<Card.Header>Header</Card.Header>
											<Card.Body>
											</Card.Body>
										</Card> */}
									</td>
									<td>

									</td>
									<td>

									</td>
								</tr>
							</tbody>

						</Table>
					</Row>

				</Container>

			)}
		</>

	)

}
