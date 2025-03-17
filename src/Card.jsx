function Card({ img, width, height, liked, toggleLiked }) {
	let redHeart = "❤️";
	let blankHeart = "♡";
	let buttonText = liked ? redHeart : blankHeart;

	return (
		<div className="card">
			<img alt="Cat Picture" src={img} />
			<button onClick={toggleLiked}>{buttonText}</button>
		</div>
	);
}

export default Card;
