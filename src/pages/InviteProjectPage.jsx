import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:8085/api/v1/";

const InviteProjectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = searchParams.get('token');
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    // Eğer kullanıcı giriş yapmamışsa ve token varsa
    if (!accessToken && token) {
      // Login sayfasına yönlendir ve returnUrl olarak mevcut sayfayı ekle
      navigate(`/login?returnUrl=/invite-project?token=${token}`);
    }
  }, [accessToken, token, navigate]);

  const handleJoinProject = async () => {
    if (!token) {
      setError('Geçersiz davet bağlantısı.');
      return;
    }

    if (!accessToken) {
      navigate(`/login?returnUrl=/invite-project?token=${token}`);
      return;
    }

    try {
      setLoading(true);
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const { companyId, projectId } = tokenData;

      await axios.post(
        `${BASE_URL}company/${companyId}/project/${projectId}/user/add?token=${encodeURIComponent(token)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Başarılı olduğunda ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      setError('Projeye katılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Eğer kullanıcı giriş yapmamışsa, loading göster
  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Proje Daveti</h1>
          <p className="text-gray-600 mb-8">
            Size bir proje daveti gönderildi. Projeye katılmak için aşağıdaki butona tıklayın.
          </p>
        </div>

        <button
          onClick={handleJoinProject}
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <FaCheck />
              <span>Projeye Katıl</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InviteProjectPage;
