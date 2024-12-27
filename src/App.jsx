// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Issues from "./components/Issues";
import Reports from "./components/Reports";
import Calender from "./components/Calender";
import Announcement from "./components/Announcement";
import ProjectDetails from "./components/ProjectDetails";
import Help from "./components/Help";
import SubscriptionPage from "./pages/SubscriptionPage";
import { AuthProvider } from "./services/AuthProvider";
import { useAuth } from "./services/AuthProvider";
import HomePage from "./pages/HomePage.jsx";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie';
import { DashBoard } from "./components/DashBoard.jsx";
import { Verification } from "./pages/Verification.jsx";
import VerifyEmail from "./services/VerifyEmail.jsx";

const ProtectedRoute = ({ children }) => {
  const accessTokenn = useSelector((state) => state.auth.accessToken);
  const accessToken = Cookies.get('accessToken');
  console.log("token : "+accessToken)
  
  if (!accessToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const App = () => {
  const accessToken = Cookies.get('accessToken');
  return (
    <AuthProvider>
      <Routes>
        {/* Layout içinde gösterilecek rotalar */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashBoard/>} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/projectDetails" element={<ProjectDetails />} />
          <Route path="/help" element={<Help />} />
          <Route path="/issues" element={<Issues />} />
          

        </Route>
        
        {/* Login rotası */}
        <Route path="/" element={<Navigate to={'/home'} />} />
        <Route path="/verification" element={<Verification/>} />
        <Route path="/auth/verify" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
