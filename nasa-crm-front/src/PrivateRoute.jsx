// PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase';
import Navbar from './components/Navbar';


const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // or some loading indicator
  }

  return user ? (
  <div className='min-h-screen gradient-to-r from-cyan-500 to-blue-500'> 
    <Navbar />
    <Outlet /> 
  </div>
  
  ): <Navigate to="/login" />;

};

export default PrivateRoute;
