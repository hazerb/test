import './App.css';
import React, { useState, useEffect } from 'react';
import AdminLogin from "./components/Admin/AdminLogin";
import UserView from "./components/User/UserView"
import AdminView from "./components/Admin/AdminView"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {

  const [isAdmin, setIsAdmin] = useState(false);

  const setAdminTrue = () => {
    setIsAdmin(true);
  };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserView/>} />
        <Route path="/admin" element={<AdminLogin onAdminLogin={setAdminTrue} />} />
        {isAdmin ? (
          <Route path="/admin/dashboard" element={<AdminView />} />
        ) : (
          <Route path="/admin/dashboard" element={<Navigate to="/" />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
