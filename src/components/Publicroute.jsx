// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  // If token exists, redirect to dashboard or any other protected route
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // If no token, render the public page (like login)
  return children;
};

export default PublicRoute;
