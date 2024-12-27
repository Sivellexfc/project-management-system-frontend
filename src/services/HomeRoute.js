import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DashBoard from '../components/DashBoard';

const HomeRoute = () => {
  const auth = useSelector((state) => state.auth);
  return auth.accessToken ? <DashBoard /> : <HomePage />;
};

export default HomeRoute;