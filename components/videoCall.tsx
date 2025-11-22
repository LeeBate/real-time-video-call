"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./videoContainer";
import { useCallback, useState } from "react";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";

const VideoCall = () => {
  const { localStream } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        setIsCameraOn((prev) => {
          const newState = !prev;
          videoTrack.enabled = newState;
          return newState;
        });
      }
    }
  }, [localStream, isCameraOn]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        setIsMicOn((prev) => {
          const newState = !prev;
          audioTrack.enabled = newState;
          return newState;
        });
      }
    }
  }, [localStream, isMicOn]);

  const endCall = useCallback(() => {
    // Implement end call logic here
  }, []);
  return (
    <div>
      {localStream && (
        <div className="flex flex-col justify-center items-center mt-4">
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={false}
          />
          <div className="flex gap-4 mt-4">
            <button onClick={toggleMic}>
              {isMicOn && <MdMic size={24} />}
              {!isMicOn && <MdMicOff size={24} />}
            </button>

            <button onClick={toggleCamera}>
              {isCameraOn && <MdVideocam size={24} />}
              {!isCameraOn && <MdVideocamOff size={24} />}
            </button>

            <button
              onClick={endCall}
              className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white"
            >
              <MdCallEnd size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
