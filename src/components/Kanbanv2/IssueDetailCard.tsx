import React, { useState, useRef, useEffect } from "react";
import { Task } from "./types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  FaFlag,
  FaTimes,
  FaSearch,
  FaPlus,
  FaTrash,
  FaCheck,
  FaUser,
  FaComment,
  FaHistory,
  FaUsers,
  FaTag,
  FaEdit,
  FaUserPlus,
  FaUserMinus,
  FaArrowRight,
} from "react-icons/fa";
import { MdLowPriority } from "react-icons/md";
import { IoMdAlert, IoMdClose } from "react-icons/io";
import { fetchData } from "../../services/projectServices/GetUserByProject";
import { getUsersByIssue } from "../../services/issueServices/GetUsersByIssue";
import { getIssueHistory } from "../../services/issueServices/GetIssueHistory";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { GoCheck, GoPlus } from "react-icons/go";
import { assignIssue } from "../../services/issueServices/AssignIssue";
import { getStepsByIssueId } from "../../services/issueServices/GetIssueStepsById";
import {
  createComment,
  getCommentsByIssueId,
  deleteComment,
} from "../../services/commentServices/CommentServices";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { deleteIssue } from "../../services/issueServices/DeleteIssue";
import { updateIssueStage } from "../../services/issueServices/UpdateIssueStage";

interface Props {
  task: Task;
  onClose: () => void;
}

interface User {
  id: number;
  name: string; // full name opsiyonel olabilir
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
}

interface AssignedUser extends User {
  role: string;
}

interface Comment {
  id: number;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    photo: string;
  };
  edited: boolean;
}

interface Step {
  stepNumber: number;
  id: number;
  description: string;
  isDone: boolean;
}

interface HistoryItem {
  id: number;
  issue: {
    id: number;
    name: string;
  };
  modifiedBy: {
    id: number;
    firstName: string;
    lastName: string;
    photo: string;
  };
  changeDescription: string;
  modifiedAt: string;
  expirationDate: string;
}

const PRIORITY_COLORS = {
  0: "text-gray-500", // Çok Düşük
  1: "text-blue-500", // Düşük
  2: "text-yellow-500", // Orta
  3: "text-orange-500", // Yüksek
  4: "text-red-500", // Çok Yüksek
};

const LABEL_INFO = {
  1: { name: "Acil", color: "#FF4444" },
  2: { name: "Hata Düzeltme", color: "#FF8C00" },
  3: { name: "Geliştirme", color: "#4169E1" },
  4: { name: "İyileştirme", color: "#32CD32" },
};

const ROLES = [
  "DEVELOPER",
  "REPORTER",
  "REVIEWER",
  "TESTER",
  "PAIR_ASSIGNE", // Çift olarak görev alan geliştirici
  "QA_ASSIGNE",
];

interface CustomJwtPayload extends JwtPayload {
  userRole: string;
}

const IssueDetailCard: React.FC<Props> = ({ task, onClose }) => {
  const { projectId } = useParams();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [stepss, setStepss] = useState<Step[]>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [assignedUsersByRole, setAssignedUsersByRole] = useState<{
    [key: string]: any[];
  }>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const companyId = Cookies.get("selectedCompanyId");

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      setCurrentUserRole(decoded.userRole);
    }

    const getData = async () => {
      try {
        const result = await fetchData(
          Cookies.get("selectedCompanyId"),
          projectId
        );
        const transformedUsers: User[] = result.result.map((u: any) => ({
          id: u.user.id,
          firstName: u.user.firstName,
          lastName: u.user.lastName,
          email: u.user.email,
          avatar: u.user.avatar,
          role: u.role.name,
          name: u.user.firstName + " " + u.user.lastName,
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    const getSteps = async () => {
      try {
        const response = await getStepsByIssueId(task.id);
        setSteps(response.result);

        console.log("users : ");
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getSteps();
    getData();
  }, []);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const result = await getUsersByIssue(task.id);
        console.log("assigned users : ", result);
        if (result.isSuccess) {
          setAssignedUsersByRole(result.result);
        }
      } catch (error) {
        console.error("Atanan kullanıcılar çekilirken hata oluştu:", error);
      }
    };

    fetchAssignedUsers();
  }, [task.id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const companyId = Cookies.get("selectedCompanyId");
        if (!companyId || !projectId) return;

        const response = await getCommentsByIssueId(
          companyId,
          projectId,
          Number(task.id)
        );
        if (response.isSuccess) {
          setComments(response.result.comments);
        }
      } catch (error) {
        console.error("Yorumlar alınırken hata oluştu:", error);
      }
    };

    fetchComments();
  }, [task.id, projectId]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getIssueHistory(task.id);
        if (response.isSuccess) {
          setHistory(response.result);
        }
      } catch (error) {
        console.error("Geçmiş verileri alınırken hata oluştu:", error);
      }
    };

    fetchHistory();
  }, [task.id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: tr });
  };

  const handleUserSelect = (user: User) => {
    if (!assignedUsers.find((u) => u.id === user.id)) {
      setAssignedUsers([...assignedUsers, { ...user, role: user.role }]);
    }
    setIsUserDropdownOpen(false);
  };

  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setAssignedUsers(
      assignedUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };
  const getInitials = (firstName: string = "", lastName: string = "") => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (id: number) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-sky-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[id % colors.length]; // deterministik renk, id'ye göre
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const companyId = Cookies.get("selectedCompanyId");
        if (!companyId || !projectId) return;

        const response = await createComment(
          companyId,
          projectId,
          Number(task.id),
          newComment.trim()
        );
        if (response.isSuccess) {
          setComments([response.result, ...comments]);
          setNewComment("");
        }
      } catch (error) {
        console.error("Yorum eklenirken hata oluştu:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const companyId = Cookies.get("selectedCompanyId");
      if (!companyId || !projectId) return;

      const response = await deleteComment(
        companyId,
        projectId,
        Number(task.id),
        commentId
      );
      if (response.isSuccess) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Yorum silinirken hata oluştu:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAssignUsers(): Promise<void> {
    try {
      for (const user of assignedUsers) {
        await assignIssue(task.id, user.id, user.role.toUpperCase());
      }
      console.log("Tüm kullanıcılar başarıyla atandı.");
    } catch (error) {
      console.error("Kullanıcı atama işlemi başarısız oldu:", error);
    }
  }

  const getHistoryIcon = (description: string) => {
    if (description.includes("Label Updated")) return <FaTag className="text-blue-500" />;
    if (description.includes("Issue created")) return <FaPlus className="text-green-500" />;
    if (description.includes("assigned")) return <FaUserPlus className="text-purple-500" />;
    if (description.includes("unassigned")) return <FaUserMinus className="text-red-500" />;
    if (description.includes("updated")) return <FaEdit className="text-yellow-500" />;
    return <FaHistory className="text-gray-500" />;
  };

  const formatHistoryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      return format(date, "dd MMMM yyyy HH:mm", { locale: tr });
    }
  };

  const handleDeleteIssue = async () => {
    try {
      if (!companyId || !projectId) return;
      
      const response = await deleteIssue(projectId, task.id);
      if (response.isSuccess) {
        setShowDeleteModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Issue silinirken hata oluştu:", error);
    }
  };

  const handleCompleteIssue = async () => {
    try {
      if (!companyId || !projectId) return;
      
      const response = await updateIssueStage( projectId, task.id, "DONE");
      if (response.isSuccess) {
        setShowCompleteModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Issue tamamlanırken hata oluştu:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{task.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sol Kolon - Üst: Detay Bilgileri */}
          <div className="col-span-8 space-y-6">
            <div className="space-y-4">
              {/* Öncelik ve Etiket */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFlag
                    className={
                      PRIORITY_COLORS[
                        task.priorityId as keyof typeof PRIORITY_COLORS
                      ]
                    }
                  />
                  <span className="text-sm text-gray-600">
                    {task.priorityId === 0
                      ? "Çok Düşük"
                      : task.priorityId === 1
                      ? "Düşük"
                      : task.priorityId === 2
                      ? "Orta"
                      : task.priorityId === 3
                      ? "Yüksek"
                      : "Çok Yüksek"}
                  </span>
                </div>
                {task.labelId && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          LABEL_INFO[task.labelId as keyof typeof LABEL_INFO]
                            .color,
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {LABEL_INFO[task.labelId as keyof typeof LABEL_INFO].name}
                    </span>
                  </div>
                )}
                <span className="text-sm text-primary opacity-60 font-light">
                  {formatDate(task.startDate) +
                    " - " +
                    formatDate(task.deadLineDate)}
                </span>
              </div>

              {/* İçerik */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Açıklama
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {task.explanation}
                </p>
              </div>

              {/* Adımlar ve Geçmiş */}
              <div className="grid grid-cols-2 gap-6">
                {/* Sol Taraf - Adımlar */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Adımlar
                  </h3>
                  <div className="relative pl-6">
                    <div className="absolute left-[32.5px] top-0 bottom-0 w-0.5 bg-gray-200">
                      {steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`absolute left-0 w-0.5 ${
                            step.isDone ? "bg-green-500" : "bg-gray-100"
                          }`}
                          style={{
                            top: `${(index * 100) / steps.length}%`,
                            height: `${100 / steps.length}%`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-4 relative"
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              step.isDone
                                ? "bg-green-500 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {step.isDone && <FaCheck size={10} />}
                          </div>
                          <span
                            className={`flex-1 ${
                              step.isDone
                                ? "line-through text-primary text-sm opacity-60"
                                : "text-primary text-sm opacity-70"
                            }`}
                          >
                            {step.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sağ Taraf - Geçmiş */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Geçmiş
                  </h3>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {getHistoryIcon(item.changeDescription)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            {item.changeDescription}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.modifiedBy.firstName} {item.modifiedBy.lastName} tarafından
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatHistoryDate(item.modifiedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Yorumlar */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Yorumlar
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-500">Henüz yorum bulunmamaktadır</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 ">
                      <div className="flex items-start gap-3">
                        {comment.user.photo && false ? (
                          <img
                            src={comment.user.photo}
                            alt={`${comment.user.firstName} ${comment.user.lastName}`}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                              comment.user.id
                            )}`}
                            title={`${comment.user.firstName} ${comment.user.lastName}`}
                          >
                            {getInitials(
                              comment.user.firstName,
                              comment.user.lastName
                            )}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                              {comment.edited && (
                                <span className="text-xs text-gray-400">
                                  (düzenlendi)
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                          <p className="text-gray-600">{comment.commentText}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Yorum ekle..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Kullanıcı Atamaları */}
          <div className="col-span-4 h-full">
            {(currentUserRole === "COMPANY_OWNER" ||
              currentUserRole === "PROJECT_MANAGER") && (
              <div className="h-1/2 border border-borderColor rounded-sm p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Kullanıcı Ata
                </h3>
                <div className="relative" ref={dropdownRef}>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        className="w-full pl-10 pr-4 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsUserDropdownOpen(true);
                        }}
                        onFocus={() => setIsUserDropdownOpen(true)}
                      />
                    </div>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="px-4 py-2 bg-colorFirst border border-borderColor hover:bg-borderColor text-primary rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <GoPlus />
                    </button>
                    <button
                      onClick={() => handleAssignUsers()}
                      className="border border-[#A6F268] hover:bg-[#9dee5b] hover:border-[#9dee5b] rounded-lg px-4 py-2 bg-[#A6F268] text-white"
                    >
                      <GoCheck />
                    </button>
                  </div>
  
                  {isUserDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                                  user.id
                                )}`}
                                title={`${user.firstName} ${user.lastName}`}
                              >
                                {getInitials(user.firstName, user.lastName)}
                              </div>
                              <span className="text-gray-700">
                                {user.firstName + " " + user.lastName}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Kullanıcı bulunamadı
                        </div>
                      )}
                    </div>
                  )}
  
                  <div className="space-y-2">
                    {assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                              user.id
                            )}`}
                            title={`${user.firstName} ${user.lastName}`}
                          >
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <span className="text-gray-700 whitespace-nowrap">
                            {user.firstName + " " + user.lastName}
                          </span>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1"
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
  
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-gray-300 hover:text-primary px-2"
                        >
                          <IoMdClose size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-1/2 border border-borderColor rounded-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Atanan Kullanıcılar
                </h3>
                
              </div>
              <div className="overflow-y-auto max-h-[calc(100%-3rem)]">
                {Object.entries(assignedUsersByRole).map(([role, users]) => (
                  <div key={role} className="space-y-2 mb-4">
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center gap-2 p-2 rounded-lg"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                              user.userId
                            )}`}
                            title={`${user.firstName} ${user.lastName}`}
                          >
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <div className="flex flex-raw justify-between w-full">
                            <span className="text-gray-700 truncate">
                              {user.firstName + " " + user.lastName}
                            </span>
                            <span className="text-primary text-sm opacity-50 font-light truncate">
                              {role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {(currentUserRole === "COMPANY_OWNER" ||
                  currentUserRole === "PROJECT_MANAGER") && (
                  <div className="flex gap-2 py-5 align-right">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center text-sm"
                    >
                      <FaTrash className="mr-1.5" />
                      Sil
                    </button>
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 flex items-center text-sm"
                    >
                      <FaCheck className="mr-1.5" />
                      Tamamla
                    </button>
                  </div>
                )}
          </div>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Görevi Sil
            </h3>
            <p className="text-gray-600 mb-6">
              "{task.name}" görevini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteIssue}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tamamlama Onay Modalı */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Görevi Tamamla
            </h3>
            <p className="text-gray-600 mb-6">
              "{task.name}" görevini tamamlamak istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleCompleteIssue}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetailCard;
