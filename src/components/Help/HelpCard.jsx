import React, { useEffect, useState } from "react";
import {
  FaTag,
  FaUser,
  FaClock,
  FaComment,
  FaCode,
  FaImage,
  FaFileAlt,
} from "react-icons/fa";
import { fetchHelpComments } from "../../services/helpServices/GetHelpComments";

const PRIORITY_COLORS = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const HelpCard = ({ help }) => {
  const [comments,setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetchHelpComments(help.id);
        setComments(response);
      } catch (error) {
        console.error("Projeler veya raporlar alınırken hata oluştu:", error);
      }
    };

    fetchComments();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // API çağrısı yapılacak
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-lg border border-borderColor overflow-hidden">
      {/* Header */}
      <button
        className="px-6 py-4 border-b border-gray-200 w-full text-left"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {help.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaUser />
                <span>
                  {help.user.firstName} {help.user.lastName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock />
                <span>
                  {new Date(help.updatedAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                PRIORITY_COLORS[help.priority]
              }`}
            >
              {help.priority}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                STATUS_COLORS[help.helpstatus]
              }`}
            >
              {help.helpstatus}
            </span>
          </div>
        </div>
      </button>

      {showDetails && <div>{/* Content */}
      <div className="px-6 py-4">
        <p className="text-gray-700 whitespace-pre-wrap">{help.description}</p>

        {/* Attachments */}
        {(help.screenshotUrls.length > 0 || help.logFileUrls.length > 0) && (
          <div className="mt-4 flex gap-4">
            {help.screenshotUrls.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaImage />
                <span>{help.screenshotUrls.length} Ekran Görüntüsü</span>
              </div>
            )}
            {help.logFileUrls.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaFileAlt />
                <span>{help.logFileUrls.length} Log Dosyası</span>
              </div>
            )}
          </div>
        )}

        {/* Code Snippet */}
        {help.codeSnippet && (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaCode />
              <span>Kod Parçası</span>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{help.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {help.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {help.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <FaTag className="text-gray-400" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <FaComment />
            <span>{comments.length} Yorum</span>
          </div>
          <span className="text-xs">{showComments ? "Gizle" : "Göster"}</span>
        </button>

        {showComments && (
          <div className="px-6 py-4 space-y-4">
            {/* Comments List */}
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <img
                  src={comment.commenter.photoUrl}
                  alt={`${comment.commenter.firstName} ${comment.commenter.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.commenter.firstName} {comment.commenter.lastName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}

            {/* New Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-colorFirst text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Yorum Yap
                </button>
              </div>
            </form>
          </div>
        )}
      </div></div>}

      
    </div>
  );
};

export default HelpCard;
