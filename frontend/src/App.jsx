import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar_Premium';
import Home from './views/Home_Premium';
import Login from './views/Login_Premium';
import Register from './views/Register_Premium';
import PropertyDetails from './views/PropertyDetails_Premium';
import OwnerDashboard from './views/OwnerDashboard_Premium';
import AdminDashboard from './views/AdminDashboard_Premium';
import AdminLogin from './views/AdminLogin_Premium';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';

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
