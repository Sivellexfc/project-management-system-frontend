import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Hero Section */}
      <header className="bg-colorSecond text-white w-full py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Proje Yönetim Sisteminizi Kolaylaştırın
        </h1>
        <p className="text-lg mb-6">
          Ekibinizin projelerini etkili bir şekilde yönetin, süreçleri optimize
          edin ve hedeflerinize daha hızlı ulaşın.
        </p>
        <div className="space-x-4">
          <Link to={`/login`}>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow">
              Giriş Yap
            </button>
          </Link>
          <Link to={`/register`}>
            <button
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded shadow"
            >
              Kaydol
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="mt-12 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Neden Bizim Sistemimizi Seçmelisiniz?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
            <h3 className="text-lg font-bold text-colorSecond mb-2">
              Kolay Kullanım
            </h3>
            <p className="text-gray-600">
              Kullanıcı dostu arayüz ile projelerinizi hızlıca yönetin.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
            <h3 className="text-lg font-bold text-colorSecond mb-2">
              Gerçek Zamanlı İş Birliği
            </h3>
            <p className="text-gray-600">
              Ekibinizle aynı anda çalışarak verimliliği artırın.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
            <h3 className="text-lg font-bold text-colorSecond mb-2">
              Gelişmiş Analitik
            </h3>
            <p className="text-gray-600">
              Projelerinizin ilerlemesini detaylı raporlarla izleyin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;