import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Starter from "./pages/StartPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Starter />
        <div className="w-full h-screen flex flex-col">
          <Routes>
            {/* Set the default route to the Register page */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home/:userId" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
