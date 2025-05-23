import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { setAuth } from "../app/features/authSlice";
import api from "../services/api";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import axios from "axios";
import { BiArrowToRight } from "react-icons/bi";
import { BsArrowBarRight } from "react-icons/bs";
import { CgArrowRight } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";
import { fecthCompanyInfos } from "../services/companyServices/GetUserCompanyInfos";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8085/api/v1/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response.data.result.accessToken;

      localStorage.setItem("accessToken", accessToken);

      Cookies.set('accessToken', accessToken);
      const decodedToken = jwtDecode(accessToken);
      const role = decodedToken.userRole;
      
      // Eğer returnUrl varsa, o sayfaya yönlendir
      if (returnUrl) {
        navigate(returnUrl);
      } else if (role === 'ADMIN' || role === 'COMPANY_OWNER') {
        navigate('/selectCompany');
      } else {
        try {
          const response = await fecthCompanyInfos();
          Cookies.set('selectedCompanyId', response.result.company.id);
        } catch (error) {
          console.log("User company infos error : ",error);
        }
        navigate('/announcement');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-borderColor w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          GİRİŞ YAP
        </h2>
        <form>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Adres
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full text-sm px-4 py-2 border  border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Şifre
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full text-sm px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Login Button */}
          <div className="w-full flex justify-center">
          <button
            onClick={handleLogin}
            type="submit"
            className="w-100px border-sky-500 border hover:bg-sky-500 bg-colorSecond text-primary py-2 px-4 rounded-lg hover:bg-blue-300 transition duration-200 mt-10"
          >
            <CgArrowRight></CgArrowRight>
          </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Hesabınız yok mu?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Kayıt Ol!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
