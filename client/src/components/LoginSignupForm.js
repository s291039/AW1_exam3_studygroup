import { Container, Row, Form, Button, Spinner } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Redirect, Link, useLocation } from 'react-router-dom';
import { CurrentUserName, CurrentMessage } from '../App.js'
import SuccessErrorAlert from './SuccessErrorAlert.js';
import API from '../API.js';


export default function LoginForm(props) {

	const location = useLocation();
	const AmILoggingIn = location.pathname === '/login';

	// contexts
	const { loggedUser, setLoggedUser } = useContext(CurrentUserName);
	const { message, setMessage } = useContext(CurrentMessage);

	// props passed from App
	const { loading, setLoading } = props;

	const [studentCode, setStudentCode] = useState(
		AmILoggingIn ? 's291039' : 's123456');
	const [studentPassword, setStudentPassword] = useState('password');
	const [studentName, setStudentName] = useState('Mario');
	const [studentSurname, setStudentSurname] = useState('Rossi');
	const [validated, setValidated] = useState(false);


	const handleLogIn = async (credentials) => {

		try {
			const user = await API.logIn(credentials);
			setLoggedUser(user);
		} catch (err) {
			setMessage({ title: err, type: 'danger' });
		}
		setLoading(false);

	}

	const handleSignUp = async (credentials) => {

		try {
			await API.signUp(credentials);
			setMessage({ title: 'New user successfully registered.', type: 'success' });
		} catch (err) {
			setMessage({ title: `Student code ${credentials.student_code} already used.`, subtitle: 'Please, try again or reload.', type: 'danger' });
		}
		setLoading(false);

	}

	const handleSubmit = (event) => {

		setLoading(true);

		event.preventDefault();
		event.stopPropagation();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			if (AmILoggingIn) {
				const credentials = {
					student_code: studentCode,
					student_password: studentPassword
				};
				handleLogIn(credentials);
			}
			else {
				const credentials = {
					student_code: studentCode,
					student_password: studentPassword,
					student_name: studentName,
					student_surname: studentSurname
				};
				handleSignUp(credentials);
			}
		}
		else {
			setLoading(false);
		}
		setValidated(true);

	}


	return (

		<>
			{loggedUser.student_code ? (

				<Redirect to='/selection' />

			) : (

				<Container fluid className="my-homepage my-scrollable-container scrollbar">
					<Row>

						<Form
							className="my-login-signup-form"
							noValidate	// disable default browsers validation UI
							validated={validated}
							onSubmit={handleSubmit}
						>
							<img
								className="mt-5 mb-4"
								src={process.env.PUBLIC_URL + '/StudyGroup_img.png'}
								alt=""
								width="325"
							/>

							<Form.Group>

								<Form.Control
									type='text'
									value={studentCode}
									placeholder="Student code"
									id="student_code"
									required
									onChange={(ev) => {
										setStudentCode(ev.target.value);
										setMessage('');
									}}
								/>
								{!AmILoggingIn && (
									<>
										<Form.Control
											type='text'
											value={studentName}
											placeholder="Name"
											id="name"
											required
											onChange={(ev) => {
												setStudentName(ev.target.value);
												setMessage('');
											}}
										/>
										<Form.Control
											type='text'
											value={studentSurname}
											placeholder="Surname"
											id="surname"
											required
											onChange={(ev) => {
												setStudentSurname(ev.target.value);
												setMessage('');
											}}
										/>
									</>
								)}
								<Form.Control
									type='password'
									value={studentPassword}
									placeholder="Password"
									id="password"
									required
									onChange={(ev) => {
										setStudentPassword(ev.target.value);
										setMessage('');
									}}
								/>
								<Form.Control.Feedback className="mb-1" type="invalid">
									{message === '' && (

										<>
											{AmILoggingIn ? (
												<small>
													Please check student code and/or password field(s).
												</small>
											) : (
												<small>
													Please check student code, password, name and/or surname field(s).
												</small>
											)}
										</>

									)}
								</Form.Control.Feedback>

							</Form.Group>

							{/* (potential) ERROR message */}
							{message !== '' && <SuccessErrorAlert message={message} />}

							{!AmILoggingIn &&
								<div className="mt-3 text-muted">
									<small>
										By signing up, you agree to our Terms and Data Policy.
									</small>
								</div>
							}

							<Button
								className="my-button mt-2"
								variant="primary"
								size="lg"
								block
								type="submit"
								disabled={loading}
							>
								{AmILoggingIn ? 'Log in' : 'Sign up'}
								{loading && (
									<Spinner
										className="ml-4 pl-5"
										as="span"
										size="sm"
										animation="border"
										role="status"
										aria-hidden="true"
									/>
								)}
							</Button>

							{AmILoggingIn ? (

								<Row className="d-flex justify-content-center mt-3 mb-4 my-sign-up">
									Don't have an account?
									<Link to='/signup' className="ml-2"
										onClick={() => setStudentCode('s123456')}
									>
										Sign up
									</Link>
								</Row>

							) : (
								<>
									<Link to='/login' className="my-link"
										onClick={() => setStudentCode('s291039')}
									>
										<Container
											className="mt-2 my-go-back my-cursor-pointer"
											onClick={() => {
												setMessage('');
											}}
										>
											Go back
										</Container>
									</Link>
								</>
							)}

							<hr></hr>

							<Row className="d-flex justify-content-center">
								<div className="mt-1 text-muted">
									&copy; Francesco Lonardo 2021
								</div>
							</Row>

						</Form>

					</Row>
				</Container>

			)}
		</>

	)

}
