import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { useSound } from "use-sound";

import { MessagesType } from "@/src/layout/messenger/interfaces";
import MessageToast from "@/components/toasts/MessageToast";
import { useAuth } from "@/src/context/auth";

interface ChatSocket {
  socket: Socket | null;
  message: MessagesType | null;
  setMessage: React.Dispatch<React.SetStateAction<MessagesType | null>>;
}

const ChatContext = createContext<ChatSocket>({
  socket: null,
  message: null,
  setMessage: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<MessagesType | null>(null);
  const { pathname } = useRouter();
  const { user } = useAuth();
  const [play] = useSound("/sounds/message.mp3", { volume: 0.5 });

  useEffect(() => {
    const newSocket = io(`${process.env.SERVER_URL}/chat`, {
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    return () => {
      socket.close();
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !user) return;
    socket?.off("chatToClient").on("chatToClient", (msg: MessagesType) => {
      if (!msg.blockedUsers.includes(user?.username) && !msg.bannedUsers.includes(user?.username)) {
        setMessage(msg);
        if (pathname !== "/messages/[id]") {
          play();
          toast(<MessageToast {...msg} />, {
            closeButton: false,
            className: "toast",
            bodyClassName: "friend-request-toast",
          });
        }
      }
    });

    return () => {
      socket?.off("chatToClient");
    };
  }, [socket, pathname, user, play]);

  return (
    <ChatContext.Provider value={{ socket, message, setMessage }}>{children}</ChatContext.Provider>
  );
};
