import { ListGroup, Collapse } from 'react-bootstrap';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CurrentUserName } from '../App.js'


export default function SidebarFilters(props) {

	const history = useHistory();

	const { loggedUser } = useContext(CurrentUserName);

	// props passed from MainPage
	const { currentFilter, setCurrentFilter, sidebarCollapse, setSidebarCollapse } = props;

	const filters = [
		{ id: 0, label: 'Public', filter: 'public' },
		{ id: 1, label: 'Today', filter: 'today' },
		{ id: 2, label: 'Last 7 Days', filter: 'lastweek' },
		{ id: 3, label: 'Private', filter: 'private' }
	]

	// generates all the filters like a (left) sidebar
	// shows the last (private) filter only if there is a logged user
	const filters_list = filters.map((f) => (

		<>
			{(f.filter !== 'private' || loggedUser.student_code) && (
				<ListGroup.Item
					action
					key={f.id}
					active={currentFilter === f.filter}
					onClick={() => {
						setCurrentFilter(f.filter);
						history.push('/main/' + f.filter);
						setSidebarCollapse(false);
					}}
				>
					{f.label}
				</ListGroup.Item>
			)}
		</>

	))


	return (

		<Collapse in={sidebarCollapse} className="d-md-block">

			<ListGroup className="my-listgroup" variant="flush">

				{filters_list}
				<br />

			</ListGroup>

		</Collapse>

	)

}
