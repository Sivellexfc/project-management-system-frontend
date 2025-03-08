import React from 'react'

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const InviteRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    const companyId = searchParams.get("companyId");
    const token = searchParams.get("token");

    if (token) {
      navigate(`/register?token=${token}`);
    } else {
      navigate("/register"); // Eksik parametre varsa normal Register sayfasına yönlendir
    }
  }, [navigate, searchParams]);

  return <p>Yönlendiriliyorsunuz...</p>;
};

export default InviteRedirect;
