export const ProtectedRoute = ({ children }) => {
    const accessTokenn = useSelector((state) => state.auth.accessToken);
  
    const accessToken = Cookies.get("accessToken");
  
    if (!accessToken) {
      return <Navigate to="/home" replace />;
    }
    return children;
  };