import React from "react";
import { X, Camera, ChevronRight } from "lucide-react";

type Props = {
  isProfileEditOpen: boolean;
  editProfileName: string;
  setEditProfileName: (v: string) => void;
  editProfileBio: string;
  setEditProfileBio: (v: string) => void;
  editProfileLocation: string;
  setEditProfileLocation: (v: string) => void;
  editProfileWebsite: string;
  setEditProfileWebsite: (v: string) => void;
  editProfileImage: string | null;
  setEditProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  editProfileBanner: string | null;
  setEditProfileBanner: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean;
  handleProfileSave: (e: React.FormEvent) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  onClose: () => void;
};

export default function EditProfileModal({
  isProfileEditOpen,
  editProfileName,
  setEditProfileName,
  editProfileBio,
  setEditProfileBio,
  editProfileLocation,
  setEditProfileLocation,
  editProfileWebsite,
  setEditProfileWebsite,
  editProfileImage,
  setEditProfileImage,
  editProfileBanner,
  setEditProfileBanner,
  isSubmitting,
  handleProfileSave,
  handleImageUpload,
  onClose
}: Props) {
  if (!isProfileEditOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black w-full max-w-150 h-[90vh] sm:h-[80vh] rounded-2xl flex flex-col relative border border-gray-800 overflow-hidden">
        <form onSubmit={handleProfileSave} className="flex flex-col h-full">
          
          {/* Header Modal Profil */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/90 backdrop-blur z-10 sticky top-0">
            <div className="flex items-center gap-6">
              <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
              <h2 className="font-bold text-xl">Edit profile</h2>
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-white text-black font-bold py-1.5 px-4 rounded-full hover:bg-gray-200 transition disabled:opacity-50">Save</button>
          </div>

          {/* Konten Scroll Modal Profil */}
          <div className="overflow-y-auto flex-1 pb-8">
            
            {/* Area Sampul (Banner) & Avatar */}
            <div className="relative">
              <div className="h-32 sm:h-48 bg-gray-800 w-full relative flex items-center justify-center group overflow-hidden">
                {editProfileBanner && <img src={editProfileBanner} className="w-full h-full object-cover" />}
                <label className="absolute flex items-center justify-center w-11 h-11 bg-black/50 hover:bg-black/40 rounded-full cursor-pointer transition">
                   <Camera className="w-5 h-5 text-white" />
                   <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setEditProfileBanner)} />
                </label>
              </div>
              
              <div className="absolute -bottom-12 left-4 w-28 h-28 bg-black rounded-full p-1 group">
                <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden relative flex items-center justify-center cursor-pointer">
                  {editProfileImage ? <img src={editProfileImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition" /> : <span className="text-4xl text-gray-400">{editProfileName.charAt(0)}</span>}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <Camera className="w-6 h-6 text-white"/>
                    <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, setEditProfileImage)} />
                  </label>
                </div>
              </div>
            </div>

            {/* Form Input Twitter-style */}
            <div className="mt-16 px-4 space-y-6">
              
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Name</label>
                <input type="text" value={editProfileName} onChange={(e) => setEditProfileName(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" required maxLength={50}/>
              </div>

              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Bio</label>
                <textarea value={editProfileBio} onChange={(e) => setEditProfileBio(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3 resize-none" rows={3} maxLength={160}/>
              </div>

              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Location</label>
                <input type="text" value={editProfileLocation} onChange={(e) => setEditProfileLocation(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" maxLength={30}/>
              </div>

              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Website</label>
                <input type="text" value={editProfileWebsite} onChange={(e) => setEditProfileWebsite(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" maxLength={100}/>
              </div>

              {/* Elemen Visual Menyerupai Referensi */}
              <div className="pt-2 pb-1 cursor-pointer hover:bg-white/5 transition flex items-center justify-between group">
                <div>
                  <p className="text-gray-500 text-[15px]">Birth date</p>
                  <p className="text-[#E7E9EA] text-lg group-hover:text-[#1D9BF0] transition">May 5, 2006</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
              
              <div className="py-3 cursor-pointer hover:bg-white/5 transition flex items-center justify-between group">
                <p className="text-[#E7E9EA] text-lg font-bold group-hover:text-white transition">Switch to professional</p>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
