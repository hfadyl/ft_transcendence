import Router from "next/router";
import { useGame } from "@/src/context/gameSocket";
import { useSocket } from "@/src/context/socket";

export const useInvitePlayer = () => {
  const socket = useGame()?.socket;
  const { getStatus } = useSocket();

  const handleInvite = async (username: string) => {
    if (!socket || getStatus(username) !== "online") return;
    socket.emit("inviteToPlay", username);
    Router.push("/game?map=map_1&requestType=toInvite");
  };

  return { handleInvite };
};
