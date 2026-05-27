// components/AuthFlowModal.tsx

import { useState } from "react";
import { fetchApi } from "../../utils/api";
import { XLogo } from "./XLogo";

type FlowType = "google" | "manual";

const isValidEmailFormat = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const TOPICS = ["Tarian", "Bola Basket", "Bisnis", "Kripto", "Sains", "Mode", "Makanan", "Musik", "Permainan"];

interface AuthFlowModalProps {
  type: FlowType;
  onComplete: () => void;
}

export const AuthFlowModal = ({ type, onComplete }: AuthFlowModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: { month: "", day: "", year: "" },
    username: "",
    selectedTopics: [] as string[],
  });
  const [error, setError] = useState("");

  const showEmailError = formData.email.length > 0 && !isValidEmailFormat(formData.email);

  const handleNext = () => setStep((s) => s + 1);

  const handleManualRegister = async () => {
    try {
      setError("");
      if (formData.password !== formData.confirmPassword) {
        setError("Kata sandi tidak cocok.");
        return;
      }
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const loginRes = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      localStorage.setItem("jwt_token", loginRes.token);
      localStorage.setItem("user_data", JSON.stringify(loginRes.data));
      handleNext();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFinish = async () => {
    try {
      if (formData.username.trim()) {
        await fetchApi("/user/profile", {
          method: "PUT",
          body: JSON.stringify({ name: formData.username }),
        });
      }
    } catch (e) {
      console.error("Gagal simpan profil", e);
    } finally {
      onComplete();
    }
  };

  const toggleTopic = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic)
        ? prev.selectedTopics.filter((t) => t !== topic)
        : [...prev.selectedTopics, topic],
    }));
  };

  const isUsernameStep =
    (type === "google" && step === 2) || (type === "manual" && step === 3);
  const isNotificationStep =
    (type === "google" && step === 3) || (type === "manual" && step === 4);
  const isTopicsStep =
    (type === "google" && step === 4) || (type === "manual" && step === 5);
  const isLanguageStep =
    (type === "google" && step === 5) || (type === "manual" && step === 6);

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white">
      <div className="bg-black w-full max-w-[600px] min-h-[500px] max-h-[90vh] rounded-2xl flex flex-col p-8 relative overflow-y-auto">
        <button
          onClick={() => window.location.reload()}
          className="absolute top-4 left-4 p-2 hover:bg-gray-900 rounded-full transition text-white"
        >
          ✕
        </button>
        <XLogo className="h-8 fill-white mx-auto mb-6" />

        {/* STEP: Data Diri (manual step 1) */}
        {type === "manual" && step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-8">Buat akun Anda</h2>
            <div className="flex flex-col gap-6 mb-8">
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <div className="absolute top-2 w-full flex justify-between px-3 pointer-events-none">
                  <label className="text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Nama</label>
                  <span className="text-xs text-gray-500 hidden group-focus-within:block">{formData.name.length} / 50</span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                />
              </div>
              <div>
                <div className={`relative border rounded transition group ${showEmailError ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500" : "border-gray-700 focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0]"}`}>
                  <label className={`absolute top-2 left-3 text-xs pointer-events-none ${showEmailError ? "text-red-500" : "text-gray-500 group-focus-within:text-[#1D9BF0]"}`}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                  />
                </div>
                {showEmailError && <p className="text-red-500 text-sm mt-1 ml-1">Silakan masukkan email yang valid.</p>}
              </div>
            </div>

            <h3 className="font-bold mb-1">Tanggal lahir</h3>
            <p className="text-[#71767B] text-xs mb-4">
              Informasi ini tidak akan ditampilkan secara publik. Konfirmasikan usia Anda sendiri, meskipun akun ini untuk bisnis, hewan peliharaan, atau hal lainnya.
            </p>
            <DobSelector formData={formData} setFormData={setFormData} />

            <div className="mt-auto pt-8 flex justify-end">
              <button
                disabled={!formData.name || !formData.email || showEmailError || !formData.dob.month || !formData.dob.day || !formData.dob.year}
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-500 transition"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* STEP: Password (manual step 2) */}
        {type === "manual" && step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Anda memerlukan kata sandi</h2>
            <p className="text-[#71767B] mb-8">Pastikan kata sandi Anda memiliki 6 karakter atau lebih agar tetap aman.</p>
            <div className="flex flex-col gap-5">
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Kata Sandi</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                />
              </div>
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                />
              </div>
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1">Kata sandi tidak cocok.</p>
            )}
            {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
            <div className="mt-auto pt-8">
              <button
                disabled={formData.password.length < 6 || formData.password !== formData.confirmPassword}
                onClick={handleManualRegister}
                className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Daftar
              </button>
            </div>
          </div>
        )}

        {/* STEP: Tanggal Lahir (google step 1) */}
        {type === "google" && step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Kapan tanggal lahir Anda?</h2>
            <p className="text-[#71767B] mb-8">Ini tidak akan ditampilkan secara publik.</p>
            <DobSelector formData={formData} setFormData={setFormData} />
            <div className="mt-auto pt-8">
              <button
                disabled={!formData.dob.month || !formData.dob.day || !formData.dob.year}
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* STEP: Username */}
        {isUsernameStep && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Siapa nama panggilan Anda?</h2>
            <p className="text-[#71767B] mb-8">Username @ Anda unik. Anda selalu bisa mengubahnya nanti.</p>
            <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
              <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Nama Pengguna</label>
              <span className="absolute left-3 top-6 text-white">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-transparent outline-none text-lg pt-6 pb-2 pl-8 pr-3"
              />
            </div>
            <button className="text-[#1D9BF0] text-sm mt-4 text-left hover:underline" onClick={handleNext}>
              Lewati untuk saat ini
            </button>
            <div className="mt-auto pt-8">
              <button onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition">
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* STEP: Notifikasi */}
        {isNotificationStep && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-2">Nyalakan notifikasi</h2>
            <p className="text-[#71767B] mb-8">Dapatkan hasil maksimal dari X dengan tetap mengikuti perkembangan terkini.</p>
            <button onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full mb-4 hover:bg-gray-200 transition">Izinkan notifikasi</button>
            <button onClick={handleNext} className="w-full border border-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-900 transition">Nanti saja</button>
          </div>
        )}

        {/* STEP: Pilih Topik */}
        {isTopicsStep && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Apa yang ingin Anda lihat di X?</h2>
            <p className="text-[#71767B] mb-8">Pilih yang Anda suka, dan kami akan menyesuaikan pengalaman Anda.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {TOPICS.map((topic) => {
                const isSelected = formData.selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`relative border rounded-xl p-4 h-20 flex items-end font-bold transition text-left ${isSelected ? "bg-[#1D9BF0] border-[#1D9BF0]" : "border-gray-700 hover:bg-[#1D9BF0]/10"}`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-white text-[#1D9BF0] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</div>
                    )}
                    {topic}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-4">
              <button
                disabled={formData.selectedTopics.length === 0}
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* STEP: Pilih Bahasa */}
        {isLanguageStep && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Pilih bahasa</h2>
            <p className="text-[#71767B] mb-8">Postingan, orang, dan tren akan disesuaikan dengan bahasa pilihan Anda.</p>
            <label className="flex items-center justify-between p-4 border border-[#1D9BF0] rounded-xl">
              <span className="font-bold">Bahasa Indonesia</span>
              <input type="checkbox" checked readOnly className="w-5 h-5 accent-[#1D9BF0]" />
            </label>
            <div className="mt-auto pt-8">
              <button onClick={handleFinish} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition">
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-komponen DateOfBirth Selector (dipakai ulang di dua step)
const DobSelector = ({ formData, setFormData }: { formData: any; setFormData: (d: any) => void }) => (
  <div className="flex gap-4">
    <div className="flex-2 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
      <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Bulan</label>
      <select
        className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer"
        onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, month: e.target.value } })}
      >
        <option value="" disabled className="hidden" />
        {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map((m) => (
          <option key={m} className="bg-black">{m}</option>
        ))}
      </select>
    </div>
    <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
      <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Hari</label>
      <select
        className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer"
        onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, day: e.target.value } })}
      >
        <option value="" disabled className="hidden" />
        {Array.from({ length: 31 }, (_, i) => (
          <option key={i + 1} className="bg-black">{i + 1}</option>
        ))}
      </select>
    </div>
    <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
      <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Tahun</label>
      <select
        className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer"
        onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, year: e.target.value } })}
      >
        <option value="" disabled className="hidden" />
        {Array.from({ length: 100 }, (_, i) => (
          <option key={i} className="bg-black">{2024 - i}</option>
        ))}
      </select>
    </div>
  </div>
);