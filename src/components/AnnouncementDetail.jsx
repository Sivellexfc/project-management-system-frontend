import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaArrowLeft, FaCalendarAlt, FaBuilding, FaUser } from "react-icons/fa";

const AnnouncementDetail = (announcement) => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-colorFirst"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Duyuru bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft />
        Geri Dön
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {announcement.imageUrl && (
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {announcement.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>Geçerlilik: {formatDate(announcement.validUntil)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding />
              <span>{announcement.companyName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser />
              <span>{announcement.createdBy}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;