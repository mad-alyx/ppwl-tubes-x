import React from 'react';

export default function PostCard({ user, handle }: { user: string, handle: string }) {
  return (
    <div className="p-4 hover:bg-[#0F1419]/50 transition cursor-pointer flex gap-3">
      <div className="w-10 h-10 rounded-full bg-[#2F3336] shrink-0" />
      <div className="flex-1">
        <div className="flex gap-2 items-center">
          <span className="font-bold text-white hover:underline">{user}</span>
          <span className="text-[#71767B] text-sm">@{handle} · 2h</span>
        </div>
        <p className="mt-1 text-[#E7E9EA]"> Clone X </p>
        <div className="flex justify-between mt-3 text-[#71767B] max-w-md pr-4">
          <span className="hover:text-[#1D9BF0] transition flex items-center gap-2 text-sm">💬 5</span>
          <span className="hover:text-[#00BA7C] transition flex items-center gap-2 text-sm">🔄 2</span>
          <span className="hover:text-[#F4212E] transition flex items-center gap-2 text-sm">❤️ 10</span>
          <span className="hover:text-[#1D9BF0] transition flex items-center gap-2 text-sm">📊 1.2K</span>
        </div>
      </div>
    </div>
  );
}