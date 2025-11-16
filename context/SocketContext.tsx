/* eslint-disable react-hooks/set-state-in-effect */
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

interface iSocketContext {
  onlineUsers?: SocketUser[] | null;
  handleCall: (user: SocketUser) => void;
  onGoingCall?: OnCall | null;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnect, setIsSocketConnect] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [onGoingCall, setOnGoingCall] = useState<OnCall | null>(null);
  const currentSocketUser = onlineUsers?.find(
    (onlineUsers) => onlineUsers.userId === user?.id
  );

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!currentSocketUser) return;

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
    <SocketContext.Provider value={{ onlineUsers, handleCall, onGoingCall }}>
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
