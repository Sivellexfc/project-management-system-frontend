import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

// Token içeriği örnek yapısı
interface DecodedToken {
  userPermissions?: string[];
  exp?: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  const token = Cookies.get("accessToken");
  
  if (!token) {
    return <Navigate to="/home" replace />;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const hasPermission = decoded.userPermissions?.includes(requiredPermission);
    console.log(decoded.userPermissions)
    console.log(hasPermission)
    return hasPermission ? <>{children}</> : <Navigate to="/home" replace />;
  } catch (err) {
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoutes;
