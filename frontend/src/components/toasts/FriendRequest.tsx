import styled from "styled-components";

import { useSocket } from "@/src/context/socket";
import { Notification } from "@/src/context/socket";
import Avatar from "@/components/Avatar";
import Check from "@/images/icons/check.svg";
import Close from "@/images/icons/close.svg";

const FriendRequest: React.FC<Notification> = (props) => {
  const { id, sender, senderId, message, image, seen } = props;
  const { updateNotification } = useSocket();

  const makeNotificationSeen = async () => {
    await fetch(`${process.env.USERS}/notificationsSeen?id=${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      updateNotification(id);
    });
  };

  const handleAccept = async () => {
    await fetch(`${process.env.USERS}/acceptfriendrequest?id=${senderId}`, {
      method: "POST",
      credentials: "include",
    }).then(() => makeNotificationSeen());
  };

  const handleDecline = async () => {
    await fetch(`${process.env.USERS}/declineFriendRequest?id=${senderId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => updateNotification(id));
  };

  return (
    <Style>
      <Avatar src={image} alt={sender} size={40} username={sender} />
      <span>{message}</span>
      {!message.includes("accepted") && !seen && (
        <div className="actions">
          <button onClick={handleAccept} className="icon primary">
            <Check />
          </button>
          <button onClick={handleDecline} className="icon secondary">
            <Close />
          </button>
        </div>
      )}
    </Style>
  );
};

export default FriendRequest;

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
