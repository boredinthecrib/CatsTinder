import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Card";

function App() {
	let [catList, setCatList] = useState([]);
	let [likedCats, setLikedCats] = useState({}); // Change to an object

	const toggleLiked = (index) => {
		setLikedCats((prevLikedCats) => {
			const updatedLikes = { ...prevLikedCats, [index]: !prevLikedCats[index] };
			return updatedLikes;
		});
	};

	useEffect(() => {
		async function getCats() {
			let API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";
			let response = await fetch(API_URL);
			let data = await response.json();
			setCatList(data);
		}

		getCats();
	}, []);

	return (
		<div className="mainPage">
			<header>Scroll and Like cats</header>

			<div className="Container">
				<div className="main">
					{catList.map((item, index) => (
						<Card
							key={index}
							img={item.url}
							liked={likedCats[index] || false}
							toggleLiked={() => toggleLiked(index)}
						/>
					))}
				</div>

				<div className="liked">
					<h2>Liked Cats</h2>
					{catList
						.filter((_, index) => likedCats[index]) // Show only liked cats
						.map((item, index) => (
							<Card
								key={`liked-${index}`}
								img={item.url}
								liked={true}
								toggleLiked={() => toggleLiked(index)}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

export default App;
