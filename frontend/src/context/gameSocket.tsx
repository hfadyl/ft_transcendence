import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/src/context/auth";
import InvitePlayToast from "@/components/toasts/PlayRequest";

interface GameSocket {
  socket: Socket | null;
  lives: any;
  joinQueue: () => void;
  achievements: string[];
  setAchievements: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface PlayInvite {
  id: string;
  username: string;
  message: string;
  avatar: string;
}

const GameContext = createContext<GameSocket>({
  socket: null,
  lives: null,
  joinQueue: () => {},
  achievements: [],
  setAchievements: () => {},
});

export const useGame = () => useContext(GameContext);

export const GameSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lives, setLives] = useState<any>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io(`${process.env.SERVER_URL}/game`, {
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
    if (!user || !socket) return;
    socket?.emit("getLiveGames_F", user.username);
    socket?.off("liveGames").on("liveGames", (rooms: any) => {
      setLives(rooms);
    });
    socket?.off("invitation").on("invitation", (data: PlayInvite) => {
      toast(<InvitePlayToast {...data} />, {
        position: "bottom-right",
        closeButton: false,
        className: "toast",
        bodyClassName: "friend-request-toast",
        autoClose: 10000,
      });
    });
    socket?.off("gameEnds").on("gameEnds", (state) => {
      toast.info(`you ${state} the previous game`);
    });

    socket?.off("achievement").on("achievement", (achievement) => {
      setAchievements((prev) => [...prev, achievement.toString()]);
    });

    return () => {
      socket?.off("liveGames");
      socket?.off("invitation");
      socket?.off("gameEnds");
    };
  }, [user, socket]);

  const joinQueue = () => {
    if (!socket) return;
    socket.emit("joinRoom_F", user, "", "toPlay");
  };

  return (
    <GameContext.Provider value={{ socket, lives, joinQueue, achievements, setAchievements }}>
      {children}
    </GameContext.Provider>
  );
};
