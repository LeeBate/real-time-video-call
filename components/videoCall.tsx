"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./videoContainer";

const VideoCall = () => {
  const { localStream } = useSocket();
  return (
    <div>
      {localStream && (
        <VideoContainer
          stream={localStream}
          isLocalStream={true}
          isOnCall={false}
        />
      )}
    </div>
  );
};

export default VideoCall;
