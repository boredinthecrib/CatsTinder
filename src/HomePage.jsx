import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import Card from "./Card";
import {
  db,
  auth,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  signOut,
} from "./firebase";
import { useNavigate } from "react-router-dom";
import CatLogo from "./Img/CAT.png";

function HomePage() {
  let [catList, setCatList] = useState([]);
  let [likedCats, setLikedCats] = useState({});
  let [funFact, setFunFact] = useState("");
  let [isLoading, setIsLoading] = useState(true);
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  let [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const observer = useRef();
  const lastCatRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const API_KEY =
    "live_E47tr7AVYlUwD88NL1aYnwxwNVWyQ88oxDmahZppK5PYaxADe7TYUzuZsyAfBbgx";
  const API_URL = `https://api.thecatapi.com/v1/images/search?limit=20`;

  const catFacts = [
    "Cats spend 70% of their lives sleeping.",
    "A cat's nose print is unique, like a human's fingerprint.",
    "Cats can't taste sweetness.",
    "A cat's purr can help heal bones and muscles.",
    "Cats have over 100 different vocal sounds.",
    "A cat's whiskers help them determine if they can fit through a space.",
    "Cats can jump up to 6 times their body length.",
    "Cats have an extra organ that allows them to taste scents in the air.",
    "Cats can rotate their ears 180 degrees.",
    "A group of cats is called a 'clowder'.",
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fetchCats = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setCatList((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const randomFact =
          catFacts[Math.floor(Math.random() * catFacts.length)];
        setFunFact(randomFact);
        await fetchCats();
        if (user) {
          await loadLikedCats();
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  useEffect(() => {
    if (page > 1) {
      fetchCats();
    }
  }, [page]);

  // Load liked cats from Firestore
  const loadLikedCats = async () => {
    if (!user) return;
    const likedCatsRef = collection(db, "users", user.uid, "likedCats");
    const snapshot = await getDocs(likedCatsRef);
    let liked = {};
    snapshot.forEach((doc) => {
      liked[doc.id] = doc.data().url;
    });
    setLikedCats(liked);
  };

  // Toggle Like and Update Firestore
  const toggleLiked = async (index, url) => {
    if (!user) {
      alert("You must be logged in to like cats!");
      return;
    }

    setLikedCats((prevLikedCats) => {
      const updatedLikes = { ...prevLikedCats };

      if (updatedLikes[index]) {
        // Unlike cat -> Remove from Firestore
        deleteDoc(doc(db, "users", user.uid, "likedCats", index.toString()));
        delete updatedLikes[index];
      } else {
        // Like cat -> Save to Firestore
        addDoc(collection(db, "users", user.uid, "likedCats"), { url });
        updatedLikes[index] = url;
      }

      return updatedLikes;
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (isLoading && page === 1) {
    return (
      <div className="loading-container">
        <img src={CatLogo} alt="App Logo" className="loading-logo" />
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading cats...</p>
      </div>
    );
  }

  return (
    <div className="mainPage">
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src={CatLogo} alt="App Logo" className="header-logo" />
            <h1>Scroll and Like Cats</h1>
          </div>
          <div className="header-right">
            {user && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-picture"
                onClick={handleProfileClick}
              />
            )}
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="fun-fact-container">
        <p className="fun-fact">{funFact}</p>
      </div>

      <div className="Container">
        <div className="main">
          {catList.map((item, index) => (
            <div
              key={item.id}
              ref={index === catList.length - 1 ? lastCatRef : null}
            >
              <Card
                img={item.url}
                liked={likedCats[index] || false}
                toggleLiked={() => toggleLiked(index, item.url)}
              />
            </div>
          ))}
          {hasMore && (
            <div className="infinite-scroll-trigger">Loading more cats...</div>
          )}
        </div>

        <div className="liked">
          <h2>Liked Cats</h2>
          {Object.values(likedCats).map((url, index) => (
            <Card
              key={`liked-${index}`}
              img={url}
              liked={true}
              toggleLiked={() => toggleLiked(index, url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
