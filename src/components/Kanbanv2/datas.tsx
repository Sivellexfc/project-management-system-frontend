import { Column, Task } from "./types";

export const columns: Column[] = [
    {
        id: 1,
        title: "New Request"
    },
    {
        id: 2,
        title: "In Progress"
    },
    {
        id: 3,
        title: "Review"
    },
    {
        id: 4,
        title: "Completed"
    }
];

export const tasks: Task[] = [
    {
        id: 1,
        columnId: 1,
        title: "Login Page Bug",
        content: "Kullanıcı giriş yaparken yanlış hata mesajı gösteriliyor."
    },
    {
        id: 2,
        columnId: 2,
        title: "Checkout API Refactor",
        content: "Ödeme süreci için API optimizasyonu yapılıyor."
    },
    {
        id: 3,
        columnId: 3,
        title: "UI Design Feedback",
        content: "Ana sayfa tasarımında küçük değişiklikler önerildi."
    },
    {
        id: 4,
        columnId: 4,
        title: "User Profile Feature",
        content: "Kullanıcı profil sayfası tamamlandı ve yayına hazır."
    },
    {
        id: 5,
        columnId: 1,
        title: "Mobile App Crash",
        content: "Android cihazlarda beklenmedik çökme hatası raporlandı."
    },
    {
        id: 6,
        columnId: 2,
        title: "Backend Performance Tuning",
        content: "Veritabanı sorguları optimize ediliyor."
    },
    {
        id: 7,
        columnId: 3,
        title: "Security Audit Review",
        content: "Son güvenlik testleri tamamlandı, rapor hazırlanıyor."
    },
    {
        id: 8,
        columnId: 4,
        title: "Dark Mode Implementation",
        content: "Karanlık mod özelliği başarıyla tamamlandı."
    }
];