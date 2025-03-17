import React, { useState } from "react";
import api from "../services/api";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { addUserToCompany } from "../services/companyServices/AddUserToCompany";
import { jwtDecode } from "jwt-decode";

const Register = ({type}) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");

  const [companyId, setCompanyId] = useState("");

  const [invitedUser, setInvitedUser] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token")?.trim(); // URL'den token al
    if (tokenParam) {
      setKey(tokenParam); // Token'ı state'e kaydet
      try {
        const decoded = jwtDecode(tokenParam); // Token'ı decode et
        if (decoded.userMail) {
          setInvitedUser(true);
          console.log(decoded.userMail);
          setEmail(decoded.userMail); // Eğer userMail varsa email state'ine ata
          setSelectedRoleName("USER");
        }
      } catch (error) {
        console.error("Token decode edilirken hata oluştu:", error);
      }
    }
  }, [searchParams]);
  console.log(invitedUser)
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [showPhone, setShowPhone] = useState("");
  const [photo, setphoto] = useState("https://example.com/profiles/ahmet.jpg");
  const [roleName, setSelectedRoleName] = useState(type);
  

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    setSelectedRoleName(event.target.value);
  };

  const handleSubmit = async (e) => {
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
      console.log("Key Değeri:", key);
      if (response.data.isSuccess && key) {
        console.log("Key bulundu, userAddToCompany sayfasına yönlendiriliyor.");
        window.location.href = `/userAddToCompany?token=${key}`;
      } else if (response.data.isSuccess && !key) {
        console.log("Key bulunamadı, verification sayfasına yönlendiriliyor.");
        window.location.href = "/verification";
      }
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
    setShowPhone(formattedPhone);
    setphone(formattedPhone.replace(/\D/g, "")); // formatlanmış değeri set et
  };

  return (
    <div className="max-w-lg mx-auto border border-borderColor bg-colorFirst p-6 my-auto rounded-lg">
      <h2 className="text-2xl mb-6 font-md text-center">Yeni Hesap Oluştur</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Ad</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 ">Soyad</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="mb-4 select-none">
          <label className="block text-gray-700">E-mail</label>
          <input
            disabled={invitedUser && email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        {!invitedUser && <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select
            id="options"
            value={roleName}
            onChange={handleChange}
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="">Seçiniz...</option>
            <option value="COMPANY_OWNER">Kurumsal</option>
            <option value="USER">Bireysel Kullanıcı</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>}

        <div className="mb-4">
          <label className="block text-gray-700">Parola</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parola Tekrar</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Telefon Numarası</label>
          <input
            type="tel" // input tipini 'tel' yaparak telefon numarası girişine uygun hale getirebilirsin
            value={showPhone}
            onChange={handlePhoneChange}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <button
          type="submit"
          className="w-full border border-borderColor bg-colorFirst text-primary  py-3 mt-[20px] px-4 hover:bg-colorSecond hover:opacity-80 transition duration-200"
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
