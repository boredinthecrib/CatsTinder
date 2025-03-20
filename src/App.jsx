import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import GoogleLogin from "./GoogleLogin";
import Profile from "./Profile";
import { ThemeProvider, useTheme } from "./ThemeContext";

function AppContent() {
  let [authenticated, setAuthenticated] = useState(false);
  let [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Check for existing session on app load
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className={`app-container ${isDarkMode ? "dark" : "light"}`}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <Routes>
          {/* Redirect unauthenticated users to login */}
          <Route
            path="/"
            element={authenticated ? <HomePage /> : <Navigate to="/login" />}
          />

          {/* Google Login Route - Redirect authenticated users to home */}
          <Route
            path="/login"
            element={
              authenticated ? (
                <Navigate to="/" />
              ) : (
                <GoogleLogin setAuthenticated={setAuthenticated} />
              )
            }
          />

          {/* Profile Route - Only accessible when authenticated */}
          <Route
            path="/profile"
            element={authenticated ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
