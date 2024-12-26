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
import Register from "./services/Register.jsx";
import Issues from "./components/Issues";
import Reports from "./components/Reports";
import Calender from "./components/Calender";
import Announcement from "./components/Announcement";
import ProjectDetails from "./components/ProjectDetails";
import Help from "./components/Help";
import SubscriptionPage from "./pages/SubscriptionPage";
import { AuthProvider } from "./services/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth.accessToken ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Layout içinde gösterilecek rotalar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/issues" />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/projectDetails" element={<ProjectDetails />} />
          <Route path="/help" element={<Help />} />
        </Route>
        {/* Login rotası */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
