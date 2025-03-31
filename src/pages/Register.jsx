import React, { useState } from "react";
import api from "../services/api";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { addUserToCompany } from "../services/companyServices/AddUserToCompany";
import { jwtDecode } from "jwt-decode";
import { FaCamera } from "react-icons/fa";

const Register = ({type}) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [invitedUser, setInvitedUser] = useState(false);
  const [key, setKey] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token")?.trim();
    if (tokenParam) {
      setKey(tokenParam);
      try {
        const decoded = jwtDecode(tokenParam);
        if (decoded.userMail) {
          setInvitedUser(true);
          console.log(decoded.userMail);
          setEmail(decoded.userMail);
          setSelectedRoleName("USER");
        }
      } catch (error) {
        console.error("Token decode edilirken hata oluştu:", error);
      }
    }
  }, [searchParams]);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Fotoğraf boyutu 5MB'dan küçük olmalıdır.");
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Lütfen geçerli bir fotoğraf dosyası seçin.");
        return;
      }
      console.log(file);
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMessage("");
    }
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
      const formData = new FormData();
      // Form verilerini JSON olarak ekle
      const requestData = {
        email,
        firstName,
        lastName,
        password,
        phone,
        roleName
      };
      
      formData.append("request", new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      }));
      
      // Fotoğrafı ekle
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await axios.post(
        `http://localhost:8085/api/v1/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      setErrorMessage(error.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu.");
    }

    setErrorMessage("");
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
    setShowPhone(formattedPhone);
    setphone(formattedPhone.replace(/\D/g, ""));
  };

  return (
    <div className="max-w-lg mx-auto border border-borderColor bg-colorFirst p-6 my-auto rounded-lg">
      <h2 className="text-2xl mb-6 font-md text-center">Yeni Hesap Oluştur</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Fotoğraf Yükleme Alanı */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profil fotoğrafı"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <FaCamera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <label
              htmlFor="photo"
              className="absolute bottom-0 right-0 bg-colorFirst text-white p-2 rounded-full cursor-pointer hover:bg-colorSecond transition-colors"
            >
              <FaCamera className="w-4 h-4" />
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Profil fotoğrafı seçin (max 5MB)</p>
        </div>

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
            type="tel"
            value={showPhone}
            onChange={handlePhoneChange}
            required
            className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <button
          type="submit"
          className="w-full border border-borderColor bg-colorFirst text-primary py-3 mt-[20px] px-4 hover:bg-colorSecond hover:opacity-80 transition duration-200"
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
