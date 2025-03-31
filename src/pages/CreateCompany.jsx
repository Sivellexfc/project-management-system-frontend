import React, { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaIdCard, FaMapMarkerAlt, FaUpload } from "react-icons/fa";

const CreateCompany = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [subscriptionPlanStatus, setSubscriptionPlanStatus] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // Adres ile ilgili ayrı ayrı state'ler
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSubscriptionPlanStatus(event.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Logo dosyası 5MB'dan büyük olamaz.");
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Lütfen geçerli bir resim dosyası yükleyin.");
        return;
      }

      // Görüntü boyutları kontrolü
      const img = new Image();
      img.onload = function() {
        if (this.width < 200 || this.height < 200) {
          setErrorMessage("Logo en az 200x200 piksel boyutunda olmalıdır.");
          return;
        }
        if (this.width > 1000 || this.height > 1000) {
          setErrorMessage("Logo en fazla 1000x1000 piksel boyutunda olmalıdır.");
          return;
        }
        
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
        setErrorMessage("");
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const accessToken = Cookies.get('accessToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const addressAll = {
      street,
      city,
      zipCode,
      country,
    };

    try {
      const formData = new FormData();
      
      // Form verilerini JSON olarak ekle
      formData.append("request", new Blob([JSON.stringify({
        name,
        description,
        taxNumber,
        phoneNumber,
        email,
        website,
        subscriptionPlanStatus,
        address: addressAll,
      })], {
        type: "application/json",
      }));
      
      // Logoyu ekle
      if (logo) {
        formData.append("logoFile", logo);
      }

      const response = await axios.post(
        `http://localhost:8085/api/v1/company`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      
      if (response.data.isSuccess) {
        setSuccessMessage("Şirket başarıyla oluşturuldu!");
        setTimeout(() => {
          window.location.href = "/selectCompany";
        }, 1500);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setErrorMessage(error.response?.data?.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhone.replace(/\D/g, ""));
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg flex">
        {/* Sol Kolon - Form Alanları */}
        <div className="w-1/2 p-8 overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Şirket Bilgileri */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şirket adını girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şirket açıklamasını girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vergi Numarası</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vergi numarasını girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abonelik Planı</label>
                <select
                  value={subscriptionPlanStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz...</option>
                  <option value="FREE">Free</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Adres Bilgileri */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ülke adını girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şehir adını girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sokak</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sokak adını girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Posta kodunu girin"
                  />
                </div>
              </div>
            </div>

            {/* Error ve Success Mesajları */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-colorFifth text-white py-3 px-4 rounded-lg hover:bg-colorSecond transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Oluşturuluyor..." : "ONAYLA"}
            </button>
          </form>
        </div>

        {/* Sağ Kolon - Logo ve Başlık */}
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-l border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Şirket Oluştur</h2>
            <p className="text-gray-600 mt-2">Yeni şirketinizin bilgilerini girin</p>
          </div>

          {/* Logo Upload Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-contain rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <FaBuilding className="text-gray-400 text-5xl" />
                </div>
              )}
              <label
                htmlFor="logo-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <FaUpload className="text-gray-600" />
              </label>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Logo boyutu: 200x200 - 1000x1000 piksel<br />
              Maksimum dosya boyutu: 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
