import { Alert } from "react-bootstrap";


export default function SuccessErrorAlert(props) {

	// props passed from LoginSignupForm/ModalMeetingRegistration
	const { title, subtitle, type } = props.message;


	return (

		<Alert
			variant={type === 'danger' ? 'danger' : 'success'}
			className="mt-2 mb-0"
		>

			<div className="my-alert-title text-center">
				{title}
			</div>

			{subtitle && (
				<div className="my-alert-subtitle text-center">
					{subtitle}
				</div>
			)}

		</Alert>

	)
}
