import React, { useState } from "react";
import api from "../services/api";
import axios from "axios";

const Register = () => {
  const [email, setemail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [photo, setphoto] = useState("https://example.com/profiles/ahmet.jpg");
  const [roleName, setroleName] = useState("COMPANY_OWNER");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    const registerData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      phone: phone,
      photo: photo,
      roleName: roleName,
    };

    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Parolalar eşleşmiyor.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Parola en az 8 karakter olmalıdır.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8085/api/v1/auth/register`,
        { email, firstName, lastName, password, phone, photo, roleName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response.data.isSuccess){
        window.location.href = "/verification";
      }
      console.log("response register : " + response.data.isSuccess);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }

    setErrorMessage("");
    setSuccessMessage("Kayıt başarılı!");
  };

  const formatPhoneNumber = (value) => {
    // Sadece rakamları al
    const cleaned = value.replace(/\D/g, "");

    // Telefon numarasının uzunluğuna göre formatı uygula
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setphone(formattedPhone.replace(/\D/g, "")); // formatlanmış değeri set et
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 mb-[100px] mt-[100px] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">KAYIT OL</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Ad</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Soyad</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parola</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parola Tekrar</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Telefon Numarası</label>
          <input
            type="tel" // input tipini 'tel' yaparak telefon numarası girişine uygun hale getirebilirsin
            value={phone}
            onChange={handlePhoneChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-colorSecond text-white py-3 mt-[20px] px-4 hover:bg-colorSecond hover:opacity-80 transition duration-200"
        >
          ONAYLA
        </button>
        <div className="flex justify-center text-[#9f2222] py-2.5">
          {errorMessage}
        </div>
      </form>
    </div>
  );
};

export default Register;
