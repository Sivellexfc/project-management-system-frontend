import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaUsers, FaChartLine, FaRocket } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-colorFirst to-blue-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-10xl">WORKDEN</h1>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Proje Yönetim Sisteminizi Kolaylaştırın
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            Ekibinizin projelerini etkili bir şekilde yönetin, süreçleri optimize
            edin ve hedeflerinize daha hızlı ulaşın.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up">
            <Link to={`/login`}>
              <button className="px-8 py-3 bg-colorFirst border border-borderColor hover:bg-colorSecond text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Giriş Yap
              </button>
            </Link>
            <Link to={`/register`}>
              <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-borderColor">
                Kaydol
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Neden Bizim Sistemimizi Seçmelisiniz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-colorFirst bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <FaTasks className="text-3xl text-colorFirst" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Kolay Kullanım
              </h3>
              <p className="text-gray-600">
                Kullanıcı dostu arayüz ile projelerinizi hızlıca yönetin.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaUsers className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gerçek Zamanlı İş Birliği
              </h3>
              <p className="text-gray-600">
                Ekibinizle aynı anda çalışarak verimliliği artırın.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gelişmiş Analitik
              </h3>
              <p className="text-gray-600">
                Projelerinizin ilerlemesini detaylı raporlarla izleyin.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FaRocket className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Hızlı Entegrasyon
              </h3>
              <p className="text-gray-600">
                Mevcut sistemlerinizle kolayca entegre olun.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
