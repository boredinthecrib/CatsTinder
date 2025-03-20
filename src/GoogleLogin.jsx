import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./GoogleLogin.css";
import CatLogo from "./Img/CAT.png";
import GoogleIcon from "./Img/Google.png";

function GoogleLogin({ setAuthenticated }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);
      setAuthenticated(true);
      // Store user data in session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          uid: userData.uid,
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthenticated(false);
      // Clear session storage on logout
      sessionStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="main">
      <div className="logo">
        <img src={CatLogo} alt="App Logo" />
      </div>
      <div className="container">
        <div className="card">
          {user ? (
            <div className="user-info">
              <img
                src={user.photoURL}
                alt="User Profile"
                className="profile-pic"
              />
              <h2 className="username">Welcome, {user.displayName}</h2>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div class="IconandButton">
              <img src={GoogleIcon} className="GoogleIcon" alt="Google Icon" />
              <button className="login-btn" onClick={handleLogin}>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleLogin;
