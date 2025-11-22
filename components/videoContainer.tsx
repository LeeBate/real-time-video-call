import { useEffect, useRef } from "react";

interface iVideoCContainer {
  stream: MediaStream;
  isLocalStream?: boolean;
  isOnCall?: boolean;
}

const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: iVideoCContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className=" rounded border w-[800px]"
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  );
};

export default VideoContainer;
