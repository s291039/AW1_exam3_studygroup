import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import API from '../API.js';


export default function ModalAddDeleteGroup(props) {

	const location = useLocation();
	const AmIAddingGroup = location.pathname === '/manage_groups/add';
	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);

	// props passed from ManageGroupsTable
	const { otherGroupsList, setDirty, showModal, setShowModal, groupToDelete, setGroupToDelete } = props;

	const [selectedOtherGroup, setSelectedOtherGroup] = useState({});


	const compareByName = (a, b) => {
		if (a < b)
			return -1;
		else if (a > b)
			return 1;
		else
			return 0;
	}

	const getOtherGroupsOptions = otherGroupsList
		.sort((firstG, secondG) => compareByName(firstG.course_name, secondG.course_name))
		.map((oG, idx) => (

			<>
				<option key={idx} value={oG.course_code}>
					{oG.course_name}
				</option>
			</>

		))


	const handleConfirmButton = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// TODO: check this!
		if (AmIAddingGroup) {
			API.addGroup(selectedOtherGroup);
			API.removeOtherGroup(selectedOtherGroup.course_code);
		}
		else {
			API.removeGroup(groupToDelete.course_code);
			API.addOtherGroup(groupToDelete);
		}

		setDirty(true);
		setSelectedOtherGroup({});
		setShowModal(false);
		history.push('/manage_groups');
	}

	const handleCancelButton = () => {
		setSelectedOtherGroup({});
		setShowModal(false);
		history.push('/manage_groups');
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
								{AmIAddingGroup ? (

									<>Add group</>

								) : (

									<>Delete group</>

								)}
							</>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						<>
							{AmIAddingGroup ? (

								<>
									{Object.keys(selectedOtherGroup).length === 0 && (
										<Row className="d-flex justify-content-center">
											<div className="mb-2 text-center">
												Choose an existing course:
											</div>
											<Form.Control
												as="select"
												className="text-center mb-2"
												id="other_groups"
												custom
												onChange={(ev) => {
													const otherGroup = otherGroupsList.find((oG) => oG.course_code === ev.target.value);
													setSelectedOtherGroup(otherGroup);
												}}
											>
												<option>...</option>
												{getOtherGroupsOptions}

											</Form.Control>
										</Row>
									)}

									{Object.keys(selectedOtherGroup).length !== 0 && (

										<>
											<div className="mb-2 text-center">
												You choose the group:
											</div>
											<div className="text-center">
												<Badge
													pill={false}
													style={{
														backgroundColor: selectedOtherGroup.group_color,
														color: "white", fontSize: "18px", fontWeight: "500"
													}}>
													{selectedOtherGroup.course_name}
												</Badge>
												<div className="mt-1 mb-0 p-0 text-center">
													(<u>{selectedOtherGroup.course_code}</u>)
												</div>
											</div>
										</>

									)}
								</>

							) : (

								<>
									<div className="mb-2 text-center">
										You are deleting the group:
									</div>
									<div className="text-center">
										<Badge
											pill={false}
											style={{
												backgroundColor: groupToDelete.group_color,
												color: "white", fontSize: "18px", fontWeight: "500"
											}}>
											{groupToDelete.course_name}
										</Badge>
										<div className="mt-1 text-center">
											(<u>{groupToDelete.course_code}</u>)
										</div>
									</div>

								</>

							)}

						</>

					</Modal.Body>

					{Object.keys(selectedOtherGroup).length === 0 ? (
						<Button variant="link" onClick={handleCancelButton}>
							Cancel
						</Button>
					) : (
						<Button variant="link" onClick={() => setSelectedOtherGroup({})}>
							Change choice
						</Button>
					)}

					{AmIAddingGroup ? (
						<Button variant="primary" onClick={handleConfirmButton}
							disabled={Object.keys(selectedOtherGroup).length === 0}
						>
							Add
						</Button>
					) : (
						<Button variant="danger" onClick={handleConfirmButton}>
							Delete
						</Button>
					)}

				</Modal>

			)
			}
		</>

	)

}
