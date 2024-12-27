import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate ekledik
import axios from "axios"; // veya fetch kullanabilirsiniz

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  // URL'deki query parametrelerini almak için useLocation kullanıyoruz
  const location = useLocation();
  const params = new URLSearchParams(location.search); // query string parametrelerini alıyoruz
  const verificationId = params.get('verificationId'); // 'verificationId' parametresini alıyoruz
  console.log(verificationId);

  const navigate = useNavigate(); // navigate fonksiyonunu ekledik

  useEffect(() => {
    if (verificationId) {
      // Backend'e doğrulama isteği göndermek
      const verifyEmail = async () => {
        try {
          setLoading(true);
          const response = await axios.post("http://localhost:8085/api/v1/auth/verify-mail", {
            verificationId
          });
          if (response.data.isSuccess) {
            setVerified(true);
            // 5 saniye sonra kullanıcıyı /login sayfasına yönlendiriyoruz
            setTimeout(() => {
              navigate('/login');
            }, 5000); // 5 saniye sonra yönlendirme
          } else {
            setError("Doğrulama başarısız oldu.");
          }
        } catch (err) {
          setError("Bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
    } else {
      setError("Geçersiz doğrulama ID.");
      setLoading(false);
    }
  }, [verificationId, navigate]); // verificationId ve navigate değiştiğinde tekrar çalışacak

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex h-screen justify-center items-center">
      {verified ? (
        <h1>Email doğrulamanız başarılı! <br></br>Yönlendiriliyorsunuz...</h1>
        
      ) : (
        <h1>{error}</h1>
      )}
    </div>
  );
};

export default VerifyEmail;
