import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';
import { CurrentUser, CurrentMessage } from '../App.js'
import * as Icons from 'react-bootstrap-icons';
import API from '../API.js';


export default function ModalGroupStudentRemove(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUser);

	// props passed from ManageGroupsTable
	const { setDirty, showStudentRemoveModal, setShowStudentRemoveModal, groupStudentToRemove, setGroupStudentToRemove } = props;


	const handleConfirmButton = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// TODO: check this!
		API.removeGroupStudent(groupStudentToRemove.course_code, groupStudentToRemove.student_code);
		API.updateGroupsStudentsNumber(groupStudentToRemove.course_code, -1);

		setDirty(true);
		setShowStudentRemoveModal(false);
		history.push('/manage_groups');
	}

	const handleCancelButton = () => {
		setShowStudentRemoveModal(false);
		history.push('/manage_groups');
	}


	return (

		<>
			{!loggedUser.student_code ? (

				<Redirect to='/login' />

			) : (

				<Modal
					animation={false}
					show={showStudentRemoveModal}
					backdrop="static"
					keyboard={false}
					size="md"
				>
					<Modal.Header className="text-center">
						<Modal.Title className="my-modal-title w-100">
							Remove student
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						<div className="mb-2 text-center">
							You are removing the student:
						</div>
						<div className="mb-2 text-center">
							<Icons.PersonBadge
								color="#343a40"
								size="1.1em"
							/>
							<strong className="ml-1">{groupStudentToRemove.student_code}</strong>
						</div>

						<div className="mb-2 text-center">
							from group:
						</div>
						<div className="text-center">
							<Badge
								pill={false}
								style={{
									backgroundColor: groupStudentToRemove.group_color,
									color: "white", fontSize: "18px", fontWeight: "500"
								}}>
								{groupStudentToRemove.course_name}
							</Badge>
							<div className="mt-1 text-center">
								(<u>{groupStudentToRemove.course_code}</u>)
							</div>
						</div>

					</Modal.Body>


					<Button variant="link" onClick={handleCancelButton}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleConfirmButton}>
						Confirm
					</Button>

				</Modal>

			)
			}
		</>

	)

}
