"use client";

import { useSocket } from "@/context/SocketContext";

const CallNotification = () => {
  const { onGoingCall } = useSocket();
  console.log('onCall@@',onGoingCall)
  if (!onGoingCall?.isRinging) return;
  return (
    <div className="absolute bg-slate-500 opacity-70 w-screen h-screen top-0 left-0 flex justify-center items-center">
      Some one is calling you...
    </div>
  );
};

export default CallNotification;
