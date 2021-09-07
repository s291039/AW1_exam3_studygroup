import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';
import { CurrentUser, CurrentMessage } from '../App.js'
import API from '../API.js';
import dayjs from 'dayjs';


export default function ModalMeetingAddDelete(props) {

	const location = useLocation();
	const AmIAddingMeeting = location.pathname === '/manage_meetings/add';
	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from ManageGroupsTable
	const { groupsList, setDirty, showModal, setShowModal, meetingToDelete, setMeetingToDelete } = props;

	const [selectedGroup, setSelectedGroup] = useState({});
	const [meetingDate, setMeetingDate] = useState('');
	const [meetingStartTime, setMeetingStartTime] = useState('');
	const [meetingEndTime, setMeetingEndTime] = useState('');
	const [meetingPlace, setMeetingPlace] = useState('');
	const [meetingDuration, setMeetingDuration] = useState(-1);
	const [areFieldsFilled, setAreFieldsFilled] = useState(false);
	const [formValidated, setFormValidated] = useState(false);


	useEffect(() => {
		const checkForEmptyFields = async () => {
			if ([meetingDate, meetingStartTime, meetingEndTime, meetingPlace]
				.every((el) => el !== ''))
				setAreFieldsFilled(true);
			else
				setAreFieldsFilled(false);
		}
		if (loggedUser.student_code && AmIAddingMeeting) {
			checkForEmptyFields()
				.then(() => {
					// setLoading(false);
					// setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to check for form validation! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [meetingDate, meetingStartTime, meetingEndTime, meetingPlace])

	useEffect(() => {
		const checkForPositiveDuration = async () => {
			if (areFieldsFilled) {
				const duration = dayjs(meetingDate + 'T' + meetingEndTime).unix() - dayjs(meetingDate + 'T' + meetingStartTime).unix();
				if (duration > 0) {// all ok
					setMeetingDuration(duration / 60);
					setFormValidated(true);
				}
				else
					setFormValidated(false);
			}
			else
				setFormValidated(false);
		}
		if (loggedUser.student_code && AmIAddingMeeting) {
			checkForPositiveDuration()
				.then(() => {
					// setLoading(false);
					// setDirty(false);
				})
				.catch((err) => {
					setMessage({ msg: "Impossible to check for positive meeting duration! Please, try again later...", type: 'danger' });
					console.error(err);
				})
		}
	}, [meetingDate, meetingStartTime, meetingEndTime, meetingPlace, areFieldsFilled])


	const compareByName = (a, b) => {
		if (a < b)
			return -1;
		else if (a > b)
			return 1;
		else
			return 0;
	}

	const getGroupsOptions = groupsList
		.sort((firstG, secondG) => compareByName(firstG.course_name, secondG.course_name))
		.map((g, idx) => (

			<>
				<option key={g.course_code} value={g.course_code}>
					{g.course_name}
				</option>
			</>

		))

	// Resets states to the initial values
	const resetStates = () => {
		setSelectedGroup([]);
		setMeetingDate('');
		setMeetingStartTime('');
		setMeetingEndTime('');
		setMeetingDuration(-1);
		setMeetingPlace('');
		setFormValidated(false);
	}

	const handleConfirmButton = () => {
		if (AmIAddingMeeting) {
			const meetingToAdd = {
				course_code: selectedGroup.course_code,
				course_name: selectedGroup.course_name,
				meeting_datetime: dayjs(meetingDate + 'T' + meetingStartTime),
				meeting_duration: meetingDuration,
				meeting_place: meetingPlace
			}
			API.addMeeting(meetingToAdd); // FIXME: fix this!
		}
		else
			API.deleteMeeting(meetingToDelete.meeting_id);

		setDirty(true);
		resetStates();
		setShowModal(false);
		history.push('/manage_meetings');
	}

	const handleCancelButton = () => {
		resetStates();
		setShowModal(false);
		history.push('/manage_meetings');
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
							<>
								{AmIAddingMeeting ? (

									<>Add meeting</>

								) : (

									<>Delete meeting</>

								)}
							</>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						<div className="text-center">

							{AmIAddingMeeting ? (

								<>

									{Object.keys(selectedGroup).length === 0 && (
										<Row className="d-flex justify-content-center">
											<span className="mb-2 text-center">
												Choose an existing course:
											</span>
											<Form.Control
												as="select"
												className="text-center mb-3"
												id="groups_formselect"
												required
												custom
												onChange={(ev) => {
													const group = groupsList.find((g) => g.course_code === ev.target.value);
													setSelectedGroup(group);
												}}
											>
												<option>...</option>
												{getGroupsOptions}
											</Form.Control>
										</Row>
									)}

									{Object.keys(selectedGroup).length !== 0 && (

										<>
											<div className="mb-2 text-center">
												You choose the group:
											</div>
											<div className="text-center">
												<Badge
													pill={false}
													style={{
														backgroundColor: selectedGroup.group_color,
														color: "white", fontSize: "18px", fontWeight: "500"
													}}>
													{selectedGroup.course_name}
												</Badge>
												<div className="mt-1 mb-3 p-0 text-center">
													(<u>{selectedGroup.course_code}</u>)
												</div>
											</div>


											<Form.Row className="mt-2 d-flex justify-content-center">
												<Col xs={8}>
													<small>
														Date
													</small>
													<Form.Control
														className="text-center"
														size="sm"
														type="date"
														min={dayjs().format('YYYY-MM-DD')} // min: today
														max={dayjs().add(1, 'year').format('YYYY-MM-DD')} // max: today + 1 year
														value={meetingDate}
														onChange={(ev) => setMeetingDate(ev.target.value)}
													/>
												</Col>
											</Form.Row>

											<Form.Row className="mt-2 d-flex justify-content-center">
												<Col xs={4}>
													<small>
														Start time
													</small>
													<Form.Control
														className="text-center"
														size="sm"
														type="time"
														min="06:00"
														max="23:00"
														value={meetingStartTime}
														onChange={(ev) => setMeetingStartTime(ev.target.value)}
													/>
												</Col>
												<Col xs={4}>
													<small>
														End time
													</small>
													<Form.Control
														className="text-center"
														size="sm"
														type="time"
														min="07:30"
														max="00:00"
														value={meetingEndTime}
														onChange={(ev) => setMeetingEndTime(ev.target.value)}
													/>
												</Col>
											</Form.Row>

											<Form.Row className="mt-2 d-flex justify-content-center">
												<Col xs={8}>
													<small>
														Place
													</small>
													<Form.Control
														className="text-center"
														size="sm"
														type="text"
														value={meetingPlace}
														onChange={(ev) => setMeetingPlace(ev.target.value)}
													/>
												</Col>
											</Form.Row>

											{!formValidated && (
												<>
													{!areFieldsFilled ? (

														<Form.Row className="mt-3 d-flex justify-content-center">
															<small className="text-danger">
																Please fill all the fields.
															</small>
														</Form.Row>

													) : (

														<Form.Row className="mt-3 d-flex justify-content-center">
															<small className="text-danger">
																Please check if end time is after start time.
															</small>
														</Form.Row>

													)}
												</>
											)}


										</>

									)}

								</>

							) : (

								<>
									<div className="mb-2">
										You are deleting the meeting:
									</div>
									<div className="text-center">
										<Badge
											pill={false}
											style={{
												backgroundColor: meetingToDelete.group_color,
												color: "white", fontSize: "18px", fontWeight: "500"
											}}>
											{meetingToDelete.course_name}
										</Badge>
										<div className="mt-1 text-center">
											<div className="my-meeting-datetime-registration">
												{dayjs(meetingToDelete.meeting_datetime).format('YYYY/MM/DD')}
											</div>
										</div>
										<div className="text-center">
											<small>
												{dayjs(meetingToDelete.meeting_datetime).format('HH:mm')}
											</small>
										</div>
									</div>
								</>

							)}

						</div>

					</Modal.Body>


					<Button variant="link" onClick={handleCancelButton}>
						Cancel
					</Button>

					{AmIAddingMeeting ? (
						<Button variant="primary" onClick={handleConfirmButton}
							disabled={Object.keys(selectedGroup).length === 0 || !formValidated}
						>
							Add
						</Button>
					) : (
						<Button variant="danger" onClick={handleConfirmButton}>
							Delete
						</Button>
					)}

				</Modal>

			)}
		</>

	)

}
