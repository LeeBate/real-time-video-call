/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
import ModalWarning from "@/components/modalWarning";
import { OnCall, Participants, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useModalWarning } from "./ModalContext";

interface iSocketContext {
  onlineUsers?: SocketUser[] | null;
  handleCall: (user: SocketUser) => void;
  onGoingCall?: OnCall | null;
  localStream?: MediaStream | null;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const {openModal} = useModalWarning()
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnect, setIsSocketConnect] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [onGoingCall, setOnGoingCall] = useState<OnCall | null>(null);
  const currentSocketUser = onlineUsers?.find(
    (onlineUsers) => onlineUsers.userId === user?.id
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);


  const getMediaStream = useCallback(async(faceMode?: string) => {
    if(localStream){
      return localStream;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: {min: 640, ideal: 1280, max: 1920 },
          height: {min: 480, ideal: 720, max: 1080 },
          deviceId: videoDevices.length > 0 ? faceMode : undefined
        }
      })
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.log("Failed to get the stream", error)
      setLocalStream(null);
      return null;
    }
  }, [localStream])

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!currentSocketUser) return;

      const stream = await getMediaStream();

      if(!stream){
        console.log("No media stream available");
        openModal({
          title: 'พบข้อผิดพลาด',
          description: 'ไม่สามารถเข้าถึงสตรีมมีเดียได้ กรุณาตรวจสอบการอนุญาตใช้งานกล้องและไมโครโฟน',
        })
        return;
      }

      const participants = { caller: currentSocketUser, receiver: user };
      setOnGoingCall({
        participants,
        isRinging: false,
      });
      socket?.emit("call", participants);
    },
    [socket, currentSocketUser, onGoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      if (onGoingCall && socket && user) {
        socket.emit("hangup", {
          ongoingCall: {
            participants,
            isRinging: false,
          },
          userHangingupId: user.id,
        });
        return;
      }

      setOnGoingCall({
        participants,
        isRinging: true,
      });
    },
    [onGoingCall, socket, user]
  );

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      if (socket) {
        setIsSocketConnect(true);
      }
    }

    function onDisconnect() {
      setIsSocketConnect(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  //set online users
  useEffect(() => {
    if (!socket || !isSocketConnect) return;

    socket.emit("addNewUser", user);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnect, user]);

  //call events
  useEffect(() => {
    if (!socket || !isSocketConnect) return;

    socket.on("incomingCall", onIncomingCall);
    return () => {
      socket.off("incomingCall", onIncomingCall);
    };
  }, [socket, isSocketConnect, user, onIncomingCall]);

  return (
    <SocketContext.Provider value={{ onlineUsers, handleCall, onGoingCall, localStream }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("useSocket need a SocketProvider");
  }

  return context;
};
