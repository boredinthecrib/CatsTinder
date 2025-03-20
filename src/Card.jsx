import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import "./App.css";

function Card({ img, liked, toggleLiked }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      loadRating();
      loadComments();
    }
  }, [user, img]);

  const loadRating = async () => {
    if (!user) return;
    const ratingRef = collection(db, "users", user.uid, "ratings");
    const snapshot = await getDocs(ratingRef);
    snapshot.forEach((doc) => {
      if (doc.data().imageUrl === img) {
        setRating(doc.data().rating);
      }
    });
  };

  const loadComments = async () => {
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const catComments = snapshot.docs
      .filter((doc) => doc.data().imageUrl === img)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(catComments);
  };

  const handleRating = async (newRating) => {
    if (!user) return;
    try {
      const ratingRef = collection(db, "users", user.uid, "ratings");
      const snapshot = await getDocs(ratingRef);
      let ratingDoc = null;
      snapshot.forEach((doc) => {
        if (doc.data().imageUrl === img) {
          ratingDoc = doc;
        }
      });

      if (ratingDoc) {
        await deleteDoc(doc(db, "users", user.uid, "ratings", ratingDoc.id));
      }

      await addDoc(ratingRef, {
        imageUrl: img,
        rating: newRating,
        timestamp: new Date(),
      });

      setRating(newRating);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        imageUrl: img,
        text: newComment,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        timestamp: new Date(),
      });

      setNewComment("");
      loadComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="catCard">
      <img src={img} alt="Cat" />
      <div className="card-content">
        <div className="card-actions">
          <button
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={toggleLiked}
          >
            {liked ? "❤️" : "🤍"}
          </button>
          <button
            className="comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            💬
          </button>
        </div>

        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "active" : ""}`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {showComments && (
          <div className="comment-section">
            <form onSubmit={handleComment} className="comment-input">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button type="submit">Post</button>
            </form>
            <div className="comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span>{comment.userName}</span>
                    <span>
                      {new Date(
                        comment.timestamp.toDate()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
