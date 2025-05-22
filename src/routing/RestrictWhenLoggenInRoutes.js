export const RestrictWhenLoggenInRoutes = ({ children }) => {
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