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
import Announcement from "./pages/Anouncement";
import ProjectDetails from "./components/ProjectDetails";
import Help from "./components/Help";
import SubscriptionPage from "./pages/SubscriptionPage";
import { AuthProvider } from "./services/AuthProvider";
import { useAuth } from "./services/AuthProvider";
import HomePage from "./pages/HomePage.jsx";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { DashBoard } from "./components/DashBoard.jsx";
import  Calender  from "./components/Calender.jsx";
import { Verification } from "./pages/Verification.jsx";
import VerifyEmail from "./services/VerifyEmail.jsx";
import KanbanBoard from "./components/Kanbanv2/KanbanBoard.tsx";
import SelectCompany from "./pages/SelectCompany.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";
import CompanySettings from "./components/company/CompanySettings.jsx";
import InvitedUserPage from "./pages/InviteRedirect.jsx";
import { createTheme, ThemeProvider } from "@mui/material";
import UserAddCompanyDirection from "./pages/UserAddCompanyDirection.jsx";
import SelectAccountType from "./components/Login/SelectAccountType.jsx";
import AnnouncementDetail from "./components/AnnouncementDetail.jsx";
import CreateAnnouncement from "./components/CreateAnnouncement.jsx";
import ProtectedRoutes from "./Context/ProtectedRoutes.tsx";
import Reports from "./pages/Reports.jsx";
import Todo from "./pages/Todo.jsx";
import { CalendarContainer } from "react-datepicker";
import InviteProjectPage from './pages/InviteProjectPage';

const ProtectedRoute = ({ children }) => {
  const accessTokenn = useSelector((state) => state.auth.accessToken);

  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const RestrictWhenLoggenInRoutes = ({ children }) => {
  const accessToken = Cookies.get("accessToken");
  const selectedCompany = localStorage.getItem("selectedCompany"); // Şirket seçildi mi?

  if (accessToken) {
    if (!selectedCompany) {
      return <Navigate to="/selectCompany" replace />; // Şirket seçilmediyse yönlendir
    }
    return <Navigate to="/dashboard" replace />; // Şirket seçildiyse dashboard'a gönder
  }
  return children;
};

const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ["Inter"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          {/* Layout içinde gösterilecek rotalar */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/calendar" element={<Calender/>} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/announcement/:id" element={<AnnouncementDetail />} />
            <Route
              path="/announcement/create"
              element={<CreateAnnouncement />}
            />
            <Route path="/projectDetails" element={<ProjectDetails />} />
            <Route path="/company" element={<CompanySettings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/issues" element={<KanbanBoard />} />
            <Route
              path="/project/kanbanBoard/:projectId"
              element={<KanbanBoard />}
            />
          </Route>
          {/* Login rotası */}
          <Route path="/" element={<Navigate to={"/home"} />} />
          <Route
            path="/verification"
            element={
              <RestrictWhenLoggenInRoutes>
                <Verification />
              </RestrictWhenLoggenInRoutes>
            }
          />
          <Route path="/auth/verify" element={<VerifyEmail />} />
          <Route path="/invite-company" element={<InvitedUserPage />} />
          <Route path="/invite-project" element={<InviteProjectPage />} />
          
          <Route path="/selectType" element={<SelectAccountType />} />

          <Route path="/selectCompany" element={<SelectCompany />}></Route>

          <Route
            path="/selectCompany"
            element={
              <ProtectedRoutes requiredPermission="company:create">
                <SelectCompany />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/login"
            element={
              <RestrictWhenLoggenInRoutes>
                <Login />
              </RestrictWhenLoggenInRoutes>
            }
          />
          <Route
            path="/userAddToCompany"
            element={<UserAddCompanyDirection></UserAddCompanyDirection>}
          ></Route>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/register"
            element={
              <RestrictWhenLoggenInRoutes>
                <SelectAccountType />
              </RestrictWhenLoggenInRoutes>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictWhenLoggenInRoutes>
                <SelectAccountType />
              </RestrictWhenLoggenInRoutes>
            }
          />
          <Route path="/subscription" element={<SubscriptionPage />} />

          <Route path="/newCompany" element={<CreateCompany />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
