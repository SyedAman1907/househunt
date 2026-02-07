import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar_Premium';
import Home from './pages/Home_Premium';
import Login from './pages/Login_Premium';
import Register from './pages/Register_Premium';
import PropertyDetails from './pages/PropertyDetails_Premium';
import OwnerDashboard from './pages/OwnerDashboard_Premium';
import AdminDashboard from './pages/AdminDashboard_Premium';
import AdminLogin from './pages/AdminLogin_Premium';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{animationDelay: '0.1s'}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/properties/:id' element={<PropertyDetails />} />
          <Route path='/owner-dashboard' element={<OwnerDashboard />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
