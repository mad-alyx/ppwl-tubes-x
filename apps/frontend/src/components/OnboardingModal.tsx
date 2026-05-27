// apps/frontend/src/components/OnboardingModal.tsx

import React, { useState } from "react";

interface OnboardingModalProps {
  onComplete: (data: any) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    username: "",
    notifications: false,
    interests: [] as string[],
    language: "Bahasa Indonesia",
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onComplete(formData);
  };

  const handleSkip = () => {
    if (step < 5) setStep(step + 1);
    else onComplete(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const Xlogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 fill-white mx-auto mb-6">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242d34]/60 backdrop-blur-sm">
      <div className="w-full max-w-[600px] bg-black text-[#E7E9EA] rounded-2xl p-8 flex flex-col relative border border-gray-800 min-h-[500px]">
        <Xlogo />

        <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
          {/* TAHAP 1: Tanggal Lahir */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Kapan tanggal lahir Anda?</h2>
              <p className="text-gray-500 mb-8 text-sm">Ini tidak akan ditampilkan ke publik.</p>
              
              <div className="flex gap-4">
                <select
                  className="flex-[2] p-4 bg-transparent border border-gray-700 rounded focus:border-[#1D9BF0] outline-none appearance-none"
                  value={formData.birthMonth}
                  onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                >
                  <option value="" disabled>Bulan</option>
                  {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => (
                    <option key={m} value={m} className="bg-black">{m}</option>
                  ))}
                </select>
                <select
                  className="flex-1 p-4 bg-transparent border border-gray-700 rounded focus:border-[#1D9BF0] outline-none appearance-none"
                  value={formData.birthDay}
                  onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                >
                  <option value="" disabled>Hari</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d} className="bg-black">{d}</option>
                  ))}
                </select>
                <select
                  className="flex-1 p-4 bg-transparent border border-gray-700 rounded focus:border-[#1D9BF0] outline-none appearance-none"
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                >
                  <option value="" disabled>Tahun</option>
                  {Array.from({ length: 100 }, (_, i) => 2026 - i).map(y => (
                    <option key={y} value={y} className="bg-black">{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAHAP 2: Nama Panggilan */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Siapa nama panggilan Anda?</h2>
              <p className="text-gray-500 mb-8 text-sm">@username Anda bersifat unik. Anda selalu dapat mengubahnya nanti.</p>
              
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-500">@</span>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-4 pl-10 bg-transparent border border-gray-700 rounded focus:border-[#1D9BF0] outline-none"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAHAP 3: Notifikasi */}
          {step === 3 && (
            <div className="animate-fade-in flex flex-col items-center justify-center text-center mt-8">
              <div className="w-16 h-16 rounded-full border-2 border-[#1D9BF0] flex items-center justify-center mb-6">
                <span className="text-3xl">🔔</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Aktifkan notifikasi</h2>
              <p className="text-gray-500 mb-10 text-sm max-w-sm">
                Dapatkan hasil maksimal dari X dengan terus mengikuti perkembangan yang sedang terjadi.
              </p>
              
              <div className="w-full max-w-sm flex flex-col gap-4">
                <button
                  onClick={() => {
                    setFormData({ ...formData, notifications: true });
                    handleNext();
                  }}
                  className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition"
                >
                  Izinkan notifikasi
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full border border-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-900 transition"
                >
                  Lewati untuk saat ini
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 4: Minat (Interests) */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Apa yang ingin Anda lihat di X?</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Pilih apa yang Anda sukai, dan kami akan menyesuaikan pengalaman Anda.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Teknologi", "Sains", "Olahraga", "Musik", "Bisnis & Keuangan", "Film", "Kripto", "Game", "Makanan"].map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <div
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`h-24 p-4 rounded-xl border cursor-pointer transition flex items-end justify-between ${
                        isSelected ? "bg-[#1D9BF0] border-[#1D9BF0]" : "border-gray-700 hover:bg-gray-900"
                      }`}
                    >
                      <span className="font-bold text-sm">{interest}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <span className="text-[#1D9BF0] text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAHAP 5: Bahasa */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Pilih bahasa</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Anda akan dapat melihat postingan, orang, dan tren dalam bahasa yang Anda pilih.
              </p>
              
              <div className="flex items-center justify-between p-4 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-900">
                <span className="font-bold">Bahasa Indonesia</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  readOnly
                  className="w-5 h-5 accent-[#1D9BF0]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer & Tombol Navigasi */}
        {step !== 3 && ( // Tahap 3 memiliki tombol aksinya sendiri di tengah
          <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-sm text-gray-500">Tahap {step} dari 5</span>
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.birthMonth || !formData.birthDay || !formData.birthYear)) ||
                (step === 2 && !formData.username)
              }
              className="bg-white text-black font-bold py-2 px-8 rounded-full disabled:opacity-50 hover:bg-gray-200 transition"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}