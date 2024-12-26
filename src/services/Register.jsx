// src/Register.js
import React, { useState } from "react";
import api from "./api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/register", { username, password });
      alert("Kayıt başarılı!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt başarısız oldu.");
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" />
      <button onClick={handleRegister}>Kayıt Ol</button>
    </div>
  );
};

export default Register;