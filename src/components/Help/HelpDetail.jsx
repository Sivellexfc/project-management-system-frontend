import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaTag,
  FaUser,
  FaClock,
  FaComment,
  FaCode,
  FaPaperclip,
  FaSpinner,
  FaPaperPlane,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getHelpById } from "../../services/helpServices/GetHelpById";
import { fetchHelpComments } from "../../services/helpServices/GetHelpComments";
import {createHelpComment} from "../../services/helpServices/CreateHelpComment";
import {getUserDetails} from "../../services/userServices/GetUserDetails";
import Cookies from "js-cookie";
import { getInitials } from "../utils/GetInitials";
import { getRandomColor } from "../utils/GetRandomColor";
import { jwtDecode } from "jwt-decode";

const HelpDetail = () => {
  const { id } = useParams();
  const [help, setHelp] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0); // render sonrası çalışması için küçük bir gecikme

    return () => clearTimeout(timeout);
  }, [comments]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await fetchHelpComments(id);
      setComments(response);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata oluştu:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      console.error("Yorum gönderilemedi: Kullanıcı bilgileri eksik");
      return;
    }

    try {
      setSubmittingComment(true);
      await createHelpComment(id, newComment.trim());
      setNewComment("");
      
      // Yorumları yeniden çek
      await fetchComments();
    } catch (err) {
      console.error("Yorum gönderilirken hata oluştu:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingComments(true);

        // Kullanıcı bilgilerini al
        const token = Cookies.get("accessToken");
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          const userDetails = await getUserDetails(decodedToken.userId);
          setCurrentUser(userDetails.result);
        }

        // Paralel olarak verileri çek
        const [helpResponse, commentsResponse] = await Promise.all([
          getHelpById(id),
          fetchHelpComments(id)
        ]);

        setHelp(helpResponse);
        setComments(commentsResponse);
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingComments(false);
      }
    };

    fetchData();
  }, [id]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e);
    }
  };

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

  if (loading || loadingComments) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-colorFirst mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-colorFirst text-white rounded-md hover:bg-blue-600"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!help) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {help.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Açıklama
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {help.description}
              </p>
            </div>

            {/* Code Snippet */}
            {help.codeSnippet && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaCode className="text-gray-500" />
                  Kod Parçası
                </h2>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono">{help.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Attachments */}
            {(help.screenshotUrls?.length > 0 ||
              help.logFileUrls?.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FaPaperclip className="text-gray-500" />
                  Ekler
                </h2>
                <div className="space-y-4">
                  {help.screenshotUrls?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Ekran Görüntüleri
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {help.screenshotUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="rounded-lg shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {help.logFileUrls?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Log Dosyaları
                      </h3>
                      <div className="space-y-2">
                        {help.logFileUrls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaPaperclip />
                            <span>Log Dosyası {index + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className=" bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FaComment className="text-gray-500" />
                Yorumlar
              </h2>

              {/* Comments List */}
              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <FaSpinner className="animate-spin text-2xl text-colorFirst" />
                </div>
              ) : (
                <div ref={scrollRef} className="max-h-[600px] overflow-y-auto space-y-4 mb-6">
                  {comments.map((comment, index) => (
                    <div key={comment.id || index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getRandomColor(
                            comment.commenter?.userId
                          )}`}
                          title={`${comment.commenter?.firstName || ''} ${comment.commenter?.lastName || ''}`}
                        >
                          <span className="text-sm font-light">
                            {getInitials(
                              comment.commenter?.firstName || '',
                              comment.commenter?.lastName || ''
                            )}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.commenter?.firstName} {comment.commenter?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Şimdi'}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </p>
                  )}
                </div>
              )}

              {/* New Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mt-6">
                <div className="flex gap-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentUser ? "Yorumunuzu yazın... (Enter ile gönderin)" : "Yorum yapmak için giriş yapmalısınız"}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={!currentUser}
                  />
                  <button
                    type="submit"
                    disabled={!currentUser || submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-colorFirst border border-borderColor text-primary hover:bg-borderColor rounded-md hover:bg-blue-600 flex items-center gap-2 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      help.helpstatus
                    )}`}
                  >
                    {help.helpstatus}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Öncelik</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      help.priority
                    )}`}
                  >
                    {help.priority}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Oluşturan
                  </h3>
                  <div className="inline-flex flex-row items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm  ${getRandomColor(
                        help.user.userId
                      )}`}
                      title={`${help.user.firstName} ${help.user.lastName}`}
                    >
                      <span className="text-sm font-light">
                        {getInitials(help.user.firstName, help.user.lastName)}
                      </span>
                    </div>
                    <span className="whitespace-nowrap">
                      {help.user.firstName} {help.user.lastName}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Oluşturulma Tarihi
                  </h3>
                  <p className="text-sm text-gray-900">
                    {new Date(help.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Mentions */}
            {help.mentions?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Bahsedilenler
                </h3>
                <div className="space-y-2">
                  {help.mentions.map((mention, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {mention.firstName} {mention.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDetail;
