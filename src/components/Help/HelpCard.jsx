import React from "react";
import { FaTag, FaUser, FaClock, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/GetInitials";
import { getRandomColor } from "../utils/GetRandomColor";

const HelpCard = ({ help }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={() => navigate(`/help/${help.id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {help.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {help.description}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                help.helpstatus
              )}`}
            >
              {help.helpstatus}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                help.priority
              )}`}
            >
              {help.priority}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                help.user.userId
              )}`}
              title={`${help.user.firstName} ${help.user.lastName}`}
            >
              {getInitials(help.user.firstName, help.user.lastName)}
            </div>
            <span>
              {help.user.firstName} {help.user.lastName}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <div>
          {help.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              <FaTag className="mr-1" />
              {tag}
            </span>
          ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FaClock className="text-gray-400" />
            <span>{new Date(help.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCard;
