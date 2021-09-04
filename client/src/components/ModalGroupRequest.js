import { Container, Row, Col, Modal, Form, InputGroup, Table, Button, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import API from '../API.js';


export default function ModalGroupRequest(props) {

	const history = useHistory();

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);

	// props passed from GroupsTable
	const { setDirty, showModal, setShowModal, groupRequestInfo, setGroupRequestInfo } = props;


	const handleCancelButton = () => {
		setShowModal(false);
		history.push('/groups');
	}

	const handleConfirmButton = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// TODO: check this!
		API.addGroupRequest(loggedUser.student_code, groupRequestInfo.course_code, +loggedUser.group_admin); // from boolean to integer

		setGroupRequestInfo([]);
		setDirty(true);
		setShowModal(false);
		history.push('/groups');
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
							Group request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="mb-2 text-center">
							You are sending a request for the group:
						</div>
						<div className="text-center">
							<Badge
								pill={false}
								style={{
									backgroundColor: groupRequestInfo.group_color,
									color: "white", fontSize: "18px", fontWeight: "500"
								}}>
								{groupRequestInfo.course_name}
							</Badge>
							<div className="mt-1 text-center">
								(<u>{groupRequestInfo.course_code}</u>)
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

			)}
		</>

	)

}
