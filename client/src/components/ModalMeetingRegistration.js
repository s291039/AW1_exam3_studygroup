import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useHistory, useLocation } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import API from '../API.js';
import dayjs from 'dayjs';


export default function ModalMeetingRegistration(props) {

	const history = useHistory();
	const location = useLocation();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);

	// props passed from MeetingsTable
	const { setDirty, showModal, setShowModal, meetingRegistrationInfo, setMeetingRegistrationInfo } = props;

	const AmIRegistering = location.pathname === `/meetings/${meetingRegistrationInfo.meeting_id}/registration`;


	const handleConfirmButton = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// TODO: check this!
		if (AmIRegistering)
			API.addMeetingRegistration('s291039', meetingRegistrationInfo.meeting_id);
		else
			API.removeMeetingRegistration('s291039', meetingRegistrationInfo.meeting_id);

		setMeetingRegistrationInfo([]);
		setDirty(true);
		setShowModal(false);
		history.push('/meetings');
	}

	const handleCancelButton = () => {
		setShowModal(false);
		history.push('/meetings');
	}


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Modal
					animation={false}
					show={showModal}
					backdrop="static"
					keyboard={false}
					size="md"
				>
					<Modal.Header className="text-center">
						<Modal.Title className="my-modal-title w-100">
							{AmIRegistering ? (
								<>Meeting registration</>
							) : (
								<>Meeting deregistration</>
							)}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="mb-2 text-center">
							{AmIRegistering ? (

								<>You are registering to the meeting:</>

							) : (

								<>You are deregistering to the meeting:</>

							)}
						</div>
						<div className="text-center">
							<Badge
								pill={false}
								style={{
									backgroundColor: meetingRegistrationInfo.group_color,
									color: "white", fontSize: "18px", fontWeight: "500"
								}}>
								{meetingRegistrationInfo.course_name}
							</Badge>
							<div className="mt-1 text-center">
								<small>
									{dayjs(meetingRegistrationInfo.meeting_datetime).format('YYYY/MM/DD')}
								</small>
							</div>
							<div className="mt-1 text-center">
								<small>
									{dayjs(meetingRegistrationInfo.meeting_datetime).format('HH:mm')}
								</small>
							</div>
						</div>
					</Modal.Body>

					<Button variant="link" onClick={handleCancelButton}>
						Cancel
					</Button>

					{AmIRegistering ? (
						<Button variant="primary" onClick={handleConfirmButton}>
							Register
						</Button>
					) : (
						<Button variant="danger" onClick={handleConfirmButton}>
							Deregister
						</Button>
					)}
				</Modal>

			)}
		</>

	)

}
