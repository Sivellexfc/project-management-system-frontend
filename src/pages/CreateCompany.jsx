import React, { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const CreateCompany = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [subscriptionPlanStatus, setSubscriptionPlanStatus] = useState("");
  
  // Adres ile ilgili ayrı ayrı state'ler
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    setSubscriptionPlanStatus(event.target.value);
  };

  const accessToken = Cookies.get('accessToken');
    console.log(accessToken)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // addressAll objesini doğru şekilde oluşturuyoruz
    const addressAll = {
      street: street,  // Doğru: street state'i kullanılıyor
      city: city,
      zipCode: zipCode,
      country: country,
    };

    const accessToken = Cookies.get('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:8085/api/v1/company`,
        {
          name,
          description,
          taxNumber,
          phoneNumber,
          email,
          website,
          subscriptionPlanStatus,
          address: addressAll, // Doğrudan addressAll objesini gönderiyoruz
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      
      if (response.data.isSuccess) {
        window.location.href = "/verification";
      }
      console.log("response register : " + response.data.isSuccess);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setErrorMessage("Kayıt sırasında bir hata oluştu.");
    }

    setSuccessMessage("Kayıt başarılı!");
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
    <div className="max-w-3xl mx-auto bg-white p-6 mb-[100px] mt-[100px] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Şirket Oluştur</h2>
      <form onSubmit={handleSubmit} className="flex space-x-5 justify-between">
        <div className="w-[400px]">
          {/* Şirket bilgileri inputları */}
          <div className="mb-4">
            <label className="block text-gray-700">Şirket Adı</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Diğer input alanları */}
          <div className="mb-4">
            <label className="block text-gray-700">Açıklama</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Vergi Numarası</label>
            <input
              type="number"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subscription Plan Status</label>
            <select
              id="options"
              value={subscriptionPlanStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seçiniz...</option>
              <option value="FREE">Free</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Telefon Numarası</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
        </div>

        <div className="w-[400px]">
          {/* Adres bilgileri inputları */}
          <div className="mb-4">
            <label className="block text-gray-700">Ülke</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Şehir</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sokak</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Posta Kodu</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-colorFifth text-white py-3 mt-[20px] px-4 hover:bg-colorSecond hover:opacity-80 transition duration-200"
          >
            ONAYLA
          </button>
          <div className="flex justify-center text-[#9f2222] py-2.5">
            {errorMessage}
          </div>
        </div>
      </form>
      {successMessage && (
        <div className="mt-4 text-green-600 text-center">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CreateCompany;
