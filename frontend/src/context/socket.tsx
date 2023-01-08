import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Socket, io } from "socket.io-client";
import { toast } from "react-toastify";
import FriendReqToast from "@/components/toasts/FriendRequest";
import Router from "next/router";

interface Users {
  login: string;
  inGame: boolean;
}

export interface Notification {
  id: string;
  type: "request" | "message" | "game";
  sender: string;
  senderId: string;
  message: string;
  image: string;
  reciver: string;
  reciverId: string;
  createdAt: Date;
  seen: boolean;
}

interface ContextType {
  getStatus: (username: string) => "online" | "offline" | "inGame";
  notifications: Notification[];
  updateNotifications: () => void;
  updateNotification: (id: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Context = createContext<ContextType>({
  getStatus: (username: string) => "offline",
  notifications: [],
  updateNotifications: () => {},
  updateNotification: (id: string) => {},
  setNotifications: () => {},
});

export const useSocket = () => useContext(Context);

let socket: Socket;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketInitializer = async () => {
    socket = io(`${process.env.SERVER_URL}/status`, {
      withCredentials: true,
    });

    socket?.on("connect_error", (err) => {
      toast.error(`connect_error due to ${err.message}`);
      socket.disconnect();
      Router.push("/login");
    });

    socket?.off("activeUsers").on("activeUsers", (users: []) => {
      setUsers(users);
    });

    socket?.off("notification").on("notification", (n: Notification) => {
      setNotifications((prev) => [
        n,
        ...prev.filter((p) => p.type !== n.type || p.senderId !== n.senderId),
      ]);
      if (n.type === "request") {
        toast(<FriendReqToast {...n} />, {
          closeButton: false,
          className: "toast",
          bodyClassName: "friend-request-toast",
        });
      }
    });
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatus = useCallback(
    (username: string): "online" | "offline" | "inGame" => {
      let ret: "online" | "offline" | "inGame" = "offline";
      users.forEach((user) => {
        if (user.login === username) ret = user.inGame ? "inGame" : "online";
      });
      return ret;
    },
    [users]
  );

  const updateNotifications = useCallback(() => {
    setNotifications((prev) => {
      const newNotifications = prev.map((n) => {
        n.seen = true;
        return n;
      });
      return newNotifications;
    });
  }, []);

  const updateNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const newNotifications = prev.map((n) => {
        if (n.id === id) n.seen = true;
        return n;
      });
      return newNotifications;
    });
  }, []);

  return (
    <Context.Provider
      value={{
        getStatus,
        notifications,
        updateNotifications,
        updateNotification,
        setNotifications,
      }}
    >
      {children}
    </Context.Provider>
  );
};
