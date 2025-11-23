"use client";

import { useSocket } from "@/context/SocketContext";
import Avatar from "./avatar";
import { MdCall, MdCallEnd } from "react-icons/md";

const CallNotification = () => {
  const { onGoingCall, handleJoinCall } = useSocket();

  if (!onGoingCall?.isRinging) return;
  return (
    <div className="absolute bg-slate-500 opacity-70 w-screen h-screen top-0 left-0 flex justify-center items-center">
      <div className="bg-white w-[300px] min-h-40 flex flex-col items-center justify-center rounded-xl">
        <Avatar src={onGoingCall.participants.caller.profile.imageUrl} />
        <h3>{onGoingCall.participants.caller.profile.firstName}</h3>
        <p className="text-sm mb-2">Imcoming Call</p>
        <div className="flex gap-6">
          <button onClick={() => handleJoinCall(onGoingCall)} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
            <MdCall size={24} />
          </button>
          <button className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white">
            <MdCallEnd size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
