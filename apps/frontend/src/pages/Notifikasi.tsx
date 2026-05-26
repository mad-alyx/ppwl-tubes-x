import React from "react";
import NotificationList from "../components/ale/NotificationList";

type Props = {
  notifications: any[];
  loadPostDetailAndComments: (id: string) => void;
};

export default function Notifikasi({ notifications, loadPostDetailAndComments }: Props) {
  return (
    <>
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4"><h2 className="text-xl font-bold">Notifikasi</h2></div>
      <NotificationList notifications={notifications} loadPostDetailAndComments={loadPostDetailAndComments} />
    </>
  );
}
