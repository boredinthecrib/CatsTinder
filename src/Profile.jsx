import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, collection, getDocs, doc, deleteDoc } from "./firebase";
import Card from "./Card";
import CatLogo from "./Img/CAT.png";
import "./App.css";

function Profile() {
  const [likedCats, setLikedCats] = useState({});
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadLikedCats();
    }
  }, [user]);

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

  const handleUnlike = async (index) => {
    if (!user) return;
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "likedCats", index.toString())
      );
      setLikedCats((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    } catch (error) {
      console.error("Error unliking cat:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="mainPage">
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src={CatLogo} alt="App Logo" className="header-logo" />
            <h1>My Profile</h1>
          </div>
          <div className="header-right">
            {user && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-picture"
              />
            )}
            <button className="back-btn" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-info">
          <img
            src={user?.photoURL}
            alt="Profile"
            className="profile-picture-large"
          />
          <h2>{user?.displayName}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="liked-cats-section">
          <h2>My Liked Cats</h2>
          <div className="liked-cats-grid">
            {Object.entries(likedCats).map(([index, url]) => (
              <div key={index} className="liked-cat-card">
                <Card
                  img={url}
                  liked={true}
                  toggleLiked={() => handleUnlike(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
