import styled from "styled-components";

import { useGame, PlayInvite } from "@/src/context/gameSocket";
import { Notification } from "@/src/context/socket";
import Avatar from "@/components/Avatar";
import Check from "@/images/icons/check.svg";
import Close from "@/images/icons/close.svg";
import { useAuth } from "@/src/context/auth";
import { useRouter } from "next/router";

const PlayRequest: React.FC<PlayInvite> = (props) => {
  const { id, username, message, avatar } = props;
  const socket = useGame()?.socket;
  // const { user } = useAuth();
  const router = useRouter();

  const handleAccept = async () => {
    socket?.emit("acceptPlayRequest", username);
    socket?.off("getInvitationRoomId").on("getInvitationRoomId", (room: string, roomReserved: boolean) => {
      if (roomReserved) router.push(`/game/${room}?requestType=invited`);
    });
  };

  const handleDecline = async () => {
    socket?.emit("declinePlayRequest");
  };

  // console.log("message", message);

  return (
    <Style>
      <Avatar src={avatar} alt={username} size={40} username={username} />
      <span>{message}</span>
      <div className="actions">
        <button onClick={handleAccept} className="icon primary">
          <Check />
        </button>
        <button onClick={handleDecline} className="icon secondary">
          <Close />
        </button>
      </div>
    </Style>
  );
};

export default PlayRequest;

const Style = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .actions {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;
