# X - Clone - Team 1

Sebuah replika (clone) dari platform media sosial **X (sebelumnya Twitter)**. Proyek ini dikembangkan menggunakan arsitektur **Monorepo** untuk mereplikasi fitur-fitur inti platform mikroblogging, mulai dari autentikasi pengguna, linimasa (feed), hingga interaksi antar pengguna secara real-time.

## 🚀 Fitur Utama

* **Authentication & User Profile**: Sistem registrasi dan login menggunakan email/password atau OAuth Google, serta manajemen profil (Avatar, Nama, Email, Password).
* **Home Feed (Timeline)**: Tampilan linimasa dinamis untuk mengeksplorasi postingan terbaru dari pengguna lain dengan layout yang responsif (Mobile & Desktop).
* **Post & Media**: Fitur CRUD (Create, Read, Update, Delete) postingan teks dan gambar. (Pembatasan: 1 user maksimal 2 postingan, tidak mendukung video).
* **Comment & Interaction**: Sistem diskusi interaktif dengan fitur komentar dan balasan (reply) berantai. (Pembatasan: 1 user maksimal 5 komentar).
* **Notification System**: Sistem notifikasi untuk aktivitas pengguna dan fitur interaksi pada postingan.

## 👥 Pembagian Tugas Anggota

| Nama Anggota | Tugas / Role |
| :--- | :--- |
| **Nayla Zakiyah Andani** | **Post & Media Specialist**<br>• Mengembangkan fitur CRUD (Create, Read, Update, Delete) postingan teks dan gambar.<br>• Menerapkan logika pembatasan postingan (maksimal 2 postingan per pengguna). |
| **Rola Dea Januarita** | **Authentication Security Engineer**<br>• Membangun halaman pendaftaran akun dan masuk (`LogIn_SignIn.tsx`).<br>• Mengintegrasikan sistem autentikasi backend ke frontend menggunakan token dan *localStorage*. |
| **Irene Nasya Azalia** | **Lead UI/UX & Main Feed Architect**<br>• Menyusun tata letak utama halaman Beranda (`Beranda.tsx`) beserta struktur tata letak dasar (Sidebar, Main Feed, Widgets).<br>• Mengatur struktur tema visual utama web. |
| **Fahdil Raihandi** | **Global Styling & Core Utility Optimizer**<br>• Mengelola gaya desain global di `index.css`, animasi, dan penyesuaian tata letak responsif.<br>• Mengoptimalkan utilitas khusus seperti scrollbar kustom (`.seo-scrollbar`) dan optimasi carousel. |
| **Nabil Nur Fauzan** | **Comment & Interaction Developer**<br>• Membangun fitur diskusi interaktif, komentar, dan balasan (reply) berantai pada setiap postingan.<br>• Menerapkan logika pembatasan interaksi (maksimal 5 komentar per pengguna). |
| **Raden Aliyah Panji Anom (Ale)** | **Notification & System Core Asset Engineer**<br>• Mengembangkan **Halaman Notifikasi** (`/notifications`) untuk merekam jejak aktivitas akun.<br>• Mengelola aset core visual sistem dan mengintegrasikan font asli Twitter secara lokal (*Chirp Fonts*). |

## 📁 Link Dokumen

Berikut adalah tautan dokumen terkait pengembangan proyek ini: 
**Google Docs:** [Dokumentasi Proyek X Clone](https://docs.google.com/document/d/1ZrP-R3a-4aLwdo6UXtwlD8vKgbSVRerFn5C7iM7VKR0/edit?usp=sharing)
