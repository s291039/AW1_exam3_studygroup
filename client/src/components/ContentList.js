import { Container, Row, Col, Figure, OverlayTrigger } from "react-bootstrap";
// import { useContext } from 'react';
import * as Icons from 'react-bootstrap-icons';
import IMAGES_ARRAY from "../data/imagesArray.js";


export default function ContentList(props) {

	// props passed from App
	const { memesList } = props;

	const renderTooltip = (props) => (
		<Container
			className="my-tooltip text-center"
			{...props}
		>
			<Icons.FileEarmarkPlus
				className="mt-2"
				color="white"
				size="1.7em"
			/>
			<Container className="mt-1">
				Click on the image to clone it!
			</Container>
		</Container>
	)

	const memes_list = memesList.map((m) => (

		<Figure as={Col} xs={4} lg={3}>

			<OverlayTrigger
				placement="bottom"
				delay={{ show: 50, hide: 50 }}
				overlay={renderTooltip}
			>

				{/* Meme thumbnail */}
				<Figure.Image
					className="my-cursor-pointer mb-1"
					width={150}
					height={150}
					src={IMAGES_ARRAY[m.img_id].image_path}
					thumbnail
				// onClick={}
				/>

			</OverlayTrigger>

			{/* Texts */}
			<Figure.Caption className="text-center my-figurecaption-text">
				{m.text1}
			</Figure.Caption>
			{
				IMAGES_ARRAY[m.img_id].n_text_fields > 1 &&
				<Figure.Caption className="text-center my-figurecaption-text">
					{m.text2}
				</Figure.Caption>
			}
			{
				IMAGES_ARRAY[m.img_id].n_text_fields > 2 &&
				<Figure.Caption className="text-center my-figurecaption-text">
					{m.text3}
				</Figure.Caption>
			}

			{/* Meme title */}
			<Figure.Caption className="text-center my-figurecaption-title">
				{m.title}
			</Figure.Caption>

			{/* Meme creator */}
			{
				m.creator_name !== '' &&
				<Figure.Caption className="text-center my-figurecaption-creator">
					<small>by </small>
					{m.creator_name}
				</Figure.Caption>
			}

		</Figure>

	))




	return (

		<Container fluid className="mt-3">

			<Row>

				{memes_list}

			</Row>

		</Container>

	)

}
