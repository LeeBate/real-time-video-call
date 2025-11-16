"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import Avatar from "./avatar";

const ListOnlineUsers = () => {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();
  return (
    <div className="flex border-b border-b-primary/10 w-full items-center pb-2">
      {onlineUsers &&
        onlineUsers.map((userItem) => {
          if (userItem.profile.id === user?.id) return null;
          return (
            <div key={userItem.userId} onClick={() => handleCall(userItem)} className="flex flex-col items-center cursor-pointer">
              <Avatar src={userItem.profile.imageUrl} />
              <div>{userItem.profile.firstName}</div>
            </div>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
