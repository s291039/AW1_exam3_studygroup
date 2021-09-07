import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useHistory, useLocation } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import SuccessErrorAlert from './SuccessErrorAlert.js';
import API from '../API.js';
import dayjs from 'dayjs';


export default function ModalMeetingRegistration(props) {

	const history = useHistory();
	const location = useLocation();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from MeetingsTable
	const { setDirty, showModal, setShowModal, loggedUserMeetingsList, meetingRegistrationInfo, setMeetingRegistrationInfo } = props;

	const [meetingOverlapping, setMeetingOverlapping] = useState(false);
	const [secondWarning, setSecondWarning] = useState(false);

	const AmIRegistering = location.pathname === `/meetings/${meetingRegistrationInfo.meeting_id}/registration`;

	const initialToBeDatetime = dayjs(meetingRegistrationInfo.meeting_datetime);
	const finalToBeDatetime = dayjs(meetingRegistrationInfo.meeting_datetime).add(meetingRegistrationInfo.meeting_duration, 'minute');


	const isOverlapping = (loggedUserMeeting) => {
		const initialRegisteredDatetime = dayjs(loggedUserMeeting.meeting_datetime);
		const finalRegisteredDatetime = dayjs(loggedUserMeeting.meeting_datetime).add(loggedUserMeeting.meeting_duration, 'minute');

		return (initialRegisteredDatetime.isBefore(initialToBeDatetime) && finalRegisteredDatetime.isAfter(initialToBeDatetime)) || (initialRegisteredDatetime.isBefore(finalToBeDatetime) && finalRegisteredDatetime.isAfter(finalToBeDatetime));
	}


	useEffect(() => {
		const checkForOverlapping = async () => {
			const foundOverlapping = loggedUserMeetingsList.filter((m) => dayjs(m.meeting_datetime).isAfter(dayjs())).find(isOverlapping);
			console.log(foundOverlapping);
			if (foundOverlapping !== undefined) // found at least one meeting overlapping
				setMeetingOverlapping(true);
		}
		if (loggedUser.student_code && AmIRegistering) {
			checkForOverlapping()
				.then(() => {
					// setLoading(false);
					// setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to check for overlapping! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [AmIRegistering])


	const handleConfirmButton = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// TODO: check this!
		if (AmIRegistering) {
			API.addMeetingRegistration(loggedUser.student_code, meetingRegistrationInfo.meeting_id);
			API.updateMeetingStudentsNumber(meetingRegistrationInfo.meeting_id, +1);
		}
		else {
			API.removeMeetingRegistration(loggedUser.student_code, meetingRegistrationInfo.meeting_id);
			API.updateMeetingStudentsNumber(meetingRegistrationInfo.meeting_id, -1);
		}

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
								<div className="my-meeting-datetime-registration">
									{dayjs(meetingRegistrationInfo.meeting_datetime).format('YYYY/MM/DD')}
								</div>
							</div>
							<div className="text-center">
								<small>
									{dayjs(meetingRegistrationInfo.meeting_datetime).format('HH:mm')}
								</small>
							</div>
						</div>

						{secondWarning && (
							<SuccessErrorAlert message={message} />
						)}

					</Modal.Body>

					<Button variant="link" onClick={handleCancelButton}>
						Cancel
					</Button>

					{AmIRegistering ? (

						<>
							{meetingOverlapping && !secondWarning ? (
								<Button variant="primary" onClick={() => {
									setMessage({ title: 'This meeting overlaps with another one.', subtitle: 'Are you sure you want to continue?', type: 'danger' });
									setSecondWarning(true)
								}}
								>
									Proceed
								</Button>
							) : (
								<Button variant="primary" onClick={handleConfirmButton}>
									Register
								</Button>
							)}
						</>

					) : (
						<Button variant="danger" onClick={handleConfirmButton}>
							Deregister
						</Button>
					)}
				</Modal>

			)
			}
		</>

	)

}
