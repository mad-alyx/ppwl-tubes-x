import React from "react";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import ProfileView from "../components/ale/ProfileView";

type Props = {
  userProfile: any;
  switchView: (v: any) => void;
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post"|"comment") => Promise<void>;
  ItemMenu: any;
  loadPostDetailAndComments: (id: string) => void;
  setIsProfileEditOpen: (v: boolean) => void;
};

export default function EditProfile({ userProfile, switchView, setReplyingTo, handleLike, ItemMenu, loadPostDetailAndComments, setIsProfileEditOpen }: Props) {
  if (!userProfile) return null;

  return (
    <ProfileView
      userProfile={userProfile}
      switchView={switchView}
      setReplyingTo={setReplyingTo}
      handleLike={handleLike}
      ItemMenu={ItemMenu}
      loadPostDetailAndComments={loadPostDetailAndComments}
      setIsProfileEditOpen={setIsProfileEditOpen}
    />
  );
}
