import { Button } from 'react-bootstrap';


export default function AddButton(props) {

	// props passed from ManageGroupsTable
	const { showModal, setShowModal } = props;


	return (

		<Button
			className="btn rounded-circle"
			variant="primary"
			onClick={() => setShowModal(true)}
		>
			<strong>
				+
			</strong>
		</Button >

	)

}
