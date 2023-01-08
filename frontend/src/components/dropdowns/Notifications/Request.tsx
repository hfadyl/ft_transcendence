import Avatar from "@/components/Avatar";
import moment from "moment";
import { Notification, useSocket } from "@/src/context/socket";

const Request: React.FC<{ data: Notification }> = ({ data }) => {
  const { id, sender, senderId, message, image, seen, createdAt } = data;
  const { updateNotification } = useSocket();

  const handleAccept = async () => {
    await fetch(`${process.env.USERS}/acceptfriendrequest?id=${senderId}`, {
      method: "POST",
      credentials: "include",
    }).then(() => updateNotification(id));
  };

  const handleDecline = async () => {
    await fetch(`${process.env.USERS}/declineFriendRequest?id=${senderId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => updateNotification(id));
  };
  return (
    <>
      <Avatar size={50} src={image} alt={sender} username={sender} />
      <div>
        <h6>
          <b>{message.split(" ")[0]}</b>
          <b>{message.substring(message.indexOf(" ") + 1)}</b>
        </h6>
        {!message.includes("accepted") && !seen && (
          <div className="actions">
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDecline} className="secondary">
              Decline
            </button>
          </div>
        )}
        <span className="time">{moment(createdAt).fromNow()}</span>
      </div>
    </>
  );
};
export default Request;
