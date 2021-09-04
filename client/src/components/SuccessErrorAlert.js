import { Alert, Collapse } from "react-bootstrap";
import { useState } from "react";


export default function SuccessErrorAlert(props) {

	const { text, type, details } = props.message;
	const [collapse, setCollapse] = useState(false);


	return (

		<Alert variant={type === 'error' ? 'danger' : 'success'}>

			<div className="my-alert-title">
				{text}
			</div>

			{type === 'error' &&
				<div className="my-alert-subtitle">
					Please, try again or reload.
				</div>}

			{/* TODO: check this!*/}
			{details ? (
				<div>
					<hr />
					<div onClick={() => setCollapse((x) => !x)}>
						<Alert.Link href="#">
							{`Expand info ${collapse ? "\u25bc" : "\u25c4"}`}{" "}
						</Alert.Link>
					</div>
					<Collapse in={collapse}>
						<p className="mb-0">{details}</p>
					</Collapse>
				</div>
			) : (
				<></>
			)}

		</Alert>

	)
}
