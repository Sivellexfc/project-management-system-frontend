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
} from "react-icons/fa";
import { MdLowPriority } from "react-icons/md";
import { IoMdAlert, IoMdClose } from "react-icons/io";
import { fetchData } from "../../services/projectServices/GetUserByProject";
import { getUsersByIssue } from "../../services/issueServices/GetUsersByIssue";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { GoCheck, GoPlus } from "react-icons/go";
import { assignIssue } from "../../services/issueServices/AssignIssue";

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
  user: User;
  content: string;
  date: string;
}

interface Step {
  id: number;
  description: string;
  isDone: boolean;
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
  "User",
  "Developer",
  "Designer",
  "Tester",
  "Product Owner",
  "Scrum Master",
  "Analyst",
];

// Statik veriler (API'den gelecek)
const mockUsers: User[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "Developer",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "Tester",
  },
  {
    id: 3,
    name: "Ayşe Kaya",
    firstName: "Ayşe",
    lastName: "Kaya",
    email: "ayse.kaya@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Designer",
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Ahmet Yılmaz",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      email: "ahmet.yilmaz@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Developer",
    },
    content: "Bu görev için gerekli analiz tamamlandı.",
    date: "2024-03-15T10:30:00",
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Mehmet Demir",
      firstName: "Mehmet",
      lastName: "Demir",
      email: "mehmet.demir@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "Tester",
    },
    content: "Tasarım çalışmaları başladı.",
    date: "2024-03-15T14:45:00",
  },
];

const mockSteps: Step[] = [
  { id: 1, description: "Analiz yapılacak", isDone: true },
  { id: 2, description: "Tasarım tamamlanacak", isDone: false },
  { id: 3, description: "Kod yazılacak", isDone: false },
  { id: 4, description: "Test edilecek", isDone: false },
];

const IssueDetailCard: React.FC<Props> = ({ task, onClose }) => {
  const { projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [steps, setSteps] = useState<Step[]>(mockSteps);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [assignedUsersByRole, setAssignedUsersByRole] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(
          Cookies.get("selectedCompanyId"),
          projectId
        );
        console.log("result : ", result);
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
        console.log("users : ", transformedUsers);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const result = await getUsersByIssue(task.id);
        if (result.isSuccess) {
          setAssignedUsersByRole(result.result);
        }
      } catch (error) {
        console.error("Atanan kullanıcılar çekilirken hata oluştu:", error);
      }
    };

    fetchAssignedUsers();
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
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[id % colors.length]; // deterministik renk, id'ye göre
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        user: {
          id: 1,
          name: "Mevcut Kullanıcı",
          firstName: "Mevcut",
          lastName: "Kullanıcı",
          email: "mevcut.kullanici@example.com",
          avatar: "https://i.pravatar.cc/150?img=4",
          role: "User",
        },
        content: newComment.trim(),
        date: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
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
        await assignIssue(task.id, user.id, user.role);
      }
      console.log("Tüm kullanıcılar başarıyla atandı.");
    } catch (error) {
      console.error("Kullanıcı atama işlemi başarısız oldu:", error);
    }
  }

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
          <div className="col-span-8 space-y-6 pr-6">
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
              </div>

              {/* İçerik */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  İçerik
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {task.explanation}
                </p>
              </div>

              {/* Tarihler */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Başlangıç Tarihi
                  </h3>
                  <p className="text-gray-900">{formatDate(task.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Bitiş Tarihi
                  </h3>
                  <p className="text-gray-900">
                    {formatDate(task.deadLineDate)}
                  </p>
                </div>
              </div>

              {/* Adımlar */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Adımlar
                </h3>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`absolute left-0 w-0.5 ${
                          step.isDone ? "bg-green-500" : "bg-gray-200"
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
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.isDone
                              ? "bg-green-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {step.isDone && <FaCheck size={12} />}
                        </div>
                        <span
                          className={`flex-1 ${
                            step.isDone
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {step.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sol Kolon - Alt: Yorumlar */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Yorumlar
              </h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-700">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <img
                    src="https://i.pravatar.cc/150?img=4"
                    alt="Mevcut Kullanıcı"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Yorum ekle..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment()
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Kullanıcı Atamaları */}
          <div className="col-span-4 h-full">
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
                  <button onClick={() => handleAssignUsers()} className="border border-[#A6F268] hover:bg-[#9dee5b] hover:border-[#9dee5b] rounded-lg px-4 py-2 bg-[#A6F268] text-white">
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
            <div className="h-1/2 border border-borderColor rounded-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Atanan Kullanıcılar
              </h3>
              <div className="overflow-y-auto max-h-[calc(100%-3rem)]">
                {Object.entries(assignedUsersByRole).map(([role, users]) => (
                  <div key={role} className="space-y-2 mb-4">
                    <h5 className="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-50 rounded-md">
                      {role}
                    </h5>
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
                          <span className="text-gray-700 truncate">
                            {user.firstName + " " + user.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailCard;
